// ============================================================================
// CIC Competency Framework System - Main Application Controller
// ============================================================================

// ============================================================================
// APPLICATION STATE
// ============================================================================
const AppState = {
    currentView: 'dashboard',
    currentUser: {
        id: 'demo-user',
        name: 'John Doe',
        email: 'john.doe@cic.gov.ph',
        positionId: 'division-chief',
        departmentId: 'crd',
        role: 'employee'
    },
    selectedPosition: null,
    competencies: [],
    positions: [],
    departments: [],
    currentAssessment: null,
    selfRatings: {},
    gapAnalysisData: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 CIC Competency Framework System Initializing...');

    try {
        // Load initial data
        await loadInitialData();

        // Populate position dropdowns
        populatePositionDropdown();

        // Populate profile page dropdowns
        populateProfileDropdowns();

        // Initialize dashboard charts
        initializeDashboard();

        // Load departments for admin view
        loadDepartmentsTable();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showToast('Error loading application data. Please refresh the page.', 'error');
    }
});

/**
 * Load initial data from Firestore or use static data
 */
async function loadInitialData() {
    try {
        // Try to load from Firestore first
        const competencies = await getAllCompetencies();

        if (competencies.length > 0) {
            AppState.competencies = competencies;
            console.log(`📚 Loaded ${competencies.length} competencies from Firestore`);
        } else {
            // Use static data if Firestore is empty (includes Core, Leadership, and Functional)
            AppState.competencies = [
                ...(typeof CIC_CORE_COMPETENCIES !== 'undefined' ? CIC_CORE_COMPETENCIES : []),
                ...CSC_LEADERSHIP_COMPETENCIES,
                ...CIC_FUNCTIONAL_COMPETENCIES
            ];
            console.log('📚 Using static competency data (13 total)');
        }

        // Load positions
        const positions = await getAllPositions();
        if (positions.length > 0) {
            AppState.positions = positions;
        } else {
            AppState.positions = CIC_POSITIONS;
        }

        // Load departments
        const departments = await getAllDepartments();
        if (departments.length > 0) {
            AppState.departments = departments;
        } else {
            AppState.departments = CIC_DEPARTMENTS;
        }

    } catch (error) {
        console.warn('⚠️ Could not load from Firestore, using static data:', error.message);
        // Include Core Competencies in fallback
        AppState.competencies = [
            ...(typeof CIC_CORE_COMPETENCIES !== 'undefined' ? CIC_CORE_COMPETENCIES : []),
            ...CSC_LEADERSHIP_COMPETENCIES,
            ...CIC_FUNCTIONAL_COMPETENCIES
        ];
        AppState.positions = CIC_POSITIONS;
        AppState.departments = CIC_DEPARTMENTS;
    }
}

/**
 * Populate the position dropdown with grouped options by department
 */
function populatePositionDropdown() {
    const select = document.getElementById('positionSelect');
    if (!select) return;

    // Clear existing options except the default
    select.innerHTML = '<option value="">-- Select your position --</option>';

    // Group positions by department
    const grouped = {};
    AppState.positions.forEach(pos => {
        const dept = pos.department || 'Other';
        if (!grouped[dept]) {
            grouped[dept] = [];
        }
        grouped[dept].push(pos);
    });

    // Create optgroups for each department
    Object.keys(grouped).forEach(deptName => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = deptName;

        grouped[deptName].forEach(pos => {
            const option = document.createElement('option');
            option.value = pos.id;
            option.textContent = `${pos.title} (${pos.requiredLevelName})`;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });

    console.log(`📋 Loaded ${AppState.positions.length} positions into dropdown`);
}

/**
 * Populate the profile page dropdowns (department and position)
 */
function populateProfileDropdowns() {
    // Populate department dropdown
    const deptSelect = document.getElementById('profileDepartment');
    if (deptSelect) {
        deptSelect.innerHTML = '';

        // Get unique departments from positions
        const departments = [...new Set(AppState.positions.map(p => p.department))].filter(Boolean);

        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.toLowerCase().replace(/\s+/g, '-');
            option.textContent = dept;
            deptSelect.appendChild(option);
        });
    }

    // Populate position dropdown (same as assessment dropdown)
    const posSelect = document.getElementById('profilePosition');
    if (posSelect) {
        posSelect.innerHTML = '';

        // Group positions by department
        const grouped = {};
        AppState.positions.forEach(pos => {
            const dept = pos.department || 'Other';
            if (!grouped[dept]) {
                grouped[dept] = [];
            }
            grouped[dept].push(pos);
        });

        // Create optgroups for each department
        Object.keys(grouped).forEach(deptName => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = deptName;

            grouped[deptName].forEach(pos => {
                const option = document.createElement('option');
                option.value = pos.id;
                option.textContent = pos.title;
                optgroup.appendChild(option);
            });

            posSelect.appendChild(optgroup);
        });
    }
}

