// ============================================================================
// CIC Competency Framework System - Chart Visualization
// ============================================================================
// Uses Chart.js for gap analysis and competency visualization

/**
 * Create a radar chart for competency overview
 */
function createCompetencyRadarChart(canvasId, gapAnalysis, chartTitle = 'Competency Profile') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }

    // Destroy existing chart if any
    if (window.competencyCharts && window.competencyCharts[canvasId]) {
        window.competencyCharts[canvasId].destroy();
    }

    const labels = gapAnalysis.map(item => {
        // Truncate long names for better display
        const name = item.competencyName;
        return name.length > 25 ? name.substring(0, 22) + '...' : name;
    });

    const requiredLevels = gapAnalysis.map(item => item.requiredLevel);
    const actualScores = gapAnalysis.map(item => item.actualScore || 0);
    const selfScores = gapAnalysis.map(item => item.selfScore || 0);
    const peerScores = gapAnalysis.map(item => item.peerScore || 0);
    const superiorScores = gapAnalysis.map(item => item.superiorScore || 0);

    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Required Level',
                    data: requiredLevels,
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    pointRadius: 4
                },
                {
                    label: 'Weighted Score',
                    data: actualScores,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointRadius: 5
                },
                {
                    label: 'Self Assessment',
                    data: selfScores,
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                    pointRadius: 3,
                    hidden: true
                },
                {
                    label: 'Peer Average',
                    data: peerScores,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                    pointRadius: 3,
                    hidden: true
                },
                {
                    label: 'Superior Rating',
                    data: superiorScores,
                    borderColor: 'rgba(139, 92, 246, 1)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                    pointRadius: 3,
                    hidden: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1e3a5f'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label;
                            const value = context.raw.toFixed(2);
                            const levelName = getLevelName(context.raw);
                            return `${label}: ${value} (${levelName})`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const levels = ['', 'Basic', 'Intermediate', 'Advanced', 'Superior'];
                            return levels[value] || '';
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });

    // Store chart reference
    if (!window.competencyCharts) window.competencyCharts = {};
    window.competencyCharts[canvasId] = chart;

    return chart;
}

/**
 * Create a horizontal bar chart for gap analysis
 */
function createGapBarChart(canvasId, gapAnalysis, chartTitle = 'Competency Gap Analysis') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }

    // Destroy existing chart if any
    if (window.competencyCharts && window.competencyCharts[canvasId]) {
        window.competencyCharts[canvasId].destroy();
    }

    const labels = gapAnalysis.map(item => {
        const name = item.competencyName;
        return name.length > 30 ? name.substring(0, 27) + '...' : name;
    });

    const requiredLevels = gapAnalysis.map(item => item.requiredLevel);
    const actualScores = gapAnalysis.map(item => item.actualScore || 0);

    // Calculate gap colors
    const gapColors = gapAnalysis.map(item => {
        if (item.status === 'met') {
            return 'rgba(16, 185, 129, 0.8)'; // Green
        } else {
            return 'rgba(239, 68, 68, 0.8)'; // Red
        }
    });

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Required Level',
                    data: requiredLevels,
                    backgroundColor: 'rgba(203, 213, 225, 0.8)',
                    borderColor: 'rgba(148, 163, 184, 1)',
                    borderWidth: 1,
                    barPercentage: 0.9,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Weighted Score',
                    data: actualScores,
                    backgroundColor: gapColors,
                    borderColor: gapColors.map(c => c.replace('0.8', '1')),
                    borderWidth: 1,
                    barPercentage: 0.9,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1e3a5f'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label;
                            const value = context.raw.toFixed(2);
                            const levelName = getLevelName(context.raw);
                            return `${label}: ${value} (${levelName})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const levels = ['0', 'Basic (1)', 'Intermediate (2)', 'Advanced (3)', 'Superior (4)'];
                            return levels[value] || '';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Store chart reference
    if (!window.competencyCharts) window.competencyCharts = {};
    window.competencyCharts[canvasId] = chart;

    return chart;
}

/**
 * Create a comparison chart showing Self vs Peer vs Superior ratings
 */
function createRaterComparisonChart(canvasId, gapAnalysis, chartTitle = 'Rating Comparison: Self vs Peer vs Superior') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }

    // Destroy existing chart if any
    if (window.competencyCharts && window.competencyCharts[canvasId]) {
        window.competencyCharts[canvasId].destroy();
    }

    const labels = gapAnalysis.map(item => {
        const name = item.competencyName;
        return name.length > 20 ? name.substring(0, 17) + '...' : name;
    });

    const selfScores = gapAnalysis.map(item => item.selfScore || 0);
    const peerScores = gapAnalysis.map(item => item.peerScore || 0);
    const superiorScores = gapAnalysis.map(item => item.superiorScore || 0);
    const requiredLevels = gapAnalysis.map(item => item.requiredLevel);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Self Assessment',
                    data: selfScores,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Peer Average',
                    data: peerScores,
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Superior Rating',
                    data: superiorScores,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Required Level',
                    data: requiredLevels,
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1e3a5f'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label;
                            const value = context.raw.toFixed(2);
                            const levelName = getLevelName(context.raw);
                            return `${label}: ${value} (${levelName})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const levels = ['0', 'Basic', 'Intermediate', 'Advanced', 'Superior'];
                            return levels[value] || '';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });

    // Store chart reference
    if (!window.competencyCharts) window.competencyCharts = {};
    window.competencyCharts[canvasId] = chart;

    return chart;
}

