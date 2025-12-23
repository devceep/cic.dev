/**
 * CIC Competency Framework System
 * HR Portal Controller
 * 
 * Handles all HR/Admin functionality including user management,
 * assessment cycle management, peer rater assignment, and reports.
 */

// ============================================================================
// HR APP STATE
// ============================================================================

const HRState = {
    user: null,
    userData: null,
    currentView: 'dashboard',
    competencies: [],
    positions: [],
    departments: [],
    users: [],
    assessmentCycles: [],
    currentCycle: null,
    assessments: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 HR Portal Initializing...');

    // Initialize auth
    initAuth();

    // Auth state observer callback
    window.onAuthStateChange = async (authState) => {
        if (authState.isLoading) return;

        if (!authState.isAuthenticated) {
            window.location.href = '/login.html';
            return;
        }

        // Check if user has HR/Admin access
        const role = authState.userData?.role;
        if (role !== 'hr' && role !== 'admin') {
            console.warn('⚠️ Non-HR user attempting to access HR Portal');
            window.location.href = '/employee/index.html';
            return;
        }

        HRState.user = authState.user;
        HRState.userData = authState.userData;

        try {
            await loadHRData();
            updateUserUI();
            loadDashboardData();
            console.log('✅ HR Portal initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing HR Portal:', error);
            showToast('Error loading data. Please refresh.', 'error');
        }
    };
});

/**
 * Load HR-specific data
 */
async function loadHRData() {
    try {
        // Load competencies (including Core, Leadership, and Functional)
        const competencies = await getAllCompetencies();
        HRState.competencies = competencies.length > 0 ? competencies : [
            ...(typeof CIC_CORE_COMPETENCIES !== 'undefined' ? CIC_CORE_COMPETENCIES : []),
            ...CSC_LEADERSHIP_COMPETENCIES,
            ...CIC_FUNCTIONAL_COMPETENCIES
        ];

        // Load positions
        const positions = await getAllPositions();
        HRState.positions = positions.length > 0 ? positions : CIC_POSITIONS;

        // Load departments
        const departments = await getAllDepartments();
        HRState.departments = departments.length > 0 ? departments : CIC_DEPARTMENTS;

        // Load all users
        await loadAllUsers();

        // Load assessment cycles
        await loadAssessmentCycles();

        // Load current cycle
        await loadCurrentCycle();

        // Load assessments for current cycle
        if (HRState.currentCycle) {
            await loadAssessments();
        }

        console.log('📚 HR data loaded');
    } catch (error) {
        console.error('Error loading HR data:', error);
    }
}

/**
 * Load all users from Firestore
 */
async function loadAllUsers() {
    try {
        const snapshot = await db.collection('users').get();
        HRState.users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.log('Error loading users:', error.message);
        HRState.users = [];
    }
}

/**
 * Load assessment cycles
 */
async function loadAssessmentCycles() {
    try {
        const snapshot = await db.collection('assessment_cycles')
            .orderBy('createdAt', 'desc')
            .get();

        HRState.assessmentCycles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.log('Error loading cycles:', error.message);
        HRState.assessmentCycles = [];
    }
}

/**
 * Load current active cycle
 */
async function loadCurrentCycle() {
    try {
        const snapshot = await db.collection('assessment_cycles')
            .where('status', '==', 'active')
            .limit(1)
            .get();

        if (!snapshot.empty) {
            HRState.currentCycle = {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            };
        }
    } catch (error) {
        console.log('No active cycle found');
    }
}

/**
 * Load assessments for current cycle
 */