/**
 * Show a specific view and hide others
 */
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show the selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update navigation active state
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
        'peer-requests': 'Peer Assessment Requests',
        'gap-analysis': 'Gap Analysis',
        'admin-departments': 'Department Management',
        'admin-users': 'User Management',
        'admin-cycles': 'Assessment Cycles',
        'profile': 'My Profile'
    };
    document.getElementById('pageTitle').textContent = pageTitles[viewName] || 'Dashboard';

    // Close mobile sidebar
    closeSidebar();

    // Load view-specific data
    AppState.currentView = viewName;
    onViewChange(viewName);
}

/**
 * Handle view-specific initialization
 */
function onViewChange(viewName) {
    switch (viewName) {
        case 'competency-library':
            renderCompetencyLibrary();
            break;
        case 'gap-analysis':
            renderGapAnalysis();
            break;
        case 'admin-departments':
            loadDepartmentsTable();
            break;
    }
}

// ============================================================================
// SIDEBAR CONTROLS
// ============================================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

// ============================================================================
// DASHBOARD
// ============================================================================

function initializeDashboard() {
    // Update stats
    document.getElementById('statTotalCompetencies').textContent = AppState.competencies.length;

    // Create sample radar chart with placeholder data
    const sampleGapData = AppState.competencies.map(comp => ({
        competencyId: comp.id,
        competencyName: comp.name,
        competencyType: comp.type,
        requiredLevel: 2,
        actualScore: 0,
        selfScore: 0,
        peerScore: 0,
        superiorScore: 0,
        status: 'pending'
    }));

    // Only create chart if we have data
    if (sampleGapData.length > 0) {
        createCompetencyRadarChart('dashboardRadarChart', sampleGapData, 'Competency Profile Overview');
    }
}

// ============================================================================
// COMPETENCY LIBRARY
// ============================================================================

/**
 * Render the competency library cards
 */