/**
 * Create a doughnut chart for overall gap summary
 */
function createGapSummaryChart(canvasId, gapAnalysis, chartTitle = 'Assessment Summary') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }

    // Destroy existing chart if any
    if (window.competencyCharts && window.competencyCharts[canvasId]) {
        window.competencyCharts[canvasId].destroy();
    }

    const metCount = gapAnalysis.filter(item => item.status === 'met').length;
    const gapCount = gapAnalysis.filter(item => item.status === 'development_need').length;

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Competencies Met', 'Development Needs'],
            datasets: [{
                data: [metCount, gapCount],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1e3a5f'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = metCount + gapCount;
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Store chart reference
    if (!window.competencyCharts) window.competencyCharts = {};
    window.competencyCharts[canvasId] = chart;

    return chart;
}

/**
 * Create perception gap indicators chart
 */
function createPerceptionGapChart(canvasId, gapAnalysis, chartTitle = 'Self-Perception vs Reality') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }

    // Destroy existing chart if any
    if (window.competencyCharts && window.competencyCharts[canvasId]) {
        window.competencyCharts[canvasId].destroy();
    }

    // Filter to only items with perception gap data
    const itemsWithGap = gapAnalysis.filter(item =>
        item.selfScore !== null && item.superiorScore !== null
    );

    const labels = itemsWithGap.map(item => {
        const name = item.competencyName;
        return name.length > 25 ? name.substring(0, 22) + '...' : name;
    });

    const gaps = itemsWithGap.map(item => {
        return (item.selfScore || 0) - (item.superiorScore || 0);
    });

    const gapColors = gaps.map(gap => {
        if (gap > 0.5) {
            return 'rgba(245, 158, 11, 0.8)'; // Orange - self rates higher
        } else if (gap < -0.5) {
            return 'rgba(59, 130, 246, 0.8)'; // Blue - superior rates higher
        } else {
            return 'rgba(16, 185, 129, 0.8)'; // Green - aligned
        }
    });

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Perception Gap (Self - Superior)',
                data: gaps,
                backgroundColor: gapColors,
                borderColor: gapColors.map(c => c.replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1e3a5f'
                },
                subtitle: {
                    display: true,
                    text: 'Positive = You rate yourself higher | Negative = Superior rates you higher',
                    font: {
                        size: 12
                    },
                    color: '#64748b',
                    padding: {
                        bottom: 10
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw.toFixed(2);
                            if (context.raw > 0) {
                                return `You rate yourself ${Math.abs(value)} levels higher than your superior`;
                            } else if (context.raw < 0) {
                                return `Your superior rates you ${Math.abs(value)} levels higher than yourself`;
                            } else {
                                return 'Ratings are aligned';
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: -2,
                    max: 2,
                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return 'rgba(0, 0, 0, 0.3)';
                            }
                            return 'rgba(0, 0, 0, 0.05)';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Store chart reference
    if (!window.competencyCharts) window.competencyCharts = {};
    window.competencyCharts[canvasId] = chart;

    return chart;
}

/**
 * Helper function to get level name from numeric value
 */
function getLevelName(value) {
    if (value <= 0) return 'Not Rated';
    if (value <= 1) return 'Basic';
    if (value <= 2) return 'Intermediate';
    if (value <= 3) return 'Advanced';
    return 'Superior';
}

/**
 * Destroy all charts (cleanup)
 */
function destroyAllCharts() {
    if (window.competencyCharts) {
        Object.values(window.competencyCharts).forEach(chart => {
            if (chart) chart.destroy();
        });
        window.competencyCharts = {};
    }
}

// Export functions globally
window.createCompetencyRadarChart = createCompetencyRadarChart;
window.createGapBarChart = createGapBarChart;
window.createRaterComparisonChart = createRaterComparisonChart;
window.createGapSummaryChart = createGapSummaryChart;
window.createPerceptionGapChart = createPerceptionGapChart;
window.getLevelName = getLevelName;
window.destroyAllCharts = destroyAllCharts;

console.log('📊 Charts module loaded');