async function loadAssessments() {
    if (!HRState.currentCycle) return;

    try {
        const snapshot = await db.collection('assessments')
            .where('cycleId', '==', HRState.currentCycle.id)
            .get();

        HRState.assessments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.log('Error loading assessments:', error.message);
    }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

function updateUserUI() {
    const userData = HRState.userData;
    if (!userData) return;

    // Header user info
    document.getElementById('userName').textContent = userData.name || 'HR User';
    document.getElementById('userPosition').textContent = 'HR Administrator';
    document.getElementById('userAvatar').textContent = getInitials(userData.name);
}

function loadDashboardData() {
    // Total users
    const totalEmployees = HRState.users.filter(u => u.role === 'employee' || !u.role).length;
    document.getElementById('totalEmployees').textContent = totalEmployees;

    // Active cycle
    if (HRState.currentCycle) {
        document.getElementById('activeCycleName').textContent = HRState.currentCycle.name;
        document.getElementById('activeCycleStatus').className = 'badge badge-success';
        document.getElementById('activeCycleStatus').textContent = 'Active';
    } else {
        document.getElementById('activeCycleName').textContent = 'No Active Cycle';
        document.getElementById('activeCycleStatus').className = 'badge badge-warning';
        document.getElementById('activeCycleStatus').textContent = 'None';
    }

    // Assessments
    const completedCount = HRState.assessments.filter(a => a.status === 'completed').length;
    const totalAssessments = HRState.assessments.length;
    document.getElementById('completedAssessments').textContent = completedCount;
    document.getElementById('pendingAssessments').textContent = totalAssessments - completedCount;

    // Departments
    document.getElementById('totalDepartments').textContent = HRState.departments.length;

    // Competencies
    document.getElementById('totalCompetencies').textContent = HRState.competencies.length;

    // Render charts
    renderDashboardCharts();
}

function renderDashboardCharts() {
    // Completion by department chart
    const deptCtx = document.getElementById('deptCompletionChart')?.getContext('2d');
    if (deptCtx) {
        const deptData = {};
        HRState.departments.forEach(dept => {
            deptData[dept.name] = { total: 0, completed: 0 };
        });

        HRState.assessments.forEach(a => {
            const user = HRState.users.find(u => u.id === a.subjectUserId);
            if (user) {
                const pos = HRState.positions.find(p => p.id === user.positionId);
                if (pos && deptData[pos.department]) {
                    deptData[pos.department].total++;
                    if (a.status === 'completed') {
                        deptData[pos.department].completed++;
                    }
                }
            }
        });

        const labels = Object.keys(deptData).slice(0, 6);
        const completed = labels.map(l => deptData[l].completed);
        const pending = labels.map(l => deptData[l].total - deptData[l].completed);

        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: labels.map(l => l.length > 20 ? l.substring(0, 20) + '...' : l),
                datasets: [
                    {
                        label: 'Completed',
                        data: completed,
                        backgroundColor: 'rgba(5, 150, 105, 0.8)'
                    },
                    {
                        label: 'Pending',
                        data: pending,
                        backgroundColor: 'rgba(217, 119, 6, 0.8)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Assessment type completion
    const typeCtx = document.getElementById('assessmentTypeChart')?.getContext('2d');
    if (typeCtx) {
        const selfCompleted = HRState.assessments.filter(a => a.selfAssessmentStatus === 'completed').length;
        const peerCompleted = HRState.assessments.filter(a => a.peerAssessmentStatus === 'completed').length;
        const superiorCompleted = HRState.assessments.filter(a => a.superiorAssessmentStatus === 'completed').length;
        const total = HRState.assessments.length || 1;

        new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Self', 'Peer', 'Superior'],
                datasets: [{
                    data: [selfCompleted, peerCompleted, superiorCompleted],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(5, 150, 105, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// ============================================================================
// VIEW NAVIGATION
// ============================================================================

function showView(viewName) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    const pageTitles = {
        'dashboard': 'Dashboard',
        'competency-library': 'Competency Library',
        'position-profiles': 'Position Profiles',
        'admin-departments': 'Department Management',
        'admin-users': 'User Management',
        'admin-cycles': 'Assessment Cycles',
        'peer-assignment': 'Peer Rater Assignment',
        'assessment-results': 'Assessment Results',
        'reports': 'Reports'
    };
    document.getElementById('pageTitle').textContent = pageTitles[viewName] || 'Dashboard';

    closeSidebar();
    HRState.currentView = viewName;
    onViewChange(viewName);
}

async function onViewChange(viewName) {
    switch (viewName) {
        case 'dashboard':
            await loadHRData();
            loadDashboardData();
            break;
        case 'competency-library':
            renderCompetencyLibrary();
            break;
        case 'position-profiles':
            renderPositionProfiles();
            break;
        case 'admin-departments':
            renderDepartmentsTable();
            break;
        case 'admin-users':
            await loadAllUsers();
            renderUsersTable();
            break;
        case 'admin-cycles':
            renderCyclesTable();
            break;
        case 'peer-assignment':
            renderPeerAssignment();
            break;
        case 'assessment-results':
            renderAssessmentResults();
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
// COMPETENCY LIBRARY
// ============================================================================

function renderCompetencyLibrary(filterType = 'all') {
    const container = document.getElementById('competencyLibraryContainer');
    if (!container) return;

    container.innerHTML = '';

    // Fallback to window variables if HRState is empty
    let competencies = HRState.competencies;
    if (!competencies || competencies.length === 0) {
        competencies = [
            ...(window.CIC_CORE_COMPETENCIES || []),
            ...(window.CSC_LEADERSHIP_COMPETENCIES || []),
            ...(window.CIC_FUNCTIONAL_COMPETENCIES || [])
        ];
        HRState.competencies = competencies;
    }

    // Apply filter
    let filteredCompetencies = competencies;
    if (filterType !== 'all') {
        filteredCompetencies = competencies.filter(c => c.type === filterType);
    }

    if (filteredCompetencies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Competencies Found</p>
                <p class="empty-description">Click "Seed Data" to populate competencies from CSC guidelines.</p>
            </div>
        `;
        return;
    }

    filteredCompetencies.forEach(comp => {
        const levels = comp.proficiencyLevels || comp.levels || [];
        const card = document.createElement('div');
        card.className = 'card competency-card mb-4';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="badge ${comp.type === 'Core' ? 'badge-warning' : comp.type === 'Leadership' ? 'badge-info' : 'badge-success'}">${comp.type}</span>
                    <h3 class="card-title mt-2">${comp.id}: ${comp.name}</h3>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="editCompetency('${comp.id}')">Edit</button>
            </div>
            <div class="card-body">
                <p class="text-gray-600 mb-4">${comp.description}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${levels.map(level => `
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <p class="font-medium text-sm">Level ${level.level}: ${level.name}</p>
                            <p class="text-gray-500 text-xs mt-1">${level.indicators?.length || 0} indicators</p>
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

/**
 * Filter competencies by type
 */
function filterCompetencies(type) {
    renderCompetencyLibrary(type);
}

function editCompetency(compId) {
    showToast('Competency editing modal coming soon!', 'info');
}

// ============================================================================
// POSITION PROFILES
// ============================================================================

function renderPositionProfiles() {
    const container = document.getElementById('positionProfilesContainer');
    if (!container) return;

    // Fallback to window variables if HRState is empty
    let positions = HRState.positions;
    if (!positions || positions.length === 0) {
        positions = window.CIC_POSITIONS || [];
        HRState.positions = positions;
    }

    if (positions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Positions Found</p>
                <p class="empty-description">Click "Seed Data" to populate positions.</p>
            </div>
        `;
        return;
    }

    // Group by department
    const grouped = {};
    positions.forEach(pos => {
        const dept = pos.department || 'Other';
        if (!grouped[dept]) grouped[dept] = [];
        grouped[dept].push(pos);
    });

    container.innerHTML = Object.entries(grouped).map(([dept, deptPositions]) => `
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="card-title">${dept}</h3>
                <span class="badge badge-neutral">${deptPositions.length} positions</span>
            </div>
            <div class="card-body p-0">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Required Level</th>
                                <th>Competencies</th>
                                <th>Supervisor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${deptPositions.map(pos => `
                                <tr>
                                    <td><strong>${pos.title}</strong></td>
                                    <td><span class="badge badge-info">${pos.requiredLevelName || 'N/A'}</span></td>
                                    <td>${pos.competencyIds?.length || 0} mapped</td>
                                    <td>${isSupervisorPosition(pos) ? '<span class="badge badge-warning">Yes</span>' : 'No'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary" onclick="editPosition('${pos.id}')">Edit</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Check if a position is a supervisor/manager role
 */
function isSupervisorPosition(position) {
    const supervisorKeywords = ['president', 'vice president', 'director', 'manager', 'supervisor', 'head', 'chief', 'lead'];
    const title = (position.title || '').toLowerCase();
    return supervisorKeywords.some(keyword => title.includes(keyword));
}

function editPosition(posId) {
    showToast('Position editing modal coming soon!', 'info');
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

function renderUsersTable() {
    const container = document.getElementById('usersTableContainer');
    if (!container) return;

    if (HRState.users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Users Registered</p>
                <p class="empty-description">Add users to the system to enable competency assessments.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${HRState.users.map(user => {
        const pos = HRState.positions.find(p => p.id === user.positionId);
        return `
                        <tr>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="user-avatar">${getInitials(user.name)}</div>
                                    <div>
                                        <p class="font-medium">${user.name || 'Unknown'}</p>
                                        ${user.isSupervisor ? '<span class="badge badge-warning" style="font-size:0.65rem">Supervisor</span>' : ''}
                                    </div>
                                </div>
                            </td>
                            <td>${user.email}</td>
                            <td>${pos?.title || (user.positionId ? formatIdAsTitle(user.positionId) : 'N/A')}</td>
                            <td><span class="badge badge-${user.role === 'admin' ? 'danger' : user.role === 'hr' ? 'info' : 'neutral'}">${capitalizeFirst(user.role || 'employee')}</span></td>
                            <td><span class="badge badge-${user.status === 'active' ? 'success' : 'danger'}">${capitalizeFirst(user.status || 'active')}</span></td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="editUser('${user.id}')">Edit</button>
                                <button class="btn btn-sm btn-outline" onclick="promoteToHR('${user.id}')">Make HR</button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

function editUser(userId) {
    console.log('✏️ Edit user clicked for ID:', userId);
    const user = HRState.users.find(u => u.id === userId);
    if (!user) {
        showToast('User not found', 'error');
        return;
    }

    // Populate modal
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name || '';
    document.getElementById('editUserRole').value = user.role || 'employee';
    document.getElementById('editUserIsActive').checked = (user.status !== 'inactive');
    document.getElementById('editUserIsSupervisor').checked = !!user.isSupervisor;

    // Populate positions
    const posSelect = document.getElementById('editUserPosition');
    posSelect.innerHTML = '<option value="">Select Position</option>';
    HRState.positions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.id;
        option.textContent = pos.title;
        if (pos.id === user.positionId) option.selected = true;
        posSelect.appendChild(option);
    });

    // Populate departments
    const deptSelect = document.getElementById('editUserDepartment');
    deptSelect.innerHTML = '<option value="">Select Department</option>';
    HRState.departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        if (dept.name === user.department) option.selected = true;
        deptSelect.appendChild(option);
    });

    // Show modal
    const modal = document.getElementById('editUserModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('open'), 10);
}

function closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    modal.classList.remove('open');
    setTimeout(() => modal.classList.add('hidden'), 300);
    document.getElementById('editUserForm').reset();
}

async function submitEditUser(event) {
    event.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value;
    const positionId = document.getElementById('editUserPosition').value;
    const departmentId = document.getElementById('editUserDepartment').value;
    const role = document.getElementById('editUserRole').value;
    const isActive = document.getElementById('editUserIsActive').checked;
    const isSupervisor = document.getElementById('editUserIsSupervisor').checked;

    // Find department name for the user object
    const dept = HRState.departments.find(d => d.id === departmentId);

    showLoading(true);
    try {
        const updateData = {
            name,
            positionId,
            department: dept ? dept.name : '',
            role,
            status: isActive ? 'active' : 'inactive',
            isSupervisor,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(userId).update(updateData);

        showToast('User profile updated successfully', 'success');
        closeEditUserModal();

        // Refresh data
        await loadAllUsers();
        renderUsersTable();
    } catch (error) {
        console.error('Error updating user:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function promoteToHR(userId) {
    if (!confirm('Are you sure you want to give this user HR access?')) return;

    try {
        await db.collection('users').doc(userId).update({
            role: 'hr',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('User promoted to HR successfully!', 'success');
        await loadAllUsers();
        renderUsersTable();
    } catch (error) {
        console.error('Error promoting user:', error);
        showToast('Error promoting user.', 'error');
    }
}

// ============================================================================
// DEPARTMENT MANAGEMENT
// ============================================================================

function renderDepartmentsTable() {
    const tbody = document.getElementById('departmentsTableBody');
    if (!tbody) return;

    // Fallback to window variables if HRState is empty
    let departments = HRState.departments;
    if (!departments || departments.length === 0) {
        departments = window.CIC_DEPARTMENTS || [];
        HRState.departments = departments;
    }

    let positions = HRState.positions;
    if (!positions || positions.length === 0) {
        positions = window.CIC_POSITIONS || [];
        HRState.positions = positions;
    }

    if (departments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-8 text-gray-500">
                    No departments found. Click "Seed Data" to populate.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = departments.map(dept => {
        const employeeCount = HRState.users.filter(u => {
            const pos = positions.find(p => p.id === u.positionId);
            return pos?.department === dept.name;
        }).length;
        return `
            <tr>
                <td><strong>${dept.name}</strong></td>
                <td>${dept.minPeerRaters}</td>
                <td>${dept.maxPeerRaters}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editDepartment('${dept.id}')">Edit</button>
                </td>
            </tr>
        `;
    }).join('');
}

function editDepartment(deptId) {
    showToast('Department editing modal coming soon!', 'info');
}

// ============================================================================
// ASSESSMENT CYCLES
// ============================================================================

function renderCyclesTable() {
    const container = document.getElementById('cyclesTableContainer');
    if (!container) return;

    if (HRState.assessmentCycles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Assessment Cycles</p>
                <p class="empty-description">Create an assessment cycle to begin collecting competency assessments.</p>
                <button class="btn btn-primary mt-4" onclick="openCreateCycleModal()">Create Cycle</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Cycle Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Assessments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${HRState.assessmentCycles.map(cycle => {
        const startDate = cycle.startDate?.toDate?.() || new Date(cycle.startDate);
        const endDate = cycle.endDate?.toDate?.() || new Date(cycle.endDate);
        const assessmentCount = HRState.assessments.filter(a => a.cycleId === cycle.id).length;
        return `
                        <tr>
                            <td><strong>${cycle.name}</strong></td>
                            <td>${formatDate(startDate)}</td>
                            <td>${formatDate(endDate)}</td>
                            <td><span class="badge badge-${cycle.status === 'active' ? 'success' : cycle.status === 'completed' ? 'neutral' : 'warning'}">${capitalizeFirst(cycle.status)}</span></td>
                            <td>${assessmentCount}</td>
                            <td>
                                ${cycle.status === 'active'
                ? '<button class="btn btn-sm btn-danger" onclick="closeCycle(\'' + cycle.id + '\')">Close</button>'
                : cycle.status === 'upcoming'
                    ? '<button class="btn btn-sm btn-success" onclick="activateCycle(\'' + cycle.id + '\')">Activate</button>'
                    : '<span class="text-gray-400">Closed</span>'
            }
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

// ============================================================================
// ASSESSMENT CYCLE MODAL FUNCTIONS
// ============================================================================

/**
 * Open the create assessment cycle modal
 */
function openCreateCycleModal() {
    const modal = document.getElementById('createCycleModal');
    if (modal) {
        // Reset form
        document.getElementById('createCycleForm').reset();

        // Set default dates (start: today, end: 30 days from now)
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 30);

        document.getElementById('cycleStartDate').value = today.toISOString().split('T')[0];
        document.getElementById('cycleEndDate').value = endDate.toISOString().split('T')[0];

        // Show modal
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('open'), 10);
    }
}

/**
 * Close the create assessment cycle modal
 */
function closeCreateCycleModal() {
    const modal = document.getElementById('createCycleModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

/**
 * Submit the create cycle form
 */
async function submitCreateCycle(event) {
    event.preventDefault();

    const name = document.getElementById('cycleName').value.trim();
    const startDate = document.getElementById('cycleStartDate').value;
    const endDate = document.getElementById('cycleEndDate').value;
    const description = document.getElementById('cycleDescription').value.trim();

    // Get selected competency types
    const competencyTypes = Array.from(
        document.querySelectorAll('input[name="cycleCompetencyTypes"]:checked')
    ).map(cb => cb.value);

    // Validation
    if (!name) {
        showToast('Please enter a cycle name.', 'warning');
        return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        showToast('End date must be after start date.', 'warning');
        return;
    }

    if (competencyTypes.length === 0) {
        showToast('Please select at least one competency type.', 'warning');
        return;
    }

    showLoading(true);

    try {
        // Create the assessment cycle in Firestore
        const cycleData = {
            name: name,
            description: description || '',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'upcoming',
            competencyTypes: competencyTypes,
            weights: {
                self: 0.20,
                peer: 0.30,
                superior: 0.50
            },
            createdBy: HRState.user?.uid || 'admin',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('assessment_cycles').add(cycleData);

        showToast(`Assessment cycle "${name}" created successfully!`, 'success');

        // Close modal and refresh data
        closeCreateCycleModal();
        await loadAssessmentCycles();
        renderCyclesTable();
        loadDashboardData();

    } catch (error) {
        console.error('Error creating assessment cycle:', error);
        showToast('Error creating assessment cycle. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Export modal functions
window.openCreateCycleModal = openCreateCycleModal;
window.closeCreateCycleModal = closeCreateCycleModal;
window.submitCreateCycle = submitCreateCycle;


async function activateCycle(cycleId) {
    if (!confirm('Activate this assessment cycle?')) return;

    try {
        // Deactivate any current active cycle
        if (HRState.currentCycle) {
            await db.collection('assessment_cycles').doc(HRState.currentCycle.id).update({
                status: 'completed'
            });
        }

        // Activate selected cycle
        await db.collection('assessment_cycles').doc(cycleId).update({
            status: 'active'
        });

        showToast('Cycle activated successfully!', 'success');
        await loadAssessmentCycles();
        await loadCurrentCycle();
        renderCyclesTable();
    } catch (error) {
        console.error('Error activating cycle:', error);
        showToast('Error activating cycle.', 'error');
    }
}

async function closeCycle(cycleId) {
    if (!confirm('Close this assessment cycle? This will end all assessments.')) return;

    try {
        await db.collection('assessment_cycles').doc(cycleId).update({
            status: 'completed'
        });

        showToast('Cycle closed successfully!', 'success');
        await loadAssessmentCycles();
        await loadCurrentCycle();
        loadDashboardData();
        renderCyclesTable();
    } catch (error) {
        console.error('Error closing cycle:', error);
        showToast('Error closing cycle.', 'error');
    }
}

// ============================================================================
// PEER RATER ASSIGNMENT
// ============================================================================

function renderPeerAssignment() {
    const container = document.getElementById('peerAssignmentContainer');
    if (!container) return;

    if (!HRState.currentCycle) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Active Cycle</p>
                <p class="empty-description">Create and activate an assessment cycle first.</p>
            </div>
        `;
        return;
    }

    const employees = HRState.users.filter(u => u.role !== 'admin');

    container.innerHTML = `
        <div class="mb-4 p-4 bg-blue-50 rounded-lg">
            <p class="font-medium text-blue-800">Current Cycle: ${HRState.currentCycle.name}</p>
            <p class="text-sm text-blue-600">Assign peer raters for each employee below.</p>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Assigned Peers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${employees.map(emp => {
        const pos = HRState.positions.find(p => p.id === emp.positionId);
        const assessment = HRState.assessments.find(a => a.subjectUserId === emp.id);
        const assignedCount = assessment?.assignedPeerRaterIds?.length || 0;
        return `
                        <tr>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="user-avatar">${getInitials(emp.name)}</div>
                                    <span>${emp.name}</span>
                                </div>
                            </td>
                            <td>${pos?.department || 'N/A'}</td>
                            <td>
                                <span class="badge ${assignedCount > 0 ? 'badge-success' : 'badge-warning'}">${assignedCount} assigned</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="showAssignPeersModal('${emp.id}')">Assign Peers</button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

function showAssignPeersModal(employeeId) {
    showToast('Peer assignment modal coming soon!', 'info');
}

// ============================================================================
// ASSESSMENT RESULTS
// ============================================================================

function renderAssessmentResults() {
    const container = document.getElementById('assessmentResultsContainer');
    if (!container) return;

    if (HRState.assessments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">No Assessments Found</p>
                <p class="empty-description">Assessments will appear here once employees begin their evaluations.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Self</th>
                    <th>Peer</th>
                    <th>Superior</th>
                    <th>Overall Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${HRState.assessments.map(assessment => {
        const user = HRState.users.find(u => u.id === assessment.subjectUserId);
        return `
                        <tr>
                            <td>${user?.name || 'Unknown'}</td>
                            <td><span class="badge badge-${assessment.selfAssessmentStatus === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(assessment.selfAssessmentStatus || 'pending')}</span></td>
                            <td><span class="badge badge-${assessment.peerAssessmentStatus === 'completed' ? 'success' : assessment.peerAssessmentStatus === 'partial' ? 'warning' : 'danger'}">${capitalizeFirst(assessment.peerAssessmentStatus || 'pending')}</span></td>
                            <td><span class="badge badge-${assessment.superiorAssessmentStatus === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(assessment.superiorAssessmentStatus || 'pending')}</span></td>
                            <td><span class="badge badge-${assessment.status === 'completed' ? 'success' : 'info'}">${capitalizeFirst(assessment.status || 'pending')}</span></td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="viewAssessmentDetails('${assessment.id}')">View</button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

function viewAssessmentDetails(assessmentId) {
    showToast('Assessment details view coming soon!', 'info');
}

// ============================================================================
// REPORTS
// ============================================================================

async function generateDepartmentReport() {
    showToast('Generating departmental report...', 'info');
    // TODO: Implement PDF generation
}

async function generateIndividualReport(userId) {
    showToast('Generating individual report...', 'info');
    // TODO: Implement PDF generation
}

async function generateCompletionReport() {
    showToast('Generating completion report...', 'info');
    // TODO: Implement PDF generation
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

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay?.classList.remove('hidden');
    } else {
        overlay?.classList.add('hidden');
    }
}

function getPositionTitle(positionId) {
    const position = HRState.positions.find(p => p.id === positionId);
    return position?.title || (positionId ? formatIdAsTitle(positionId) : 'Unknown');
}

function formatIdAsTitle(id) {
    if (!id) return '';
    if (id === 'placeholder') return 'Not Assigned';
    return id.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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

    setTimeout(() => toast.remove(), 5000);
}

// ============================================================================
// DATABASE SEEDING (UI WRAPPERS)
// ============================================================================

const originalSeedDatabase = window.seedDatabase;
const originalForceSeedDatabase = window.forceSeedDatabase;

async function seedDatabase() {
    showLoading(true);
    try {
        const result = await originalSeedDatabase();
        if (result && result.success) {
            showToast(result.message || 'Database updated successfully', 'success');
            // Reload HR data to reflect changes
            await loadHRData();
            // Refresh current view
            onViewChange(HRState.currentView);
        } else {
            showToast(result ? result.message : 'Unknown error seeding database', 'error');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function forceSeedDatabase() {
    if (!confirm('WARNING: This will clear all existing competency and mapping data. Are you sure?')) {
        return;
    }

    showLoading(true);
    try {
        const result = await originalForceSeedDatabase();
        if (result && result.success) {
            showToast('Database force re-seeded successfully', 'success');
            // Reload HR data
            await loadHRData();
            // Refresh current view
            onViewChange(HRState.currentView);
        } else {
            showToast(result ? result.message : 'Error force re-seeding database', 'error');
        }
    } catch (error) {
        console.error('Error force seeding database:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleLogout() {
    await logout();
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

window.showView = showView;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.filterCompetencies = filterCompetencies;
window.editCompetency = editCompetency;
window.editPosition = editPosition;
window.showAddPositionModal = showAddPositionModal;
window.editUser = editUser;
window.promoteToHR = promoteToHR;
window.editDepartment = editDepartment;
window.openCreateCycleModal = openCreateCycleModal;
window.activateCycle = activateCycle;
window.closeCycle = closeCycle;
window.showAssignPeersModal = showAssignPeersModal;
window.viewAssessmentDetails = viewAssessmentDetails;
window.generateDepartmentReport = generateDepartmentReport;
window.generateIndividualReport = generateIndividualReport;
window.generateCompletionReport = generateCompletionReport;
window.seedDatabase = seedDatabase;
window.forceSeedDatabase = forceSeedDatabase;
window.handleLogout = handleLogout;
window.closeEditUserModal = closeEditUserModal;
window.submitEditUser = submitEditUser;

/**
 * Show add position modal
 */
function showAddPositionModal() {
    showToast('Position creation modal coming soon!', 'info');
}

console.log('🏢 HR Portal Controller loaded');