function renderCompetencyLibrary(filter = 'all') {
    const container = document.getElementById('competencyLibraryContainer');
    let competencies = AppState.competencies;

    if (filter !== 'all') {
        competencies = competencies.filter(c => c.type === filter);
    }

    if (competencies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <p class="empty-title">No Competencies Found</p>
                <p class="empty-description">Click "Seed Data" button in the header to populate the competency library.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = competencies.map(comp => `
        <div class="competency-card">
            <div class="competency-header">
                <h4 class="competency-name">${comp.name}</h4>
                <span class="competency-type ${comp.type.toLowerCase()}">${comp.type}</span>
            </div>
            <p class="competency-description">${comp.description}</p>
            
            <div class="mt-4">
                <h5 class="text-sm font-semibold text-gray-700 mb-3">Proficiency Levels:</h5>
                <div class="space-y-3">
                    ${comp.proficiencyLevels.map(level => `
                        <div class="bg-gray-50 rounded-lg p-3">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                    ${level.level}
                                </span>
                                <span class="font-medium text-gray-900">${level.name}</span>
                            </div>
                            <ul class="text-sm text-gray-600 space-y-1 ml-8">
                                ${level.indicators.map(ind => `
                                    <li class="flex items-start gap-2">
                                        <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>${ind}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Filter competencies by type
 */
function filterCompetencies(type) {
    // Update button states
    document.querySelectorAll('[id^="filter"]').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });

    const activeBtn = document.getElementById(`filter${type === 'all' ? 'All' : type}`);
    if (activeBtn) {
        activeBtn.classList.remove('btn-secondary');
        activeBtn.classList.add('btn-primary');
    }

    renderCompetencyLibrary(type);
}

// ============================================================================
// SELF ASSESSMENT
// ============================================================================

/**
 * Handle position selection change
 */
function onPositionChange() {
    const positionSelect = document.getElementById('positionSelect');
    const positionId = positionSelect.value;

    if (!positionId) {
        document.getElementById('requiredLevelBadge').textContent = 'Select a position';
        document.getElementById('assessmentSubmitSection').classList.add('hidden');
        document.getElementById('assessmentFormContainer').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p class="empty-title">Select Your Position</p>
                <p class="empty-description">Choose your position above to load the competency assessment form.</p>
            </div>
        `;
        return;
    }

    // Find the position
    const position = AppState.positions.find(p => p.id === positionId);
    if (!position) return;

    AppState.selectedPosition = position;

    // Update required level badge
    document.getElementById('requiredLevelBadge').textContent = `${position.requiredLevelName} (Level ${position.requiredLevel})`;

    // Render assessment form
    renderAssessmentForm(position);

    // Show submit section
    document.getElementById('assessmentSubmitSection').classList.remove('hidden');
}

/**
 * Render the assessment form for the selected position
 */
function renderAssessmentForm(position) {
    const container = document.getElementById('assessmentFormContainer');

    // Get competencies for this position
    const competencies = AppState.competencies.filter(c =>
        position.competencyIds.includes(c.id)
    );

    container.innerHTML = `
        <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h4 class="font-semibold text-blue-900">Assessment Instructions</h4>
                    <p class="text-sm text-blue-700 mt-1">
                        Rate your actual proficiency level for each competency. Your position as <strong>${position.title}</strong> 
                        requires <strong>${position.requiredLevelName}</strong> level proficiency. Be honest in your self-assessment 
                        as this will be compared with peer and superior ratings.
                    </p>
                </div>
            </div>
        </div>
        
        <div class="space-y-6">
            ${competencies.map((comp, index) => `
                <div class="card" id="assessment-item-${comp.id}">
                    <div class="card-header">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-500">${index + 1}.</span>
                                <h4 class="card-title">${comp.name}</h4>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">${comp.description}</p>
                        </div>
                        <span class="competency-type ${comp.type.toLowerCase()}">${comp.type}</span>
                    </div>
                    <div class="card-body">
                        <p class="text-sm text-gray-600 mb-4">
                            <strong>Required Level:</strong> 
                            <span class="badge badge-danger">${position.requiredLevelName} (Level ${position.requiredLevel})</span>
                        </p>
                        
                        <div class="rating-scale">
                            ${[1, 2, 3, 4].map(level => {
        const levelInfo = comp.proficiencyLevels.find(l => l.level === level);
        return `
                                    <div class="rating-option">
                                        <input type="radio" 
                                               name="rating-${comp.id}" 
                                               id="rating-${comp.id}-${level}" 
                                               value="${level}"
                                               onchange="updateRating('${comp.id}', ${level})"
                                               required>
                                        <label for="rating-${comp.id}-${level}">
                                            <span class="rating-number">${level}</span>
                                            <span class="rating-label">${levelInfo ? levelInfo.name : `Level ${level}`}</span>
                                        </label>
                                    </div>
                                `;
    }).join('')}
                        </div>
                        
                        <div class="mt-4">
                            <button type="button" class="text-sm text-blue-600 hover:text-blue-800" onclick="toggleIndicators('${comp.id}')">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    View Behavioral Indicators
                                </span>
                            </button>
                            <div id="indicators-${comp.id}" class="hidden mt-3 space-y-2">
                                ${comp.proficiencyLevels.map(level => `
                                    <div class="p-3 bg-gray-50 rounded-lg">
                                        <p class="font-medium text-sm text-gray-900 mb-2">
                                            Level ${level.level}: ${level.name}
                                        </p>
                                        <ul class="text-xs text-gray-600 space-y-1">
                                            ${level.indicators.map(ind => `
                                                <li>• ${ind}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Toggle behavioral indicators visibility
 */
function toggleIndicators(competencyId) {
    const indicatorsDiv = document.getElementById(`indicators-${competencyId}`);
    indicatorsDiv.classList.toggle('hidden');
}

/**
 * Update rating in state
 */
function updateRating(competencyId, level) {
    AppState.selfRatings[competencyId] = level;
    console.log('Rating updated:', competencyId, level);
}

/**
 * Submit self assessment
 */
async function submitSelfAssessment(event) {
    event.preventDefault();

    // Validate all competencies are rated
    const requiredCompetencies = AppState.selectedPosition.competencyIds;
    const missingRatings = requiredCompetencies.filter(id => !AppState.selfRatings[id]);

    if (missingRatings.length > 0) {
        showToast('Please rate all competencies before submitting.', 'warning');
        // Scroll to first missing rating
        const firstMissing = document.getElementById(`assessment-item-${missingRatings[0]}`);
        if (firstMissing) {
            firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstMissing.classList.add('ring-2', 'ring-red-500');
            setTimeout(() => firstMissing.classList.remove('ring-2', 'ring-red-500'), 3000);
        }
        return;
    }

    showLoading(true);

    try {
        // In a real app, save to Firestore
        // For demo, we'll store locally and show gap analysis

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate gap analysis data
        AppState.gapAnalysisData = generateGapAnalysisFromSelfRatings();

        // Update step progress
        updateAssessmentProgress('self');

        showToast('Self assessment submitted successfully! View your gap analysis.', 'success');

        // Navigate to gap analysis
        showView('gap-analysis');

    } catch (error) {
        console.error('Error submitting assessment:', error);
        showToast('Error submitting assessment. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Generate gap analysis from self ratings
 * Note: This demo version uses simulated peer/superior scores
 * Real weighted scores are calculated in employee-app.js from actual Firestore data
 */
function generateGapAnalysisFromSelfRatings() {
    const position = AppState.selectedPosition;

    return AppState.competencies
        .filter(c => position.competencyIds.includes(c.id))
        .map(comp => {
            const selfScore = AppState.selfRatings[comp.id] || 0;
            const gap = position.requiredLevel - selfScore;

            // For demo mode, simulate peer and superior ratings
            // In production employee portal, real data is fetched from Firestore
            const peerScore = Math.max(1, Math.min(4, selfScore + (Math.random() - 0.5)));
            const superiorScore = Math.max(1, Math.min(4, selfScore + (Math.random() - 0.3)));

            // Calculate weighted score (20% self, 30% peer, 50% superior)
            const weights = { self: 0.20, peer: 0.30, superior: 0.50 };
            const weightedScore = (selfScore * weights.self) +
                (peerScore * weights.peer) +
                (superiorScore * weights.superior);

            return {
                competencyId: comp.id,
                competencyName: comp.name,
                competencyType: comp.type,
                requiredLevel: position.requiredLevel,
                requiredLevelName: position.requiredLevelName,
                actualScore: weightedScore,
                selfScore: selfScore,
                peerScore: peerScore,
                superiorScore: superiorScore,
                gap: position.requiredLevel - weightedScore,
                status: weightedScore >= position.requiredLevel ? 'met' : 'development_need',
                perceptionGap: Math.abs(selfScore - superiorScore),
                isSimulated: true // Flag to indicate demo mode
            };
        });
}

/**
 * Update assessment progress indicators
 */
function updateAssessmentProgress(completedStep) {
    const steps = {
        self: { circle: 'stepSelf', line: 'lineSelfPeer' },
        peer: { circle: 'stepPeer', line: 'linePeerSuperior' },
        superior: { circle: 'stepSuperior', line: 'lineSuperiorComplete' },
        complete: { circle: 'stepComplete' }
    };

    // Mark completed steps
    const stepOrder = ['self', 'peer', 'superior', 'complete'];
    const completedIndex = stepOrder.indexOf(completedStep);

    stepOrder.forEach((step, index) => {
        const circle = document.getElementById(steps[step].circle);
        if (circle) {
            if (index < completedIndex) {
                circle.classList.remove('active', 'pending');
                circle.classList.add('completed');
            } else if (index === completedIndex) {
                circle.classList.remove('pending');
                circle.classList.add('completed');
            }
        }

        if (steps[step].line) {
            const line = document.getElementById(steps[step].line);
            if (line && index <= completedIndex) {
                line.classList.add('completed');
            }
        }
    });

    // Activate next step
    if (completedIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[completedIndex + 1];
        const nextCircle = document.getElementById(steps[nextStep].circle);
        if (nextCircle) {
            nextCircle.classList.remove('pending');
            nextCircle.classList.add('active');
        }
    }
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

/**
 * Render gap analysis view
 */
function renderGapAnalysis() {
    if (AppState.gapAnalysisData.length === 0) {
        // Show empty state
        return;
    }

    const gapData = AppState.gapAnalysisData;

    // Update summary cards
    const metCount = gapData.filter(d => d.status === 'met').length;
    const needCount = gapData.filter(d => d.status === 'development_need').length;
    const avgScore = gapData.reduce((sum, d) => sum + d.actualScore, 0) / gapData.length;

    document.getElementById('gapMetCount').textContent = metCount;
    document.getElementById('gapNeedCount').textContent = needCount;
    document.getElementById('gapOverallScore').textContent = avgScore.toFixed(1);

    // Update dashboard stats too
    document.getElementById('statCompetenciesMet').textContent = metCount;
    document.getElementById('statDevelopmentNeeds').textContent = needCount;

    // Create charts
    createCompetencyRadarChart('gapRadarChart', gapData, 'Competency Profile Overview');
    createRaterComparisonChart('gapComparisonChart', gapData, 'Self vs Peer vs Superior Ratings');
    createGapBarChart('gapBarChart', gapData, 'Required vs Actual Proficiency');

    // Render gap details list
    renderGapDetailsList(gapData);
}

/**
 * Render detailed gap analysis list
 */
function renderGapDetailsList(gapData) {
    const container = document.getElementById('gapDetailsList');

    // Sort by gap size (largest gaps first)
    const sortedData = [...gapData].sort((a, b) => b.gap - a.gap);

    container.innerHTML = `
        <div class="space-y-3">
            ${sortedData.map(item => `
                <div class="gap-card ${item.status === 'met' ? 'met' : 'gap'}">
                    <div class="gap-info">
                        <p class="gap-competency">${item.competencyName}</p>
                        <p class="gap-details">
                            Required: ${item.requiredLevelName} (${item.requiredLevel}) | 
                            Weighted Score: ${item.actualScore.toFixed(2)} | 
                            Self: ${item.selfScore} | 
                            Peer: ${item.peerScore.toFixed(1)} | 
                            Superior: ${item.superiorScore.toFixed(1)}
                        </p>
                        ${item.perceptionGap > 0.5 ? `
                            <p class="text-xs text-yellow-600 mt-1">
                                ⚠️ Perception gap detected: Your self-rating differs from superior's rating by ${item.perceptionGap.toFixed(1)} levels
                            </p>
                        ` : ''}
                    </div>
                    <div class="gap-status">
                        ${item.status === 'met' ? `
                            <div class="gap-icon success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span class="text-sm font-medium text-green-600">Met</span>
                        ` : `
                            <div class="gap-icon danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span class="text-sm font-medium text-red-600">Gap: ${item.gap.toFixed(1)}</span>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${sortedData.some(d => d.status === 'development_need') ? `
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-blue-900 mb-2">Recommended Development Actions</h4>
                <ul class="text-sm text-blue-700 space-y-2">
                    ${sortedData.filter(d => d.status === 'development_need').slice(0, 3).map(d => `
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span><strong>${d.competencyName}:</strong> Consider training, mentoring, or job rotation to develop from current level to ${d.requiredLevelName}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

// ============================================================================
// ADMIN - DEPARTMENTS
// ============================================================================

function loadDepartmentsTable() {
    const tbody = document.getElementById('departmentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = AppState.departments.map(dept => `
        <tr>
            <td class="font-medium">${dept.name}</td>
            <td>${dept.minPeerRaters}</td>
            <td>${dept.maxPeerRaters}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editDepartment('${dept.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </button>
            </td>
        </tr>
    `).join('');
}

function editDepartment(deptId) {
    showToast('Department editing coming soon!', 'info');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');

    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    };

    const toastId = `toast-${Date.now()}`;
    const toastHtml = `
        <div class="toast ${type}" id="${toastId}">
            <div class="toast-icon">${icons[type]}</div>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="removeToast('${toastId}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(toastId), 5000);
}

function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }
}

// ============================================================================
// LOADING OVERLAY
// ============================================================================

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// ============================================================================
// DATABASE SEEDING (Wrapper for UI)
// ============================================================================

// Save reference to the original seedDatabase from database.js
const originalSeedDatabase = window.seedDatabase;

async function seedDatabaseUI() {
    showLoading(true);
    try {
        // Call the original seedDatabase from database.js
        const result = await originalSeedDatabase();
        if (result && result.success) {
            showToast(result.message, 'success');
            // Reload data
            await loadInitialData();
            // Refresh current view
            onViewChange(AppState.currentView);
        } else {
            showToast(result ? result.message : 'Unknown error', 'error');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        showToast('Error seeding database: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Override for the header button click
window.seedDatabase = async function () {
    await seedDatabaseUI();
};

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================
window.showView = showView;
window.toggleSidebar = toggleSidebar;
window.filterCompetencies = filterCompetencies;
window.onPositionChange = onPositionChange;
window.toggleIndicators = toggleIndicators;
window.updateRating = updateRating;
window.submitSelfAssessment = submitSelfAssessment;
window.editDepartment = editDepartment;
window.showToast = showToast;
window.removeToast = removeToast;

console.log('📱 App module loaded');
