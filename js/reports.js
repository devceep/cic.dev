/**
 * CIC Competency Framework System
 * Reports Module - PDF Generation
 * 
 * Uses jsPDF and jsPDF-AutoTable for generating competency assessment reports
 */

// ============================================================================
// PDF STYLING CONSTANTS
// ============================================================================

const PDF_STYLES = {
    colors: {
        primary: [30, 58, 95],      // CIC Blue
        secondary: [59, 130, 246],   // Light Blue
        success: [5, 150, 105],      // Green
        warning: [217, 119, 6],      // Orange
        danger: [220, 38, 38],       // Red
        gray: [107, 114, 128],       // Gray
        lightGray: [243, 244, 246],  // Light Gray
        white: [255, 255, 255]
    },
    fonts: {
        title: 18,
        subtitle: 14,
        heading: 12,
        body: 10,
        small: 8
    },
    margins: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date for display
 */
function formatDateForReport(date) {
    if (!date) return '--';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get status color for gap analysis
 */
function getGapStatusColor(gap) {
    if (gap <= 0) return PDF_STYLES.colors.success;
    if (gap <= 1) return PDF_STYLES.colors.warning;
    return PDF_STYLES.colors.danger;
}

/**
 * Get proficiency level name
 */
function getProficiencyLevelName(level) {
    const names = {
        1: 'Basic',
        2: 'Intermediate',
        3: 'Advanced',
        4: 'Superior'
    };
    return names[Math.round(level)] || 'N/A';
}

/**
 * Add header to PDF
 */
function addPDFHeader(doc, title, subtitle = '') {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(...PDF_STYLES.colors.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // CIC Logo placeholder
    doc.setFontSize(16);
    doc.setTextColor(...PDF_STYLES.colors.white);
    doc.setFont('helvetica', 'bold');
    doc.text('CIC', PDF_STYLES.margins.left, 15);

    // Title
    doc.setFontSize(PDF_STYLES.fonts.title);
    doc.text(title, PDF_STYLES.margins.left, 28);

    // Subtitle on the right
    if (subtitle) {
        doc.setFontSize(PDF_STYLES.fonts.small);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, pageWidth - PDF_STYLES.margins.right, 28, { align: 'right' });
    }

    return 45; // Return Y position after header
}

/**
 * Add footer to PDF
 */
function addPDFFooter(doc, pageNumber) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setTextColor(...PDF_STYLES.colors.gray);

    // Generation date
    const generatedDate = new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(`Generated: ${generatedDate}`, PDF_STYLES.margins.left, pageHeight - 10);

    // Page number
    doc.text(`Page ${pageNumber}`, pageWidth - PDF_STYLES.margins.right, pageHeight - 10, { align: 'right' });

    // Confidential notice
    doc.setFontSize(PDF_STYLES.fonts.small - 1);
    doc.text('CONFIDENTIAL - For internal use only', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

/**
 * Add section heading
 */
function addSectionHeading(doc, title, yPos) {
    doc.setFontSize(PDF_STYLES.fonts.heading);
    doc.setTextColor(...PDF_STYLES.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(title, PDF_STYLES.margins.left, yPos);

    // Underline
    doc.setDrawColor(...PDF_STYLES.colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(PDF_STYLES.margins.left, yPos + 2, PDF_STYLES.margins.left + 60, yPos + 2);

    return yPos + 10;
}

// ============================================================================
// INDIVIDUAL GAP ANALYSIS REPORT
// ============================================================================

/**
 * Generate Individual Gap Analysis Report
 * @param {Object} userData - User information
 * @param {Object} assessmentData - Assessment data
 * @param {Array} gapAnalysis - Gap analysis results
 */
async function generateIndividualGapReport(userData, assessmentData, gapAnalysis) {
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        console.error('jsPDF library not loaded');
        showToast('PDF library not loaded. Please refresh and try again.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Page 1: Header and Summary
    let yPos = addPDFHeader(doc, 'Individual Gap Analysis Report', 'Competency Assessment');

    // Employee Information Card
    yPos = addSectionHeading(doc, 'Employee Information', yPos);

    const position = CIC_POSITIONS.find(p => p.id === userData.positionId);

    doc.setFontSize(PDF_STYLES.fonts.body);
    doc.setTextColor(...PDF_STYLES.colors.gray);
    doc.setFont('helvetica', 'normal');

    const infoData = [
        ['Name:', userData.name || 'N/A'],
        ['Position:', position?.title || 'N/A'],
        ['Department:', position?.department || 'N/A'],
        ['Assessment Cycle:', assessmentData?.cycleName || 'Current Cycle'],
        ['Required Level:', position?.requiredLevelName || 'N/A']
    ];

    infoData.forEach(([label, value], index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, PDF_STYLES.margins.left, yPos + (index * 6));
        doc.setFont('helvetica', 'normal');
        doc.text(value, PDF_STYLES.margins.left + 40, yPos + (index * 6));
    });

    yPos += 40;

    // Assessment Summary
    yPos = addSectionHeading(doc, 'Assessment Summary', yPos);

    const totalCompetencies = gapAnalysis.length;
    const metCompetencies = gapAnalysis.filter(g => g.status === 'met').length;
    const developmentNeeds = totalCompetencies - metCompetencies;
    const avgGap = gapAnalysis.reduce((sum, g) => sum + Math.max(0, g.gap), 0) / totalCompetencies;

    // Summary boxes
    const boxWidth = 42;
    const boxHeight = 25;
    const boxY = yPos;

    // Met competencies box
    doc.setFillColor(...PDF_STYLES.colors.success);
    doc.roundedRect(PDF_STYLES.margins.left, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(...PDF_STYLES.colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(metCompetencies), PDF_STYLES.margins.left + boxWidth / 2, boxY + 12, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Met', PDF_STYLES.margins.left + boxWidth / 2, boxY + 20, { align: 'center' });

    // Development needs box
    doc.setFillColor(...PDF_STYLES.colors.warning);
    doc.roundedRect(PDF_STYLES.margins.left + boxWidth + 5, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(developmentNeeds), PDF_STYLES.margins.left + boxWidth + 5 + boxWidth / 2, boxY + 12, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Dev. Needs', PDF_STYLES.margins.left + boxWidth + 5 + boxWidth / 2, boxY + 20, { align: 'center' });

    // Average gap box
    doc.setFillColor(...PDF_STYLES.colors.primary);
    doc.roundedRect(PDF_STYLES.margins.left + (boxWidth + 5) * 2, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(avgGap.toFixed(1), PDF_STYLES.margins.left + (boxWidth + 5) * 2 + boxWidth / 2, boxY + 12, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Avg Gap', PDF_STYLES.margins.left + (boxWidth + 5) * 2 + boxWidth / 2, boxY + 20, { align: 'center' });

    // Total competencies box
    doc.setFillColor(...PDF_STYLES.colors.gray);
    doc.roundedRect(PDF_STYLES.margins.left + (boxWidth + 5) * 3, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalCompetencies), PDF_STYLES.margins.left + (boxWidth + 5) * 3 + boxWidth / 2, boxY + 12, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Total', PDF_STYLES.margins.left + (boxWidth + 5) * 3 + boxWidth / 2, boxY + 20, { align: 'center' });

    yPos = boxY + boxHeight + 15;

    // Gap Analysis Table
    yPos = addSectionHeading(doc, 'Competency Gap Analysis', yPos);

    const tableData = gapAnalysis.map(gap => [
        gap.competencyName,
        gap.competencyType,
        gap.requiredLevel.toFixed(0),
        gap.actualScore ? gap.actualScore.toFixed(2) : 'N/A',
        gap.gap.toFixed(2),
        gap.status === 'met' ? '✓ Met' : '✗ Gap'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Competency', 'Type', 'Required', 'Actual', 'Gap', 'Status']],
        body: tableData,
        styles: {
            fontSize: PDF_STYLES.fonts.small,
            cellPadding: 3
        },
        headStyles: {
            fillColor: PDF_STYLES.colors.primary,
            textColor: PDF_STYLES.colors.white,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: PDF_STYLES.colors.lightGray
        },
        columnStyles: {
            0: { cellWidth: 55 },
            1: { cellWidth: 25 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 5) {
                const gap = gapAnalysis[data.row.index];
                if (gap.status === 'met') {
                    data.cell.styles.textColor = PDF_STYLES.colors.success;
                } else {
                    data.cell.styles.textColor = PDF_STYLES.colors.danger;
                }
            }
        },
        margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Score Breakdown Section
    if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
    }

    yPos = addSectionHeading(doc, 'Score Breakdown by Rater Type', yPos);

    const breakdownData = gapAnalysis.map(gap => [
        gap.competencyName,
        gap.selfScore ? gap.selfScore.toFixed(2) : 'N/A',
        gap.peerScore ? gap.peerScore.toFixed(2) : 'N/A',
        gap.superiorScore ? gap.superiorScore.toFixed(2) : 'N/A',
        gap.actualScore ? gap.actualScore.toFixed(2) : 'N/A'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Competency', 'Self (30%)', 'Peer (40%)', 'Superior (30%)', 'Weighted']],
        body: breakdownData,
        styles: {
            fontSize: PDF_STYLES.fonts.small,
            cellPadding: 3
        },
        headStyles: {
            fillColor: PDF_STYLES.colors.secondary,
            textColor: PDF_STYLES.colors.white,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: PDF_STYLES.colors.lightGray
        },
        margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Development Recommendations
    if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
    }

    yPos = addSectionHeading(doc, 'Development Recommendations', yPos);

    const developmentGaps = gapAnalysis.filter(g => g.status === 'development_need');

    if (developmentGaps.length === 0) {
        doc.setFontSize(PDF_STYLES.fonts.body);
        doc.setTextColor(...PDF_STYLES.colors.success);
        doc.text('All competencies meet the required proficiency level. Continue to maintain and enhance current skills.', PDF_STYLES.margins.left, yPos);
    } else {
        doc.setFontSize(PDF_STYLES.fonts.body);
        doc.setTextColor(...PDF_STYLES.colors.gray);

        developmentGaps.forEach((gap, index) => {
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...PDF_STYLES.colors.primary);
            doc.text(`${index + 1}. ${gap.competencyName}`, PDF_STYLES.margins.left, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...PDF_STYLES.colors.gray);
            doc.text(`Gap: ${gap.gap.toFixed(2)} levels | Current: ${getProficiencyLevelName(gap.actualScore)} → Target: ${gap.requiredLevelName}`, PDF_STYLES.margins.left + 5, yPos);
            yPos += 6;

            // Recommendation based on gap size
            let recommendation = '';
            if (gap.gap > 2) {
                recommendation = 'Priority focus area. Consider formal training, mentoring, and structured learning programs.';
            } else if (gap.gap > 1) {
                recommendation = 'Moderate development need. On-the-job learning, coaching, and self-study recommended.';
            } else {
                recommendation = 'Minor improvement needed. Targeted practice and feedback will help close the gap.';
            }

            doc.setFontSize(PDF_STYLES.fonts.small);
            const splitText = doc.splitTextToSize(recommendation, pageWidth - PDF_STYLES.margins.left - PDF_STYLES.margins.right - 10);
            doc.text(splitText, PDF_STYLES.margins.left + 5, yPos);
            yPos += splitText.length * 5 + 5;
        });
    }

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addPDFFooter(doc, i);
    }

    // Save the PDF
    const fileName = `Gap_Analysis_${userData.name?.replace(/\s+/g, '_') || 'Employee'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    showToast('Individual Gap Analysis Report generated successfully!', 'success');
    console.log('✅ PDF Report generated:', fileName);
}

// ============================================================================
// DEPARTMENTAL SUMMARY REPORT
// ============================================================================

/**
 * Generate Departmental Summary Report
 * @param {string} departmentName - Department name
 * @param {Array} employees - List of employees with assessment data
 * @param {Object} cycleName - Assessment cycle name
 */
async function generateDepartmentSummaryReport(departmentName, employees, cycleName) {
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        console.error('jsPDF library not loaded');
        showToast('PDF library not loaded. Please refresh and try again.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    let yPos = addPDFHeader(doc, 'Departmental Summary Report', departmentName);

    // Department Info
    yPos = addSectionHeading(doc, 'Department Overview', yPos);

    doc.setFontSize(PDF_STYLES.fonts.body);
    doc.setTextColor(...PDF_STYLES.colors.gray);
    doc.setFont('helvetica', 'normal');

    const totalEmployees = employees.length;
    const assessedEmployees = employees.filter(e => e.assessmentStatus === 'completed').length;
    const completionRate = totalEmployees > 0 ? ((assessedEmployees / totalEmployees) * 100).toFixed(1) : 0;

    doc.text(`Department: ${departmentName}`, PDF_STYLES.margins.left, yPos);
    yPos += 6;
    doc.text(`Assessment Cycle: ${cycleName || 'Current Cycle'}`, PDF_STYLES.margins.left, yPos);
    yPos += 6;
    doc.text(`Total Employees: ${totalEmployees}`, PDF_STYLES.margins.left, yPos);
    yPos += 6;
    doc.text(`Assessed: ${assessedEmployees} (${completionRate}%)`, PDF_STYLES.margins.left, yPos);
    yPos += 15;

    // Employee Assessment Status Table
    yPos = addSectionHeading(doc, 'Employee Assessment Status', yPos);

    const statusData = employees.map(emp => [
        emp.name,
        emp.position,
        emp.selfAssessmentStatus === 'completed' ? '✓' : '○',
        emp.peerAssessmentStatus === 'completed' ? '✓' : '○',
        emp.superiorAssessmentStatus === 'completed' ? '✓' : '○',
        emp.assessmentStatus === 'completed' ? 'Complete' : 'Pending'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Employee', 'Position', 'Self', 'Peer', 'Superior', 'Status']],
        body: statusData,
        styles: {
            fontSize: PDF_STYLES.fonts.small,
            cellPadding: 3
        },
        headStyles: {
            fillColor: PDF_STYLES.colors.primary,
            textColor: PDF_STYLES.colors.white,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: PDF_STYLES.colors.lightGray
        },
        columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' }
        },
        margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Competency Gap Summary (if we have assessed employees)
    if (assessedEmployees > 0) {
        yPos = addSectionHeading(doc, 'Competency Gap Summary', yPos);

        // Aggregate gaps by competency
        const competencyGaps = {};
        employees.forEach(emp => {
            if (emp.gapAnalysis) {
                emp.gapAnalysis.forEach(gap => {
                    if (!competencyGaps[gap.competencyId]) {
                        competencyGaps[gap.competencyId] = {
                            name: gap.competencyName,
                            type: gap.competencyType,
                            gaps: [],
                            metCount: 0,
                            gapCount: 0
                        };
                    }
                    competencyGaps[gap.competencyId].gaps.push(gap.gap);
                    if (gap.status === 'met') {
                        competencyGaps[gap.competencyId].metCount++;
                    } else {
                        competencyGaps[gap.competencyId].gapCount++;
                    }
                });
            }
        });

        const gapSummaryData = Object.values(competencyGaps).map(comp => {
            const avgGap = comp.gaps.length > 0 ? (comp.gaps.reduce((a, b) => a + b, 0) / comp.gaps.length) : 0;
            return [
                comp.name,
                comp.type,
                comp.metCount.toString(),
                comp.gapCount.toString(),
                avgGap.toFixed(2)
            ];
        });

        doc.autoTable({
            startY: yPos,
            head: [['Competency', 'Type', 'Met', 'Gaps', 'Avg Gap']],
            body: gapSummaryData,
            styles: {
                fontSize: PDF_STYLES.fonts.small,
                cellPadding: 3
            },
            headStyles: {
                fillColor: PDF_STYLES.colors.secondary,
                textColor: PDF_STYLES.colors.white,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: PDF_STYLES.colors.lightGray
            },
            margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
        });
    }

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addPDFFooter(doc, i);
    }

    const fileName = `Department_Summary_${departmentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    showToast('Departmental Summary Report generated successfully!', 'success');
    console.log('✅ PDF Report generated:', fileName);
}

// ============================================================================
// ASSESSMENT COMPLETION REPORT
// ============================================================================

/**
 * Generate Assessment Completion Status Report
 * @param {Object} cycleData - Assessment cycle information
 * @param {Array} departmentStats - Statistics by department
 */
async function generateCompletionStatusReport(cycleData, departmentStats) {
    if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        console.error('jsPDF library not loaded');
        showToast('PDF library not loaded. Please refresh and try again.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    let yPos = addPDFHeader(doc, 'Assessment Completion Status', cycleData?.name || 'Current Cycle');

    // Cycle Overview
    yPos = addSectionHeading(doc, 'Cycle Overview', yPos);

    doc.setFontSize(PDF_STYLES.fonts.body);
    doc.setTextColor(...PDF_STYLES.colors.gray);

    const cycleInfo = [
        ['Cycle Name:', cycleData?.name || 'N/A'],
        ['Start Date:', formatDateForReport(cycleData?.startDate)],
        ['End Date:', formatDateForReport(cycleData?.endDate)],
        ['Status:', cycleData?.status?.charAt(0).toUpperCase() + cycleData?.status?.slice(1) || 'N/A']
    ];

    cycleInfo.forEach(([label, value], index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, PDF_STYLES.margins.left, yPos + (index * 6));
        doc.setFont('helvetica', 'normal');
        doc.text(value, PDF_STYLES.margins.left + 35, yPos + (index * 6));
    });

    yPos += 35;

    // Overall Statistics
    yPos = addSectionHeading(doc, 'Overall Statistics', yPos);

    const totalEmployees = departmentStats.reduce((sum, d) => sum + d.totalEmployees, 0);
    const totalComplete = departmentStats.reduce((sum, d) => sum + d.completedAssessments, 0);
    const overallCompletion = totalEmployees > 0 ? ((totalComplete / totalEmployees) * 100).toFixed(1) : 0;

    // Summary boxes
    const boxWidth = 55;
    const boxHeight = 30;
    const boxY = yPos;

    // Total employees
    doc.setFillColor(...PDF_STYLES.colors.primary);
    doc.roundedRect(PDF_STYLES.margins.left, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(...PDF_STYLES.colors.white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalEmployees), PDF_STYLES.margins.left + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Employees', PDF_STYLES.margins.left + boxWidth / 2, boxY + 24, { align: 'center' });

    // Completed
    doc.setFillColor(...PDF_STYLES.colors.success);
    doc.roundedRect(PDF_STYLES.margins.left + boxWidth + 10, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalComplete), PDF_STYLES.margins.left + boxWidth + 10 + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Completed', PDF_STYLES.margins.left + boxWidth + 10 + boxWidth / 2, boxY + 24, { align: 'center' });

    // Completion rate
    doc.setFillColor(...PDF_STYLES.colors.warning);
    doc.roundedRect(PDF_STYLES.margins.left + (boxWidth + 10) * 2, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overallCompletion}%`, PDF_STYLES.margins.left + (boxWidth + 10) * 2 + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Completion', PDF_STYLES.margins.left + (boxWidth + 10) * 2 + boxWidth / 2, boxY + 24, { align: 'center' });

    yPos = boxY + boxHeight + 15;

    // Department Breakdown
    yPos = addSectionHeading(doc, 'Completion by Department', yPos);

    const deptData = departmentStats.map(dept => [
        dept.name,
        String(dept.totalEmployees),
        String(dept.completedAssessments),
        String(dept.totalEmployees - dept.completedAssessments),
        `${dept.totalEmployees > 0 ? ((dept.completedAssessments / dept.totalEmployees) * 100).toFixed(1) : 0}%`
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Department', 'Total', 'Complete', 'Pending', 'Rate']],
        body: deptData,
        styles: {
            fontSize: PDF_STYLES.fonts.small,
            cellPadding: 3
        },
        headStyles: {
            fillColor: PDF_STYLES.colors.primary,
            textColor: PDF_STYLES.colors.white,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: PDF_STYLES.colors.lightGray
        },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' }
        },
        margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Completion by Assessment Type
    yPos = addSectionHeading(doc, 'Completion by Assessment Type', yPos);

    const selfComplete = departmentStats.reduce((sum, d) => sum + (d.selfComplete || 0), 0);
    const peerComplete = departmentStats.reduce((sum, d) => sum + (d.peerComplete || 0), 0);
    const superiorComplete = departmentStats.reduce((sum, d) => sum + (d.superiorComplete || 0), 0);

    const typeData = [
        ['Self Assessment', String(selfComplete), String(totalEmployees - selfComplete), `${totalEmployees > 0 ? ((selfComplete / totalEmployees) * 100).toFixed(1) : 0}%`],
        ['Peer Assessment', String(peerComplete), String(totalEmployees - peerComplete), `${totalEmployees > 0 ? ((peerComplete / totalEmployees) * 100).toFixed(1) : 0}%`],
        ['Superior Assessment', String(superiorComplete), String(totalEmployees - superiorComplete), `${totalEmployees > 0 ? ((superiorComplete / totalEmployees) * 100).toFixed(1) : 0}%`]
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Assessment Type', 'Complete', 'Pending', 'Rate']],
        body: typeData,
        styles: {
            fontSize: PDF_STYLES.fonts.small,
            cellPadding: 3
        },
        headStyles: {
            fillColor: PDF_STYLES.colors.secondary,
            textColor: PDF_STYLES.colors.white,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: PDF_STYLES.colors.lightGray
        },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' }
        },
        margin: { left: PDF_STYLES.margins.left, right: PDF_STYLES.margins.right }
    });

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addPDFFooter(doc, i);
    }

    const fileName = `Completion_Status_${cycleData?.name?.replace(/\s+/g, '_') || 'Cycle'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    showToast('Completion Status Report generated successfully!', 'success');
    console.log('✅ PDF Report generated:', fileName);
}

// ============================================================================
// REPORT DATA COLLECTION HELPERS
// ============================================================================

/**
 * Collect data and generate individual report
 * @param {string} userId - Optional specific user ID
 */
async function triggerIndividualReport(userId = null) {
    showLoading(true);

    try {
        // Get current user if not specified
        const targetUserId = userId || firebase.auth().currentUser?.uid;
        if (!targetUserId) {
            throw new Error('No user specified');
        }

        // Get user data
        const userData = await getUserById(targetUserId);
        if (!userData) {
            throw new Error('User not found');
        }

        // Get assessment for user
        const assessments = await getAssessmentsForUser(targetUserId);
        const latestAssessment = assessments[0];

        if (!latestAssessment) {
            showToast('No assessment found for this user.', 'warning');
            showLoading(false);
            return;
        }

        // Generate gap analysis
        const gapAnalysis = await generateGapAnalysis(latestAssessment.id);

        // Generate the report
        await generateIndividualGapReport(userData, latestAssessment, gapAnalysis);

    } catch (error) {
        console.error('Error generating individual report:', error);
        showToast('Error generating report: ' + error.message, 'error');
    }

    showLoading(false);
}

/**
 * Collect data and generate department report
 * @param {string} departmentName - Department name
 */
async function triggerDepartmentReport(departmentName = null) {
    showLoading(true);

    try {
        // If no department specified, show selector (for now, use first department)
        const targetDepartment = departmentName || CIC_DEPARTMENTS[0]?.name;
        if (!targetDepartment) {
            throw new Error('No department specified');
        }

        // Get employees in department
        const allUsers = await db.collection('users').get();
        const employees = [];

        for (const doc of allUsers.docs) {
            const user = doc.data();
            const position = CIC_POSITIONS.find(p => p.id === user.positionId);

            if (position?.department === targetDepartment) {
                // Get assessment data
                const assessments = await getAssessmentsForUser(doc.id);
                const latestAssessment = assessments[0];

                let gapAnalysis = null;
                if (latestAssessment?.status === 'completed') {
                    gapAnalysis = await generateGapAnalysis(latestAssessment.id);
                }

                employees.push({
                    id: doc.id,
                    name: user.name,
                    position: position.title,
                    selfAssessmentStatus: latestAssessment?.selfAssessmentStatus || 'pending',
                    peerAssessmentStatus: latestAssessment?.peerAssessmentStatus || 'pending',
                    superiorAssessmentStatus: latestAssessment?.superiorAssessmentStatus || 'pending',
                    assessmentStatus: latestAssessment?.status || 'pending',
                    gapAnalysis: gapAnalysis
                });
            }
        }

        // Get current cycle
        const cycle = await getActiveAssessmentCycle();

        // Generate the report
        await generateDepartmentSummaryReport(targetDepartment, employees, cycle?.name);

    } catch (error) {
        console.error('Error generating department report:', error);
        showToast('Error generating report: ' + error.message, 'error');
    }

    showLoading(false);
}

/**
 * Collect data and generate completion report
 */
async function triggerCompletionReport() {
    showLoading(true);

    try {
        // Get current cycle
        const cycle = await getActiveAssessmentCycle();

        // Collect statistics by department
        const departmentStats = [];

        for (const dept of CIC_DEPARTMENTS) {
            const stats = {
                name: dept.name,
                totalEmployees: 0,
                completedAssessments: 0,
                selfComplete: 0,
                peerComplete: 0,
                superiorComplete: 0
            };

            // Get employees in department
            const allUsers = await db.collection('users').get();

            for (const doc of allUsers.docs) {
                const user = doc.data();
                const position = CIC_POSITIONS.find(p => p.id === user.positionId);

                if (position?.department === dept.name) {
                    stats.totalEmployees++;

                    // Get assessment data
                    const assessments = await getAssessmentsForUser(doc.id);
                    const latestAssessment = assessments[0];

                    if (latestAssessment) {
                        if (latestAssessment.status === 'completed') {
                            stats.completedAssessments++;
                        }
                        if (latestAssessment.selfAssessmentStatus === 'completed') {
                            stats.selfComplete++;
                        }
                        if (latestAssessment.peerAssessmentStatus === 'completed') {
                            stats.peerComplete++;
                        }
                        if (latestAssessment.superiorAssessmentStatus === 'completed') {
                            stats.superiorComplete++;
                        }
                    }
                }
            }

            if (stats.totalEmployees > 0) {
                departmentStats.push(stats);
            }
        }

        // Generate the report
        await generateCompletionStatusReport(cycle, departmentStats);

    } catch (error) {
        console.error('Error generating completion report:', error);
        showToast('Error generating report: ' + error.message, 'error');
    }

    showLoading(false);
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

window.generateIndividualGapReport = generateIndividualGapReport;
window.generateDepartmentSummaryReport = generateDepartmentSummaryReport;
window.generateCompletionStatusReport = generateCompletionStatusReport;
window.triggerIndividualReport = triggerIndividualReport;
window.triggerDepartmentReport = triggerDepartmentReport;
window.triggerCompletionReport = triggerCompletionReport;

console.log('📄 Reports module loaded');
