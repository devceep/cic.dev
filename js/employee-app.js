/**
 * CIC Competency Framework System
 * Employee Portal Controller
 * 
 * Handles all employee-side functionality including self-assessment,
 * peer rating, gap analysis, development plans, and supervisor features.
 */

// ============================================================================
// EMPLOYEE APP STATE
// ============================================================================

const EmployeeState = {
    user: null,
    userData: null,
    currentView: 'dashboard',
    competencies: [],
    positions: [],
    currentAssessment: null,
    currentCycle: null,
    peerAssignments: [],
    subordinates: [],
    developmentPlan: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Employee Portal Initializing...');

    // Initialize auth and wait for user
    initAuth();

    // Auth state observer callback
    window.onAuthStateChange = async (authState) => {
        if (authState.isLoading) return;

        if (!authState.isAuthenticated) {
            // Not logged in - redirect to login
            window.location.href = '/login.html';
            return;
        }

        // Store user data
        EmployeeState.user = authState.user;
        EmployeeState.userData = authState.userData;

        // Fallback: If userData is missing but user is authenticated, try fetching manually
        if (!EmployeeState.userData && EmployeeState.user) {
            console.log('🔄 User data missing from auth state, attempting manual fetch...');
            EmployeeState.userData = await getUserData(EmployeeState.user.uid);
            console.log('🔄 Manual fetch result:', EmployeeState.userData);
        }

        // Check if user is HR trying to access employee portal (allow it)
        // HR can access both portals

        try {
            // Load initial data
            await loadEmployeeData();

            // Update UI with user info
            updateUserUI();

            // Show/hide supervisor section based on role
            if (EmployeeState.userData?.isSupervisor) {
                document.getElementById('supervisorSection').classList.remove('hidden');
            }

            // Initialize dashboard
            loadDashboardData();

            console.log('✅ Employee Portal initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Employee Portal:', error);
            showToast('Error loading data. Please refresh.', 'error');
        }
    };
});

/**
 * Load employee-specific data
 */
async function loadEmployeeData() {
    try {
        // Load competencies
        const competencies = await getAllCompetencies();
        if (competencies.length > 0) {
            EmployeeState.competencies = competencies;
        } else {
            // Use static data - include all 13 competencies
            EmployeeState.competencies = [
                ...(window.CIC_CORE_COMPETENCIES || []),
                ...(window.CSC_LEADERSHIP_COMPETENCIES || []),
                ...(window.CIC_FUNCTIONAL_COMPETENCIES || [])
            ];
        }

        // Load positions
        const positions = await getAllPositions();
        if (positions.length > 0) {
            EmployeeState.positions = positions;
        } else {
            EmployeeState.positions = CIC_POSITIONS;
        }

        // Load current cycle
        await loadCurrentCycle();

        // Load current assessment
        await loadCurrentAssessment();

        // Load peer assignments
        await loadPeerAssignments();

        // If supervisor, load subordinates
        if (EmployeeState.userData?.isSupervisor) {
            await loadSubordinates();
        }

        console.log('📚 Employee data loaded');
    } catch (error) {
        console.error('Error loading employee data:', error);
    }
}

/**
 * Load current active assessment cycle
 */
async function loadCurrentCycle() {
    try {
        const snapshot = await db.collection('assessment_cycles')
            .where('status', '==', 'active')
            .limit(1)
            .get();

        if (!snapshot.empty) {
            EmployeeState.currentCycle = {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            };
        }
    } catch (error) {
        console.log('No active cycle found:', error.message);
    }
}

/**
 * Load current user's assessment
 */
async function loadCurrentAssessment() {
    if (!EmployeeState.currentCycle || !EmployeeState.user) return;

    try {
        const snapshot = await db.collection('assessments')
            .where('cycleId', '==', EmployeeState.currentCycle.id)
            .where('subjectUserId', '==', EmployeeState.user.uid)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            EmployeeState.currentAssessment = {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            };
        }
    } catch (error) {
        console.log('No assessment found:', error.message);
    }
}

/**
 * Load peer assessments assigned to this user
 */
async function loadPeerAssignments() {
    if (!EmployeeState.currentCycle || !EmployeeState.user) return;

    try {
        // Find assessments where this user is assigned as a peer rater
        const snapshot = await db.collection('assessments')
            .where('cycleId', '==', EmployeeState.currentCycle.id)
            .where('assignedPeerRaterIds', 'array-contains', EmployeeState.user.uid)
            .get();

        EmployeeState.peerAssignments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Update badge
        const pendingCount = EmployeeState.peerAssignments.filter(a =>
            !a.completedPeerRaters?.includes(EmployeeState.user.uid)
        ).length;

        document.getElementById('peerRatingBadge').textContent = pendingCount;
        if (pendingCount === 0) {
            document.getElementById('peerRatingBadge').style.display = 'none';
        }

    } catch (error) {
        console.log('Error loading peer assignments:', error.message);
    }
}

/**
 * Load subordinates for supervisors
 */
async function loadSubordinates() {
    if (!EmployeeState.user) return;

    try {
        const snapshot = await db.collection('users')
            .where('supervisorId', '==', EmployeeState.user.uid)
            .where('status', '==', 'active')
            .get();

        EmployeeState.subordinates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Update superior assessment badge
        const pendingCount = await countPendingSuperiorAssessments();
        document.getElementById('superiorAssessmentBadge').textContent = pendingCount;
        if (pendingCount === 0) {
            document.getElementById('superiorAssessmentBadge').style.display = 'none';
        }

    } catch (error) {
        console.log('Error loading subordinates:', error.message);
    }
}

/**
 * Count pending superior assessments
 */
