/**
 * CIC Competency Framework System
 * Authentication Module
 * 
 * Handles Firebase Authentication for login, registration, logout,
 * and role-based access control for HR and Employee portals.
 */

// ============================================================================
// AUTHENTICATION STATE
// ============================================================================

const AuthState = {
    user: null,
    userData: null,
    isAuthenticated: false,
    isLoading: true
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Initialize authentication observer
 * Watches for auth state changes and handles redirects
 */
function initAuth() {
    firebase.auth().onAuthStateChanged(async (user) => {
        AuthState.isLoading = true;

        if (user) {
            AuthState.user = user;
            AuthState.isAuthenticated = true;

            // Fetch user data from Firestore
            try {
                const userData = await getUserData(user.uid);
                AuthState.userData = userData;

                // Handle redirect based on current page and role
                handleAuthRedirect();
            } catch (error) {
                console.error('Error fetching user data:', error);
                AuthState.userData = null;
            }
        } else {
            AuthState.user = null;
            AuthState.userData = null;
            AuthState.isAuthenticated = false;

            // Redirect to login if on protected page
            handleUnauthenticatedRedirect();
        }

        AuthState.isLoading = false;

        // Notify listeners
        if (typeof onAuthStateChange === 'function') {
            onAuthStateChange(AuthState);
        }
    });
}

/**
 * Login with email and password
 */
async function login(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Login successful:', userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Login error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Register a new user
 */
async function register(email, password, userData) {
    try {
        // Create auth account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Determine if user is a supervisor based on position
        const isSupervisor = await checkIfSupervisorPosition(userData.positionId);

        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            name: userData.name,
            positionId: userData.positionId,
            departmentId: userData.departmentId,
            role: userData.role || 'employee',
            isSupervisor: isSupervisor,
            supervisorId: userData.supervisorId || null,
            subordinateIds: [],
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Registration successful:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Registration error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Logout current user
 */
async function logout() {
    try {
        await firebase.auth().signOut();
        console.log('✅ Logout successful');
        window.location.href = '/login.html';
        return { success: true };
    } catch (error) {
        console.error('❌ Logout error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send password reset email
 */
async function sendPasswordReset(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        console.error('❌ Password reset error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ============================================================================
// USER DATA FUNCTIONS
// ============================================================================

/**
 * Get user data from Firestore
 */
async function getUserData(userId) {
    console.log(`🔍 Fetching user data for UID: ${userId}`);
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const data = doc.data();
            console.log('✅ User data found:', data);
            return { id: doc.id, ...data };
        }
        console.warn(`⚠️ No document found for user UID: ${userId}`);
        return null;
    } catch (error) {
        console.error(`❌ Error fetching user data for ${userId}:`, error);
        return null;
    }
}

/**
 * Update user data in Firestore
 */
async function updateUserData(userId, data) {
    try {
        await db.collection('users').doc(userId).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating user data:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if a position is a supervisor position
 */
async function checkIfSupervisorPosition(positionId) {
    // Supervisor positions typically include:
    // - President, SVP roles
    // - Department Managers
    // - Unit Heads
    // - Anyone with "Chief", "Head", "Manager", "Director" in title
    const supervisorKeywords = [
        'president', 'svp', 'manager', 'chief', 'head',
        'director', 'attorney-v', 'internal-auditor-v'
    ];

    return supervisorKeywords.some(keyword =>
        positionId.toLowerCase().includes(keyword)
    );
}

/**
 * Get current user's role
 */
function getCurrentUserRole() {
    return AuthState.userData?.role || 'employee';
}

/**
 * Check if current user is HR or Admin
 */
function isHROrAdmin() {
    const role = getCurrentUserRole();
    return role === 'hr' || role === 'admin';
}

/**
 * Check if current user is a supervisor
 */
function isSupervisor() {
    return AuthState.userData?.isSupervisor || false;
}

// ============================================================================
// REDIRECT HANDLING
// ============================================================================

/**
 * Handle redirect based on user role after authentication
 */
function handleAuthRedirect() {
    const currentPath = window.location.pathname;
    const role = getCurrentUserRole();

    // If on login or register page, redirect to appropriate portal
    if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
        if (role === 'hr' || role === 'admin') {
            window.location.href = '/index.html';
        } else {
            window.location.href = '/employee/index.html';
        }
        return;
    }

    // Check access permissions
    const isHRPortal = currentPath === '/' || currentPath === '/index.html';
    const isEmployeePortal = currentPath.includes('/employee/');

    if (isHRPortal && !isHROrAdmin()) {
        // Non-HR trying to access HR portal
        console.warn('⚠️ Access denied to HR portal, redirecting to Employee Portal');
        window.location.href = '/employee/index.html';
    }
}

/**
 * Handle redirect when user is not authenticated
 */
function handleUnauthenticatedRedirect() {
    const currentPath = window.location.pathname;

    // Don't redirect if already on login or register page
    if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
        return;
    }

    // Redirect to login
    console.log('⚠️ Not authenticated, redirecting to login');
    window.location.href = '/login.html';
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please login or use a different email.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact administrator.',
        'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled. Please contact administrator.',
        'auth/user-not-found': 'No account found with this email. Please register first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

window.AuthState = AuthState;
window.initAuth = initAuth;
window.login = login;
window.register = register;
window.logout = logout;
window.sendPasswordReset = sendPasswordReset;
window.getUserData = getUserData;
window.updateUserData = updateUserData;
window.getCurrentUserRole = getCurrentUserRole;
window.isHROrAdmin = isHROrAdmin;
window.isSupervisor = isSupervisor;
window.checkIfSupervisorPosition = checkIfSupervisorPosition;

console.log('🔐 Auth module loaded');