async function countPendingSuperiorAssessments() {
    if (!EmployeeState.currentCycle) return 0;

    try {
        const snapshot = await db.collection('assessments')
            .where('cycleId', '==', EmployeeState.currentCycle.id)
            .where('superiorUserId', '==', EmployeeState.user.uid)
            .where('superiorAssessmentStatus', '==', 'pending')
            .get();

        return snapshot.size;
    } catch (error) {
        return 0;
    }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

/**
 * Update UI with user information
 */
function updateUserUI() {
    console.log('🔄 Updating User UI...', EmployeeState.userData);
    const userData = EmployeeState.userData;
    if (!userData) {
        console.warn('⚠️ No user data found in EmployeeState');
        return;
    }

    try {
        // Get position info - try EmployeeState first, then fallback to window.CIC_POSITIONS
        let position = EmployeeState.positions.find(p => p.id === userData.positionId);
        if (!position && window.CIC_POSITIONS) {
            position = window.CIC_POSITIONS.find(p => p.id === userData.positionId);
        }

        // Get department info - try to find by departmentId or from position
        let departmentName = position?.department || '';
        if (!departmentName && userData.departmentId && window.CIC_DEPARTMENTS) {
            const dept = window.CIC_DEPARTMENTS.find(d => d.id === userData.departmentId);
            departmentName = dept?.name || userData.departmentId || '';
        }

        // Use position title, or try to format positionId as readable
        const positionTitle = position?.title || (userData.positionId ? formatIdAsTitle(userData.positionId) : '');

        // Header user info
        const setElText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        const setElValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        };

        setElText('userName', userData.name || 'User');
        setElText('userPosition', positionTitle || 'Position');
        setElText('userAvatar', getInitials(userData.name));

        // Profile page
        setElValue('profileName', userData.name || '');
        setElValue('profileEmail', userData.email || '');
        setElValue('profileDepartment', departmentName);
        setElValue('profilePositionTitle', positionTitle);
        setElText('profileAvatar', getInitials(userData.name));
        setElText('profileDisplayName', userData.name || 'User');
        setElText('profileDisplayPosition', positionTitle);
        setElText('profileRole', capitalizeFirst(userData.role || 'Employee'));
        setElText('profileRequiredLevel', position?.requiredLevelName || '--');

        // Supervisor badge
        const supervisorBadge = document.getElementById('profileSupervisorBadge');
        const supervisorStatus = document.getElementById('profileSupervisorStatus');
        if (userData.isSupervisor) {
            if (supervisorBadge) supervisorBadge.classList.remove('hidden');
            if (supervisorStatus) supervisorStatus.classList.add('hidden');
        } else {
            if (supervisorBadge) supervisorBadge.classList.add('hidden');
            if (supervisorStatus) supervisorStatus.classList.remove('hidden');
        }

        // Self-assessment position info
        setElText('empPositionName', positionTitle || 'Unknown Position');
        setElText('empRequiredLevel', position?.requiredLevelName || 'N/A');

        // Update assessment status badge
        const statusBadge = document.getElementById('empAssessmentStatus');
        const selfBadge = document.getElementById('selfAssessmentBadge');
        if (EmployeeState.currentAssessment?.selfAssessmentStatus === 'completed') {
            if (statusBadge) {
                statusBadge.className = 'badge badge-success';
                statusBadge.textContent = 'Completed';
            }
            if (selfBadge) selfBadge.style.display = 'none';
        }

        console.log('✅ User UI updated successfully');
    } catch (error) {
        console.error('❌ Error in updateUserUI:', error);
    }
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    const userData = EmployeeState.userData;
    const cycle = EmployeeState.currentCycle;
    const assessment = EmployeeState.currentAssessment;

    // Welcome message
    document.getElementById('welcomeMessage').textContent =
        `Welcome back, ${userData?.name?.split(' ')[0] || 'User'}!`;

    // Cycle status
    if (cycle) {
        const endDate = cycle.endDate?.toDate?.() || new Date(cycle.endDate);
        document.getElementById('cycleStatus').textContent =
            `Current Assessment Cycle: ${cycle.name} (Ends: ${formatDate(endDate)})`;
        document.getElementById('selfAssessmentDeadline').textContent = `Due: ${formatDate(endDate)}`;
    } else {
        document.getElementById('cycleStatus').textContent = 'No active assessment cycle';
    }

    // Self assessment status
    if (assessment?.selfAssessmentStatus === 'completed') {
        document.getElementById('selfAssessmentStatus').textContent = 'Completed';
        document.getElementById('selfAssessmentStatus').className = 'stat-value text-green-600';
    } else {
        document.getElementById('selfAssessmentStatus').textContent = 'Pending';
    }

    // Peer reviews
    const peerCount = EmployeeState.peerAssignments.filter(a =>
        !a.completedPeerRaters?.includes(EmployeeState.user?.uid)
    ).length;
    document.getElementById('peerReviewCount').textContent = peerCount;

    // Update progress steps
    updateProgressSteps();
}

/**
 * Update progress steps visualization
 */
function updateProgressSteps() {
    const assessment = EmployeeState.currentAssessment;

    // Self assessment step
    if (assessment?.selfAssessmentStatus === 'completed') {
        document.getElementById('empStepSelf').classList.add('completed');
        document.getElementById('empLineSelfPeer').classList.add('active');
    } else {
        document.getElementById('empStepSelf').classList.add('active');
    }

    // Peer assessment step
    if (assessment?.peerAssessmentStatus === 'completed') {
        document.getElementById('empStepPeer').classList.add('completed');
        document.getElementById('empStepPeer').classList.remove('pending');
        document.getElementById('empLinePeerSuperior').classList.add('active');
    } else if (assessment?.peerAssessmentStatus === 'partial') {
        document.getElementById('empStepPeer').classList.add('active');
        document.getElementById('empStepPeer').classList.remove('pending');
    }

    // Superior assessment step
    if (assessment?.superiorAssessmentStatus === 'completed') {
        document.getElementById('empStepSuperior').classList.add('completed');
        document.getElementById('empStepSuperior').classList.remove('pending');
        document.getElementById('empLineSuperiorComplete').classList.add('active');
    }

    // Complete step
    if (assessment?.status === 'completed') {
        document.getElementById('empStepComplete').classList.add('completed');
        document.getElementById('empStepComplete').classList.remove('pending');
    }
}

// ============================================================================
// VIEW NAVIGATION
// ============================================================================

function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    // Update page title
    const pageTitles = {
        'dashboard': 'Dashboard',
        'competency-library': 'Competency Library',
        'self-assessment': 'Self Assessment',
        'rate-peers': 'Rate My Peers',
        'my-gap-analysis': 'My Gap Analysis',
        'development-plan': 'Development Plan',
        'my-subordinates': 'My Subordinates',
        'superior-assessment': 'Rate Subordinates',
        'team-gap-analysis': 'Team Gap Analysis',
        'profile': 'My Profile'
    };
    document.getElementById('pageTitle').textContent = pageTitles[viewName] || 'Dashboard';

    // Close mobile sidebar
    closeSidebar();

    // View-specific initialization
    EmployeeState.currentView = viewName;
    onViewChange(viewName);
}

function onViewChange(viewName) {
    switch (viewName) {
        case 'competency-library':
            renderCompetencyLibrary();
            break;
        case 'self-assessment':
            initSelfAssessment();
            break;
        case 'rate-peers':
            renderPeerAssignments();
            break;
        case 'my-gap-analysis':
            renderGapAnalysis();
            break;
        case 'development-plan':
            renderDevelopmentPlan();
            break;
        case 'my-subordinates':
            renderSubordinates();
            break;
        case 'superior-assessment':
            renderSuperiorAssessments();
            break;
        case 'profile':
            updateUserUI();
            break;
    }
}

// ============================================================================
// SIDEBAR CONTROLS
// ============================================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// ============================================================================
// COMPETENCY LIBRARY (READ-ONLY)
// ============================================================================

function renderCompetencyLibrary(filterType = 'all') {
    const container = document.getElementById('competencyLibraryContainer');
    if (!container) return;

    container.innerHTML = '';

    // Fallback to window variables if EmployeeState is empty
    let competencies = EmployeeState.competencies;
    if (!competencies || competencies.length === 0) {
        competencies = [
            ...(window.CIC_CORE_COMPETENCIES || []),
            ...(window.CSC_LEADERSHIP_COMPETENCIES || []),
            ...(window.CIC_FUNCTIONAL_COMPETENCIES || [])
        ];
        EmployeeState.competencies = competencies;
    }

    // Filter by type if specified
    let filteredCompetencies = competencies;
    if (filterType !== 'all') {
        filteredCompetencies = competencies.filter(c => c.type === filterType);
    }

    // Empty state
    if (filteredCompetencies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p class="empty-title">No Competencies Found</p>
                <p class="empty-description">No competencies match the selected filter.</p>
            </div>
        `;
        return;
    }

    filteredCompetencies.forEach(comp => {
        // Determine badge class based on type
        const badgeClass = comp.type === 'Core' ? 'badge-warning'
            : comp.type === 'Leadership' ? 'badge-info'
                : 'badge-success';

        // Use proficiencyLevels or levels depending on data structure
        const levels = comp.proficiencyLevels || comp.levels || [];

        const card = document.createElement('div');
        card.className = 'card competency-card mb-4';
        card.setAttribute('data-type', comp.type);
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="badge ${badgeClass}">${comp.type}</span>
                    <h3 class="card-title mt-2">${comp.id}: ${comp.name}</h3>
                </div>
            </div>
            <div class="card-body">
                <p class="text-gray-600 mb-4">${comp.description}</p>
                
                <h4 class="font-medium text-gray-900 mb-2">Proficiency Levels & Behavioral Indicators</h4>
                <div class="space-y-3">
                    ${levels.map(level => `
                        <div class="border-l-4 border-blue-400 pl-3 py-1">
                            <p class="font-medium text-sm">Level ${level.level}: ${level.name}</p>
                            <p class="text-gray-500 text-sm">${level.description}</p>
                            <ul class="text-xs text-gray-500 mt-1 list-disc pl-4">
                                ${(level.indicators || []).slice(0, 2).map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Update filter button states
    document.querySelectorAll('#view-competency-library button[onclick^="filterCompetencies"]').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    const activeBtn = document.getElementById(`filter${filterType === 'all' ? 'All' : filterType}`);
    if (activeBtn) {
        activeBtn.classList.remove('btn-secondary');
        activeBtn.classList.add('btn-primary');
    }
}

function filterCompetencies(type) {
    // Re-render with the selected filter type
    renderCompetencyLibrary(type);
}

// ============================================================================
// SELF ASSESSMENT
// ============================================================================

function initSelfAssessment() {
    const container = document.getElementById('assessmentFormContainer');
    container.innerHTML = '';

    // Get user's position to determine required competencies
    const position = EmployeeState.positions.find(p =>
        p.id === EmployeeState.userData?.positionId
    );

    const requiredLevel = position?.requiredLevel || 3;
    const competencyIds = position?.competencyIds || [];

    // Filter competencies for this position
    let positionCompetencies = EmployeeState.competencies;
    if (competencyIds.length > 0) {
        positionCompetencies = EmployeeState.competencies.filter(c =>
            competencyIds.includes(c.id)
        );
    }

    // Render assessment items
    positionCompetencies.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="badge ${comp.type === 'Leadership' ? 'badge-info' : 'badge-success'}">${comp.type}</span>
                    <h3 class="card-title mt-2">${comp.id}: ${comp.name}</h3>
                </div>
                <span class="badge badge-outline required-level">Required: Level ${requiredLevel}</span>
            </div>
            <div class="card-body">
                <p class="text-gray-600 mb-4">${comp.description}</p>
                
                <div class="rating-options">
                    ${(comp.proficiencyLevels || comp.levels || []).map(level => `
                        <label class="rating-option" data-competency="${comp.id}" data-level="${level.level}">
                            <input type="radio" name="rating-${comp.id}" value="${level.level}" class="rating-input" onchange="onRatingChange('${comp.id}', ${level.level})">
                            <div class="rating-content">
                                <div class="rating-header">
                                    <span class="rating-level">Level ${level.level}</span>
                                    <span class="rating-name">${level.name}</span>
                                </div>
                                <p class="rating-description">${level.description}</p>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Show submit section
    document.getElementById('assessmentSubmitSection').classList.remove('hidden');

    // If already completed, show completed state
    if (EmployeeState.currentAssessment?.selfAssessmentStatus === 'completed') {
        showToast('You have already completed your self-assessment.', 'info');
        // Could load existing ratings here
    }
}

function onRatingChange(competencyId, level) {
    // Visual feedback
    const options = document.querySelectorAll(`[data-competency="${competencyId}"]`);
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (parseInt(opt.dataset.level) === level) {
            opt.classList.add('selected');
        }
    });
}

async function submitSelfAssessment(event) {
    event.preventDefault();

    // Collect all ratings
    const ratings = {};
    const form = event.target;
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        if (key.startsWith('rating-')) {
            const competencyId = key.replace('rating-', '');
            ratings[competencyId] = parseInt(value);
        }
    });

    // Validate that all competencies are rated
    const position = EmployeeState.positions.find(p =>
        p.id === EmployeeState.userData?.positionId
    );
    const competencyIds = position?.competencyIds || EmployeeState.competencies.map(c => c.id);

    const missingRatings = competencyIds.filter(id => !ratings[id]);
    if (missingRatings.length > 0) {
        showToast(`Please rate all competencies. Missing: ${missingRatings.join(', ')}`, 'error');
        return;
    }

    showLoading(true);

    try {
        // Submit to Firestore
        const assessmentId = EmployeeState.currentAssessment?.id ||
            `assessment-${EmployeeState.user.uid}-${EmployeeState.currentCycle?.id || 'manual'}`;

        // Create or update assessment
        await db.collection('assessments').doc(assessmentId).set({
            cycleId: EmployeeState.currentCycle?.id || 'manual',
            subjectUserId: EmployeeState.user.uid,
            subjectPositionId: EmployeeState.userData?.positionId,
            selfAssessmentStatus: 'completed',
            selfAssessmentDate: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'in_progress',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Save self-assessment ratings
        await db.collection('assessment_ratings').add({
            assessmentId: assessmentId,
            raterId: EmployeeState.user.uid,
            raterType: 'self',
            ratings: ratings,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Self-assessment submitted successfully!', 'success');

        // Update local state
        EmployeeState.currentAssessment = {
            ...EmployeeState.currentAssessment,
            id: assessmentId,
            selfAssessmentStatus: 'completed'
        };

        updateUserUI();
        updateProgressSteps();

        // Redirect to gap analysis
        setTimeout(() => {
            showView('my-gap-analysis');
        }, 1500);

    } catch (error) {
        console.error('Error submitting self-assessment:', error);
        showToast('Error submitting assessment. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================================================
// PEER ASSESSMENT
// ============================================================================

async function renderPeerAssignments() {
    const container = document.getElementById('peerAssignmentsContainer');

    if (EmployeeState.peerAssignments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p class="empty-title">No Peer Assessments Assigned</p>
                <p class="empty-description">HR has not assigned any peer assessments to you yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '<div class="space-y-4" id="peerAssessmentsList"></div>';
    const list = document.getElementById('peerAssessmentsList');

    for (const assignment of EmployeeState.peerAssignments) {
        // Get subject user info
        const subjectUser = await getUserData(assignment.subjectUserId);
        const isCompleted = assignment.completedPeerRaters?.includes(EmployeeState.user.uid);

        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="user-avatar">${getInitials(subjectUser?.name || 'Unknown')}</div>
                <div>
                    <p class="font-medium">${subjectUser?.name || 'Unknown User'}</p>
                    <p class="text-sm text-gray-500">${getPositionTitle(subjectUser?.positionId)}</p>
                </div>
            </div>
            <div>
                ${isCompleted
                ? '<span class="badge badge-success">Completed</span>'
                : `<button class="btn btn-primary" onclick="startPeerAssessment('${assignment.id}', '${assignment.subjectUserId}')">Rate Now</button>`
            }
            </div>
        `;
        list.appendChild(item);
    }
}

/**
 * Start peer assessment - open modal and load competencies
 */
async function startPeerAssessment(assessmentId, subjectUserId) {
    // Store current peer assessment data
    window.currentPeerAssessment = { assessmentId, subjectUserId };

    try {
        // Get subject user info
        const subjectUser = await getUserData(subjectUserId);
        document.getElementById('peerSubjectName').textContent = subjectUser?.name || 'Unknown User';
        document.getElementById('peerSubjectPosition').textContent = getPositionTitle(subjectUser?.positionId);

        // Get subject's position to determine competencies
        const position = EmployeeState.positions.find(p => p.id === subjectUser?.positionId);
        const competencyIds = position?.competencyIds || EmployeeState.competencies.map(c => c.id);

        // Filter competencies for the subject's position
        let positionCompetencies = EmployeeState.competencies.filter(c =>
            competencyIds.includes(c.id)
        );

        // If no specific competencies, use all
        if (positionCompetencies.length === 0) {
            positionCompetencies = EmployeeState.competencies;
        }

        // Render competency rating items
        const container = document.getElementById('peerCompetencyRatings');
        container.innerHTML = positionCompetencies.map(comp => `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="badge ${comp.type === 'Core' ? 'badge-warning' : comp.type === 'Leadership' ? 'badge-info' : 'badge-success'} text-xs">${comp.type}</span>
                        <h4 class="font-medium mt-1">${comp.id}: ${comp.name}</h4>
                    </div>
                </div>
                <p class="text-sm text-gray-500 mb-3">${comp.description}</p>
                <div class="grid grid-cols-4 gap-2">
                    ${[1, 2, 3, 4].map(level => `
                        <label class="peer-rating-option cursor-pointer">
                            <input type="radio" name="peer-rating-${comp.id}" value="${level}" class="hidden peer" required>
                            <div class="p-2 text-center border rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors">
                                <p class="text-lg font-bold text-gray-700">${level}</p>
                                <p class="text-xs text-gray-500">${getLevelName(level)}</p>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Show modal
        const modal = document.getElementById('peerAssessmentModal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('open'), 10);

    } catch (error) {
        console.error('Error opening peer assessment:', error);
        showToast('Error loading peer assessment. Please try again.', 'error');
    }
}

/**
 * Close peer assessment modal
 */
function closePeerAssessmentModal() {
    const modal = document.getElementById('peerAssessmentModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
    window.currentPeerAssessment = null;
}

/**
 * Submit peer assessment
 */
async function submitPeerAssessment(event) {
    event.preventDefault();

    if (!window.currentPeerAssessment) {
        showToast('No peer assessment in progress.', 'error');
        return;
    }

    const { assessmentId, subjectUserId } = window.currentPeerAssessment;

    // Collect all ratings
    const ratings = {};
    const form = event.target;
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        if (key.startsWith('peer-rating-')) {
            const competencyId = key.replace('peer-rating-', '');
            ratings[competencyId] = parseInt(value);
        }
    });

    // Check if all competencies are rated
    const ratingCount = Object.keys(ratings).length;
    if (ratingCount === 0) {
        showToast('Please rate at least one competency.', 'warning');
        return;
    }

    showLoading(true);

    try {
        // Save peer rating to Firestore (anonymous)
        const peerRatingData = {
            assessmentId: assessmentId,
            subjectUserId: subjectUserId,
            raterUserId: EmployeeState.user.uid,
            raterType: 'peer',
            ratings: ratings,
            status: 'completed',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('peer_ratings').add(peerRatingData);

        // Update the assessment to track completed peer raters
        const assessmentRef = db.collection('assessments').doc(assessmentId);
        await assessmentRef.update({
            completedPeerRaters: firebase.firestore.FieldValue.arrayUnion(EmployeeState.user.uid),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Peer assessment submitted successfully! (Anonymous)', 'success');

        // Close modal and refresh data
        closePeerAssessmentModal();
        await loadPeerAssignments();
        renderPeerAssignments();
        loadDashboardData();

    } catch (error) {
        console.error('Error submitting peer assessment:', error);
        showToast('Error submitting peer assessment. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Get proficiency level name
 */
function getLevelName(level) {
    const names = {
        1: 'Basic',
        2: 'Intermediate',
        3: 'Advanced',
        4: 'Superior'
    };
    return names[level] || level;
}

// Export peer assessment functions
window.startPeerAssessment = startPeerAssessment;
window.closePeerAssessmentModal = closePeerAssessmentModal;
window.submitPeerAssessment = submitPeerAssessment;
window.getLevelName = getLevelName;

// ============================================================================
// GAP ANALYSIS
// ============================================================================

async function renderGapAnalysis() {
    const container = document.getElementById('gapAnalysisContent');

    if (!EmployeeState.currentAssessment?.selfAssessmentStatus ||
        EmployeeState.currentAssessment.selfAssessmentStatus !== 'completed') {
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p class="empty-title">Complete Your Assessment First</p>
                        <p class="empty-description">Gap analysis will be available after your self-assessment is complete.</p>
                        <button class="btn btn-primary mt-4" onclick="showView('self-assessment')">Start Self Assessment</button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // Load all ratings from Firestore
    try {
        const assessmentId = EmployeeState.currentAssessment.id;

        // Load self-assessment ratings
        const selfRatingsSnapshot = await db.collection('assessment_ratings')
            .where('assessmentId', '==', assessmentId)
            .where('raterType', '==', 'self')
            .limit(1)
            .get();

        if (selfRatingsSnapshot.empty) {
            container.innerHTML = '<p>No self-ratings found.</p>';
            return;
        }

        const selfRatings = selfRatingsSnapshot.docs[0].data().ratings;

        // Load peer ratings (anonymous aggregate)
        const peerRatingsSnapshot = await db.collection('peer_ratings')
            .where('subjectUserId', '==', EmployeeState.user.uid)
            .get();

        const peerRatings = {};
        let peerCount = 0;
        peerRatingsSnapshot.forEach(doc => {
            const ratings = doc.data().ratings;
            peerCount++;
            Object.entries(ratings).forEach(([compId, rating]) => {
                if (!peerRatings[compId]) peerRatings[compId] = [];
                peerRatings[compId].push(rating);
            });
        });

        // Load superior rating from assessment document
        const assessmentDoc = await db.collection('assessments').doc(assessmentId).get();
        const superiorRatings = assessmentDoc.exists ? assessmentDoc.data()?.superiorRatings || {} : {};

        const position = EmployeeState.positions.find(p =>
            p.id === EmployeeState.userData?.positionId
        );
        const requiredLevel = position?.requiredLevel || 3;

        // Calculate weighted scores (20% self, 30% peer, 50% superior)
        const weights = { self: 0.20, peer: 0.30, superior: 0.50 };
        const gaps = [];

        Object.entries(selfRatings).forEach(([compId, selfScore]) => {
            const competency = EmployeeState.competencies.find(c => c.id === compId);
            if (!competency) return;

            // Calculate peer average
            const peerScoresForComp = peerRatings[compId] || [];
            const peerAvg = peerScoresForComp.length > 0
                ? peerScoresForComp.reduce((a, b) => a + b, 0) / peerScoresForComp.length
                : null;

            // Get superior rating
            const superiorScore = superiorRatings[compId] || null;

            // Calculate weighted score (normalize if not all raters participated)
            let weightedSum = 0;
            let totalWeight = 0;

            if (selfScore) {
                weightedSum += selfScore * weights.self;
                totalWeight += weights.self;
            }
            if (peerAvg !== null) {
                weightedSum += peerAvg * weights.peer;
                totalWeight += weights.peer;
            }
            if (superiorScore) {
                weightedSum += superiorScore * weights.superior;
                totalWeight += weights.superior;
            }

            // Normalize to get actual weighted score
            const weightedScore = totalWeight > 0 ? weightedSum / totalWeight : selfScore;

            gaps.push({
                competencyId: compId,
                competencyName: competency.name,
                competencyType: competency.type,
                selfRating: selfScore,
                peerRating: peerAvg,
                superiorRating: superiorScore,
                weightedScore: weightedScore,
                requiredLevel: requiredLevel,
                gap: requiredLevel - weightedScore,
                hasPeerData: peerAvg !== null,
                hasSuperiorData: superiorScore !== null
            });
        });

        // Sort by gap (largest gaps first)
        gaps.sort((a, b) => b.gap - a.gap);

        // Calculate counts
        const meetsCount = gaps.filter(g => g.gap <= 0).length;
        const needsCount = gaps.filter(g => g.gap > 0).length;
        const avgWeightedScore = gaps.length > 0
            ? (gaps.reduce((sum, g) => sum + g.weightedScore, 0) / gaps.length).toFixed(2)
            : '-';

        document.getElementById('competenciesMetCount').textContent = meetsCount;
        document.getElementById('developmentNeedsCount').textContent = needsCount;

        // Determine assessment completion status
        const hasPeerData = gaps.some(g => g.hasPeerData);
        const hasSuperiorData = gaps.some(g => g.hasSuperiorData);

        const statusBadges = `
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="badge badge-success">Self Assessment ✓</span>
                ${hasPeerData ? '<span class="badge badge-success">Peer Assessment ✓</span>' : '<span class="badge badge-warning">Peer Pending</span>'}
                ${hasSuperiorData ? '<span class="badge badge-success">Superior Assessment ✓</span>' : '<span class="badge badge-warning">Superior Pending</span>'}
            </div>
        `;

        container.innerHTML = `
            ${statusBadges}
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Weighted Score Analysis</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="gapChart" height="250"></canvas>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Score Summary</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-3 gap-4 text-center mb-4">
                            <div class="p-3 bg-green-50 rounded-lg">
                                <p class="text-2xl font-bold text-green-600">${meetsCount}</p>
                                <p class="text-xs text-gray-500">Meets Required</p>
                            </div>
                            <div class="p-3 bg-red-50 rounded-lg">
                                <p class="text-2xl font-bold text-red-600">${needsCount}</p>
                                <p class="text-xs text-gray-500">Needs Development</p>
                            </div>
                            <div class="p-3 bg-blue-50 rounded-lg">
                                <p class="text-2xl font-bold text-blue-600">${avgWeightedScore}</p>
                                <p class="text-xs text-gray-500">Avg Weighted Score</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <p class="text-sm text-gray-500">Required Level: <strong>${position?.requiredLevelName || 'Level ' + requiredLevel}</strong></p>
                            <p class="text-xs text-gray-400 mt-2">Weights: Self 20% | Peer 30% | Superior 50%</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Detailed Gap Analysis</h3>
                </div>
                <div class="card-body overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Competency</th>
                                <th>Self (20%)</th>
                                <th>Peer (30%)</th>
                                <th>Superior (50%)</th>
                                <th>Weighted</th>
                                <th>Required</th>
                                <th>Gap</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${gaps.map(g => `
                                <tr>
                                    <td><strong>${g.competencyId}:</strong> ${g.competencyName}</td>
                                    <td class="text-center">${g.selfRating}</td>
                                    <td class="text-center">${g.peerRating !== null ? g.peerRating.toFixed(1) : '<span class="text-gray-400">-</span>'}</td>
                                    <td class="text-center">${g.superiorRating || '<span class="text-gray-400">-</span>'}</td>
                                    <td class="text-center font-semibold">${g.weightedScore.toFixed(2)}</td>
                                    <td class="text-center">${g.requiredLevel}</td>
                                    <td class="text-center ${g.gap > 0 ? 'text-red-600' : 'text-green-600'}">${g.gap > 0 ? '+' + g.gap.toFixed(2) : g.gap.toFixed(2)}</td>
                                    <td>
                                        ${g.gap <= 0
                ? '<span class="badge badge-success">Meets</span>'
                : '<span class="badge badge-danger">Gap</span>'
            }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Render enhanced chart with all three rating types
        renderEnhancedGapChart(gaps, requiredLevel);

    } catch (error) {
        console.error('Error loading gap analysis:', error);
        container.innerHTML = '<p class="text-red-600">Error loading gap analysis.</p>';
    }
}

/**
 * Render enhanced gap chart with self, peer, superior, and weighted scores
 */
function renderEnhancedGapChart(gaps, requiredLevel) {
    const ctx = document.getElementById('gapChart')?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if any
    if (window.gapChartInstance) {
        window.gapChartInstance.destroy();
    }

    window.gapChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: gaps.map(g => g.competencyId),
            datasets: [
                {
                    label: 'Self (20%)',
                    data: gaps.map(g => g.selfRating),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                },
                {
                    label: 'Peer Avg (30%)',
                    data: gaps.map(g => g.peerRating || 0),
                    backgroundColor: 'rgba(168, 85, 247, 0.6)',
                    borderColor: 'rgb(168, 85, 247)',
                    borderWidth: 1
                },
                {
                    label: 'Superior (50%)',
                    data: gaps.map(g => g.superiorRating || 0),
                    backgroundColor: 'rgba(34, 197, 94, 0.6)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1
                },
                {
                    label: 'Weighted Score',
                    data: gaps.map(g => g.weightedScore),
                    type: 'line',
                    borderColor: 'rgb(249, 115, 22)',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(249, 115, 22)'
                },
                {
                    label: 'Required Level',
                    data: gaps.map(() => requiredLevel),
                    type: 'line',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const levels = ['', 'Basic', 'Intermediate', 'Advanced', 'Superior'];
                            return levels[value] || value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            if (value === 0 && context.dataset.label.includes('Peer') && !gaps[context.dataIndex].hasPeerData) {
                                return `${context.dataset.label}: No data`;
                            }
                            if (value === 0 && context.dataset.label.includes('Superior') && !gaps[context.dataIndex].hasSuperiorData) {
                                return `${context.dataset.label}: No data`;
                            }
                            return `${context.dataset.label}: ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

function renderGapChart(gaps, requiredLevel) {
    const ctx = document.getElementById('gapChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: gaps.map(g => g.competencyId),
            datasets: [
                {
                    label: 'Self Rating',
                    data: gaps.map(g => g.selfRating),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                },
                {
                    label: 'Required Level',
                    data: gaps.map(() => requiredLevel),
                    type: 'line',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function downloadGapAnalysisPDF() {
    showToast('PDF generation coming soon!', 'info');
    // TODO: Implement PDF generation
}

// ============================================================================
// DEVELOPMENT PLAN
// ============================================================================
async function renderDevelopmentPlan() {
    const container = document.getElementById('developmentPlanContent');

    // Check if gap analysis is available
    if (!EmployeeState.currentAssessment?.selfAssessmentStatus ||
        EmployeeState.currentAssessment.selfAssessmentStatus !== 'completed') {
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <p class="empty-title">Complete Your Assessment First</p>
                        <p class="empty-description">Complete your gap analysis to identify development needs.</p>
                        <button class="btn btn-primary mt-4" onclick="showView('self-assessment')">Start Self Assessment</button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // Load existing development plan activities
    let activities = [];
    try {
        const plansSnapshot = await db.collection('development_plans')
            .where('userId', '==', EmployeeState.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        activities = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.log('No development plans found or error loading:', error);
    }

    // Render development plan interface
    container.innerHTML = `
        <div class="card mb-6">
            <div class="card-header">
                <h3 class="card-title">Individual Development Plan (IDP)</h3>
                <button class="btn btn-primary" onclick="showAddActivityModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Activity
                </button>
            </div>
            <div class="card-body">
                <p class="text-gray-600 mb-4">Create development activities to address your competency gaps.</p>
                
                <div id="activitiesList" class="space-y-4">
                    ${activities.length === 0
            ? '<p class="text-gray-500 text-center py-8">No development activities yet. Click "Add Activity" to create one.</p>'
            : activities.map(activity => renderActivityCard(activity)).join('')
        }
                </div>
            </div>
        </div>
    `;
}

/**
 * Render a single activity card
 */
function renderActivityCard(activity) {
    const competency = EmployeeState.competencies.find(c => c.id === activity.competencyId);
    const statusColors = {
        'planned': 'badge-info',
        'in_progress': 'badge-warning',
        'completed': 'badge-success',
        'cancelled': 'badge-danger'
    };

    return `
        <div class="border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="badge ${statusColors[activity.status] || 'badge-info'}">${activity.status?.replace('_', ' ') || 'Planned'}</span>
                    <h4 class="font-medium mt-1">${activity.title}</h4>
                </div>
                <span class="text-sm text-gray-500">${activity.activityType || 'Other'}</span>
            </div>
            <p class="text-sm text-gray-500 mb-2">
                Target: <strong>${competency?.name || activity.competencyId}</strong>
            </p>
            ${activity.description ? `<p class="text-sm text-gray-600 mb-2">${activity.description}</p>` : ''}
            ${activity.targetEndDate ? `<p class="text-xs text-gray-400">Due: ${formatDate(activity.targetEndDate?.toDate?.() || activity.targetEndDate)}</p>` : ''}
        </div>
    `;
}

/**
 * Show Add Activity Modal
 */
function showAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (!modal) return;

    // Reset form
    document.getElementById('addActivityForm').reset();

    // Populate competency dropdown with gap analysis results
    const select = document.getElementById('activityCompetencyId');
    select.innerHTML = '<option value="">Select competency to develop...</option>';

    EmployeeState.competencies.forEach(comp => {
        select.innerHTML += `<option value="${comp.id}">${comp.id}: ${comp.name}</option>`;
    });

    // Set default dates
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3);

    document.getElementById('activityStartDate').value = today.toISOString().split('T')[0];
    document.getElementById('activityEndDate').value = endDate.toISOString().split('T')[0];

    // Show modal
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('open'), 10);
}

/**
 * Close Add Activity Modal
 */
function closeAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

/**
 * Submit Development Activity
 */
async function submitDevelopmentActivity(event) {
    event.preventDefault();

    const competencyId = document.getElementById('activityCompetencyId').value;
    const title = document.getElementById('activityTitle').value.trim();
    const activityType = document.getElementById('activityType').value;
    const startDate = document.getElementById('activityStartDate').value;
    const endDate = document.getElementById('activityEndDate').value;
    const description = document.getElementById('activityDescription').value.trim();

    if (!competencyId || !title || !activityType) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    showLoading(true);

    try {
        const activityData = {
            userId: EmployeeState.user.uid,
            cycleId: EmployeeState.currentCycle?.id || 'manual',
            competencyId: competencyId,
            title: title,
            activityType: activityType,
            description: description || '',
            targetStartDate: startDate ? new Date(startDate) : null,
            targetEndDate: endDate ? new Date(endDate) : null,
            status: 'planned',
            progress: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('development_plans').add(activityData);

        showToast('Development activity added successfully!', 'success');

        // Close modal and refresh
        closeAddActivityModal();
        renderDevelopmentPlan();

    } catch (error) {
        console.error('Error adding development activity:', error);
        showToast('Error adding activity. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Export development plan functions
window.showAddActivityModal = showAddActivityModal;
window.closeAddActivityModal = closeAddActivityModal;
window.submitDevelopmentActivity = submitDevelopmentActivity;

// ============================================================================
// SUPERVISOR: SUBORDINATES
// ============================================================================

function renderSubordinates() {
    const container = document.getElementById('subordinatesContainer');

    if (EmployeeState.subordinates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <p class="empty-title">No Subordinates Found</p>
                <p class="empty-description">You don't have any direct reports assigned yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${EmployeeState.subordinates.map(sub => `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="user-avatar">${getInitials(sub.name)}</div>
                        <div>
                            <p class="font-medium">${sub.name}</p>
                            <p class="text-sm text-gray-500">${getPositionTitle(sub.positionId)}</p>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Assessment Status</span>
                        <span class="badge badge-warning">Pending</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render superior assessments for supervisors
 */
async function renderSuperiorAssessments() {
    const container = document.getElementById('superiorAssessmentsContainer');

    // Load subordinates with pending superior assessments
    if (EmployeeState.subordinates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </div>
                <p class="empty-title">No Subordinates Found</p>
                <p class="empty-description">You don't have any direct reports to assess.</p>
            </div>
        `;
        return;
    }

    // Get assessments for subordinates
    let pendingAssessments = [];
    try {
        for (const sub of EmployeeState.subordinates) {
            const assessmentSnapshot = await db.collection('assessments')
                .where('subjectUserId', '==', sub.id)
                .where('superiorAssessmentStatus', '!=', 'completed')
                .limit(1)
                .get();

            if (!assessmentSnapshot.empty) {
                const assessment = { id: assessmentSnapshot.docs[0].id, ...assessmentSnapshot.docs[0].data() };
                pendingAssessments.push({ subordinate: sub, assessment });
            } else {
                // Include subordinates with pending assessments or create placeholder
                pendingAssessments.push({ subordinate: sub, assessment: null });
            }
        }
    } catch (error) {
        console.log('Error loading subordinate assessments:', error);
    }

    if (pendingAssessments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p class="empty-title">All Assessments Completed</p>
                <p class="empty-description">You have completed all superior assessments for your subordinates.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-4">
            ${pendingAssessments.map(({ subordinate, assessment }) => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-4">
                        <div class="user-avatar">${getInitials(subordinate.name)}</div>
                        <div>
                            <p class="font-medium">${subordinate.name}</p>
                            <p class="text-sm text-gray-500">${getPositionTitle(subordinate.positionId)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        ${assessment?.selfAssessmentStatus === 'completed'
            ? `<span class="badge badge-success">Self Done</span>`
            : `<span class="badge badge-warning">Self Pending</span>`}
                        ${assessment?.superiorAssessmentStatus === 'completed'
            ? `<span class="badge badge-success">Rated</span>`
            : `<button class="btn btn-primary btn-sm" onclick="startSuperiorAssessment('${assessment?.id || ''}', '${subordinate.id}')">Rate Now</button>`
        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Start superior assessment for a subordinate
 */
async function startSuperiorAssessment(assessmentId, subordinateUserId) {
    // Store current assessment data
    window.currentSuperiorAssessment = { assessmentId, subordinateUserId };

    try {
        // Get subordinate info
        const subordinate = EmployeeState.subordinates.find(s => s.id === subordinateUserId);
        if (!subordinate) {
            showToast('Subordinate not found.', 'error');
            return;
        }

        // Get subordinate's position to determine competencies
        const position = EmployeeState.positions.find(p => p.id === subordinate.positionId);
        const competencyIds = position?.competencyIds || EmployeeState.competencies.map(c => c.id);

        // Filter competencies
        let positionCompetencies = EmployeeState.competencies.filter(c => competencyIds.includes(c.id));
        if (positionCompetencies.length === 0) {
            positionCompetencies = EmployeeState.competencies;
        }

        // Create modal dynamically if needed
        let modal = document.getElementById('superiorAssessmentModal');
        if (!modal) {
            // Create modal HTML
            const modalHtml = `
                <div class="modal-overlay hidden" id="superiorAssessmentModal">
                    <div class="modal-container" style="max-width: 700px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <span class="badge badge-info mr-2">Superior</span>
                                Rate Subordinate
                            </h3>
                            <button class="modal-close" onclick="closeSuperiorAssessmentModal()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form id="superiorAssessmentForm" onsubmit="submitSuperiorAssessment(event)">
                            <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                                <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p class="text-sm text-gray-500">Rating subordinate:</p>
                                    <p class="font-medium text-lg" id="superiorSubjectName">Loading...</p>
                                    <p class="text-sm text-gray-500" id="superiorSubjectPosition">Loading...</p>
                                </div>
                                <p class="text-sm text-gray-600 mb-4">
                                    Rate your subordinate's proficiency on each competency based on your observations.
                                </p>
                                <div id="superiorCompetencyRatings" class="space-y-4"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="closeSuperiorAssessmentModal()">Cancel</button>
                                <button type="submit" class="btn btn-primary">Submit Superior Rating</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            modal = document.getElementById('superiorAssessmentModal');
        }

        // Populate modal
        document.getElementById('superiorSubjectName').textContent = subordinate.name;
        document.getElementById('superiorSubjectPosition').textContent = getPositionTitle(subordinate.positionId);

        // Render competency ratings
        const container = document.getElementById('superiorCompetencyRatings');
        container.innerHTML = positionCompetencies.map(comp => `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="badge ${comp.type === 'Core' ? 'badge-warning' : comp.type === 'Leadership' ? 'badge-info' : 'badge-success'} text-xs">${comp.type}</span>
                        <h4 class="font-medium mt-1">${comp.id}: ${comp.name}</h4>
                    </div>
                </div>
                <p class="text-sm text-gray-500 mb-3">${comp.description}</p>
                <div class="grid grid-cols-4 gap-2">
                    ${[1, 2, 3, 4].map(level => `
                        <label class="cursor-pointer">
                            <input type="radio" name="superior-rating-${comp.id}" value="${level}" class="hidden peer" required>
                            <div class="p-2 text-center border rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors">
                                <p class="text-lg font-bold text-gray-700">${level}</p>
                                <p class="text-xs text-gray-500">${getLevelName(level)}</p>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Show modal
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('open'), 10);

    } catch (error) {
        console.error('Error opening superior assessment:', error);
        showToast('Error loading assessment. Please try again.', 'error');
    }
}

/**
 * Close superior assessment modal
 */
function closeSuperiorAssessmentModal() {
    const modal = document.getElementById('superiorAssessmentModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
    window.currentSuperiorAssessment = null;
}

/**
 * Submit superior assessment
 */
async function submitSuperiorAssessment(event) {
    event.preventDefault();

    if (!window.currentSuperiorAssessment) {
        showToast('No assessment in progress.', 'error');
        return;
    }

    const { assessmentId, subordinateUserId } = window.currentSuperiorAssessment;

    // Collect ratings
    const ratings = {};
    const form = event.target;
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        if (key.startsWith('superior-rating-')) {
            const competencyId = key.replace('superior-rating-', '');
            ratings[competencyId] = parseInt(value);
        }
    });

    if (Object.keys(ratings).length === 0) {
        showToast('Please rate at least one competency.', 'warning');
        return;
    }

    showLoading(true);

    try {
        // Create or update assessment
        const actualAssessmentId = assessmentId || `assessment-${subordinateUserId}-${EmployeeState.currentCycle?.id || 'manual'}`;

        await db.collection('assessments').doc(actualAssessmentId).set({
            superiorRatings: ratings,
            superiorAssessmentStatus: 'completed',
            superiorRaterId: EmployeeState.user.uid,
            superiorSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        showToast('Superior assessment submitted successfully!', 'success');

        // Close and refresh
        closeSuperiorAssessmentModal();
        renderSuperiorAssessments();
        loadDashboardData();

    } catch (error) {
        console.error('Error submitting superior assessment:', error);
        showToast('Error submitting assessment. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Export superior assessment functions
window.startSuperiorAssessment = startSuperiorAssessment;
window.closeSuperiorAssessmentModal = closeSuperiorAssessmentModal;
window.submitSuperiorAssessment = submitSuperiorAssessment;

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Get initials from a name
 */
function getInitials(name) {
    if (!name) return '--';
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format an ID string to readable title
 * e.g., "senior-analyst-crd" => "Senior Analyst CRD"
 */
function formatIdAsTitle(id) {
    if (!id) return '';
    return id.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ============================================================================
// PROFILE
// ============================================================================

async function updateProfile(event) {
    event.preventDefault();

    const name = document.getElementById('profileName').value.trim();

    if (!name) {
        showToast('Name is required.', 'error');
        return;
    }

    showLoading(true);

    try {
        await updateUserData(EmployeeState.user.uid, { name });
        EmployeeState.userData.name = name;
        updateUserUI();
        showToast('Profile updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getInitials(name) {
    if (!name) return '--';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function getPositionTitle(positionId) {
    const position = EmployeeState.positions.find(p => p.id === positionId);
    return position?.title || positionId || 'Unknown';
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="toast-close">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

async function handleLogout() {
    await logout();
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

window.showView = showView;
window.filterCompetencies = filterCompetencies;
window.onRatingChange = onRatingChange;
window.submitSelfAssessment = submitSelfAssessment;
window.startPeerAssessment = startPeerAssessment;
window.downloadGapAnalysisPDF = downloadGapAnalysisPDF;
window.showAddActivityModal = showAddActivityModal;
window.updateProfile = updateProfile;
window.handleLogout = handleLogout;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

console.log('👤 Employee Portal Controller loaded');
