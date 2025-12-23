// ============================================================================
// CIC Competency Framework System - Database Operations & Seeding
// ============================================================================

// ============================================================================
// CRISPIEE CORE VALUES
// Customer Centricity, Results-Driven, Integrity, Solution-Oriented,
// Precision, Innovation, Excellence, and Equitable
// ============================================================================

// ============================================================================
// CORE COMPETENCIES (Applied to ALL CIC Employees)
// Aligned with CRISPIEE Values and Philippine Public Sector Standards
// ============================================================================

const CIC_CORE_COMPETENCIES = [
    {
        id: 'C1',
        name: 'Integrity and Public Accountability',
        type: 'Core',
        crispieeAlignment: ['Integrity', 'Equitable'],
        description: 'Demonstrates unwavering commitment to ethical conduct, transparency, and honesty in all official actions and decisions. Upholds the public trust inherent in government service by ensuring that personal actions reflect the highest standards of probity. Takes responsibility for decisions and actions, and is accountable for results to the public, oversight bodies, and the organization.',
        regulatoryBasis: 'RA 6713 (Code of Conduct and Ethical Standards for Public Officials and Employees)',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Demonstrates basic understanding of ethical standards and follows established rules and procedures.',
                indicators: [
                    'Acts with honesty in basic transactions and avoids obvious conflicts of interest',
                    'Familiar with the Code of Conduct (RA 6713) and follows standard office policies',
                    'Admits to simple mistakes and corrects them when pointed out',
                    'Handles basic information with appropriate confidentiality as instructed'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Consistently applies ethical principles in diverse situations and takes full ownership of actions.',
                indicators: [
                    'Ensures transparency in all official dealings and proactively identifies potential biases',
                    'Consistently complies with RA 6713 and encourages colleagues to do the same',
                    'Takes full responsibility for decisions and outcomes, ensuring errors are promptly corrected',
                    'Proactively safeguards public resources and reports any observed minor irregularities'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Models high ethical standards in complex scenarios and guides others in ethical decision-making.',
                indicators: [
                    'Maintains integrity in high-pressure situations or when facing significant organizational challenges',
                    'Expertly interprets and applies complex regulatory requirements to ensure absolute compliance',
                    'Establishes mechanisms for accountability within their team or project group',
                    'Handles sensitive or high-risk information with impeccable judgment and discretion'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes the ethical culture of the organization and sets agency-wide standards for accountability.',
                indicators: [
                    'Institutionalizes frameworks for transparency and ethical conduct across the entire organization',
                    'Influences national or sector-level policies regarding public accountability and integrity',
                    'Creates an organizational environment where accountability is a core cultural value',
                    'Serves as the final arbiter and role model for complex ethical and integrity-related issues'
                ]
            }
        ]
    },
    {
        id: 'C2',
        name: 'Excellence in Service Delivery',
        type: 'Core',
        crispieeAlignment: ['Excellence', 'Customer Centricity'],
        description: 'Consistently delivers high-quality outputs and responsive service to all stakeholders, including Submitting Entities, Accessing Entities, data subjects, and internal clients. Applies a citizen-first mindset that prioritizes the needs of the public and ensures that CIC\'s mandate as the national credit registry is fulfilled with professionalism and dedication to public service excellence.',
        regulatoryBasis: 'EO 95 (Ease of Doing Business), CSC Citizen\'s Charter Requirements',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Provides polite and timely service to stakeholders following established protocols.',
                indicators: [
                    'Responds to inquiries courteously and refers complex requests to appropriate personnel',
                    'Meets basic service level standards for turnaround times in routine tasks',
                    'Produces work that meets minimum quality requirements as defined in the Citizen\'s Charter',
                    'Understands the importance of stakeholder feedback in service improvement'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Proactively anticipates stakeholder needs and ensures high-quality service outcomes.',
                indicators: [
                    'Resolves most stakeholder concerns independently and with high accuracy',
                    'Anticipates common stakeholder needs and prepares information or resources in advance',
                    'Consistently delivers work that exceeds basic quality standards and requires minimal revision',
                    'Actively collects stakeholder feedback and suggests practical improvements to service delivery'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Leads service improvement initiatives and mentors others in service excellence.',
                indicators: [
                    'Handles highly complex or sensitive stakeholder issues with exceptional professionalism',
                    'Designs and implements new service protocols that significantly enhance stakeholder experience',
                    'Sets and monitors quality standards for their unit to ensure consistent excellence',
                    'Mentors colleagues in applying a citizen-first mindset and building stakeholder trust'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Directs the organization\'s service strategy and defines agency-wide standards for excellence.',
                indicators: [
                    'Shapes the overall service delivery vision for CIC to align with national digital transformation goals',
                    'Establishes agency-wide service level agreements and monitors organizational performance',
                    'Institutionalizes a culture of continuous service innovation and stakeholder-centricity',
                    'Represented as a public sector leader in service delivery excellence at the national level'
                ]
            }
        ]
    },
    {
        id: 'C3',
        name: 'Results-Driven Focus',
        type: 'Core',
        crispieeAlignment: ['Results-Driven', 'Solution-Oriented'],
        description: 'Demonstrates a strong orientation toward achieving measurable outcomes and organizational goals. Sets clear objectives, monitors progress, and takes accountability for results. Prioritizes efficient use of resources and ensures that individual efforts contribute to CIC\'s strategic objectives and mandated deliverables as the central credit registry.',
        regulatoryBasis: 'CSC Strategic Performance Management System (SPMS)',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Focuses on completing assigned tasks and meeting basic performance targets.',
                indicators: [
                    'Accomplishes daily tasks within set timelines and following basic instructions',
                    'Aware of personal performance targets and reports progress when requested',
                    'Uses work materials and time responsibly to complete assignments',
                    'Takes ownership of their specific tasks and ensures they are finished as required'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Sets clear personal goals and optimizes resources to achieve measurable results.',
                indicators: [
                    'Sets specific and time-bound personal objectives aligned with unit goals',
                    'Systematically tracks own progress and proactively adjusts effort to meet targets',
                    'Identifies ways to use resources more efficiently and reduces waste/idle time',
                    'Consistently meets or exceeds all personal performance targets defined in the SPMS'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Drives unit-level performance and ensures alignment with strategic priorities.',
                indicators: [
                    'Formulates unit-level targets that directly support CIC\'s strategic mission',
                    'Developed monitoring systems to ensure team-wide achievement of key results',
                    'Optimizes resource allocation across different projects to maximize overall output',
                    'Leads others in overcoming obstacles to maintain momentum and achieve complex goals'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Directs organizational performance strategy and ensures sustained achievement of CIC\'s mandate.',
                indicators: [
                    'Orchestrates the agency\'s strategic performance management framework and mission alignment',
                    'Ensures long-term organizational sustainability through strategic result-setting',
                    'Influences national-level credit registry performance standards and benchmarks',
                    'Cultivates an organizational culture where results and accountability are paramount'
                ]
            }
        ]
    },
    {
        id: 'C4',
        name: 'Innovation and Strategic Agility',
        type: 'Core',
        crispieeAlignment: ['Innovation', 'Solution-Oriented'],
        description: 'Embraces change and continuously seeks opportunities to improve processes, systems, and services. Demonstrates adaptability in responding to evolving requirements, technologies, and stakeholder needs. Applies creative thinking to solve problems and contributes ideas that advance CIC\'s effectiveness as a modern, technology-driven public institution.',
        regulatoryBasis: 'CSC PRIME-HRM Innovation Criteria',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Shows openness to new ideas and adapts to changes in work processes.',
                indicators: [
                    'Accepts changes in policies or procedures without resistance and asks clarifying questions',
                    'Suggests simple improvements to their immediate work environment or routine',
                    'Participates in brainstorming sessions and shares observations about work challenges',
                    'Learns new tools or technologies required for their daily tasks as they are introduced'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Actively identifies improvement opportunities and adapts quickly to new requirements.',
                indicators: [
                    'Proactively identifies bottlenecks in current processes and proposes practical solutions',
                    'Quickly adjusts work methods to accommodate evolving stakeholder needs or technologies',
                    'Applies creative problem-solving techniques to resolve common operational issues',
                    'Keeps updated on basic trends in credit information and digital government'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Leads process innovations and manages organizational transitions effectively.',
                indicators: [
                    'Designs and implements significant process improvements that enhance unit efficiency',
                    'Guides colleagues through complex organizational changes or system migrations',
                    'Synthesizes diverse ideas into innovative solutions for multi-faceted problems',
                    'Actively scouts for new technologies or methodologies to advance CIC\'s service delivery'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Drives a culture of organizational innovation and shapes CIC\'s future-readiness.',
                indicators: [
                    'Champions agency-wide innovation programs and digital transformation strategies',
                    'Positions CIC as a leading innovator within the Philippine public sector',
                    'Navigates the organization through major strategic pivots or technological disruptions',
                    'Institutionalizes systems for continuous improvement and creative risk-taking'
                ]
            }
        ]
    },
    {
        id: 'C5',
        name: 'Precision and Attention to Detail',
        type: 'Core',
        crispieeAlignment: ['Precision', 'Excellence'],
        description: 'Demonstrates meticulous attention to accuracy, completeness, and consistency in all work outputs. Recognizes the critical importance of data integrity in CIC\'s role as custodian of 66+ million credit records. Applies thoroughness in reviewing work, following procedures, and ensuring compliance with regulatory requirements governing credit information.',
        regulatoryBasis: 'RA 9510 (CISA) Data Quality Requirements, ISO Standards',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Checks work for obvious errors and follows established templates and guidelines.',
                indicators: [
                    'Double-checks basic data entries and documents for typographical or numerical errors',
                    'Correctly follows provided templates, checklists, and standard operating procedures',
                    'Identifies and corrects own errors before submitting assignments for review',
                    'Stores records and documents in an organized manner according to unit mapping'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Ensures high levels of accuracy and identifies subtle inconsistencies in data or processes.',
                indicators: [
                    'Performs comprehensive reviews of complex reports to ensure absolute consistency',
                    'Identifies root causes of recurring errors and implements simple checks to prevent them',
                    'Ensures all work strictly adheres to regulatory standards and internal quality controls',
                    'Maintains meticulous audit trails and documentation for all official actions'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Establishes quality control standards and ensures organizational data integrity.',
                indicators: [
                    'Develops and implements rigorous quality assurance frameworks for their unit or project',
                    'Expertly detects and resolves complex data discrepancies across multiple systems',
                    'Ensures unit-wide compliance with ISO and RA 9510 quality and security standards',
                    'Mentors others in developing precision-oriented work habits and attention to detail'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Oversees agency-wide data governance and institutionalizes a culture of precision.',
                indicators: [
                    'Sets the vision and standards for organizational data quality and regulatory compliance',
                    'Represented as an expert in credit data integrity and data governance at the national level',
                    'Institutionalizes robust organizational systems for error prevention and continuous audit',
                    'Ensures CIC\'s data integrity remains world-class and trusted by all financial institutions'
                ]
            }
        ]
    }
];

// ============================================================================
// COMPETENCY DATA (CSC MC No. 05, s. 2016)
// LEADERSHIP COMPETENCIES - Enhanced with Public Sector Language
// ============================================================================

const CSC_LEADERSHIP_COMPETENCIES = [
    {
        id: 'L1',
        name: 'Building Collaborative and Inclusive Working Relationships',
        type: 'Leadership',
        cscReference: 'CSC MC No. 05, s. 2016',
        description: 'Establishes and maintains productive partnerships and working relationships across organizational boundaries, both within CIC and with external stakeholders including Submitting Entities, Accessing Entities, regulatory bodies, and other government agencies. Builds trust, promotes teamwork, and creates an inclusive environment that values diverse perspectives. Champions collaboration as essential to CIC\'s mandate of maintaining a comprehensive and reliable national credit information system.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Participates constructively in team activities, follows established communication protocols, and demonstrates respect for colleagues and stakeholders.',
                indicators: [
                    'Participates actively and constructively in team activities, meetings, and collaborative initiatives when required',
                    'Follows established protocols for internal and external communication, ensuring messages are clear, respectful, and professional',
                    'Acknowledges and respects the contributions, ideas, and expertise of colleagues, stakeholders, and team members',
                    'Seeks assistance from colleagues or supervisors when facing challenges, and willingly provides help to others when asked'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Proactively builds and maintains relationships within and across units, facilitates information sharing, and promotes inclusive practices in day-to-day work.',
                indicators: [
                    'Actively builds and nurtures professional relationships with colleagues within the unit and across organizational groups',
                    'Facilitates the sharing of information, resources, and expertise among team members to enhance collective effectiveness',
                    'Addresses minor interpersonal conflicts constructively, facilitating resolution while maintaining professional relationships',
                    'Promotes and models inclusive practices in daily work, ensuring all team members feel valued and have opportunity to contribute'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Develops strategic partnerships with external stakeholders, mentors others in relationship-building, and leads initiatives that promote collaboration and diversity.',
                indicators: [
                    'Creates and maintains strategic partnerships with Submitting Entities, Accessing Entities, regulatory bodies, and other external stakeholders critical to CIC\'s mandate',
                    'Mentors and coaches others in developing relationship-building and stakeholder engagement skills',
                    'Mediates and resolves complex interpersonal or inter-unit issues, finding solutions that preserve relationships and advance organizational interests',
                    'Champions and leads diversity and inclusion initiatives, creating an environment where different perspectives are actively sought and valued'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organizational culture of collaboration, establishes agency-wide partnership frameworks, and influences policy on stakeholder engagement at the sector level.',
                indicators: [
                    'Shapes and sustains an organizational culture where collaboration, partnership, and teamwork are foundational to how CIC operates',
                    'Establishes and institutionalizes agency-wide frameworks for stakeholder engagement, partnership development, and inter-agency coordination',
                    'Recognized internally and externally as a model for inclusive leadership and collaborative approaches to achieving public sector objectives',
                    'Influences policy and best practices on stakeholder engagement and collaborative governance at the sector or national level'
                ]
            }
        ]
    },
    {
        id: 'L2',
        name: 'Managing Performance and Coaching for Results',
        type: 'Leadership',
        cscReference: 'CSC MC No. 05, s. 2016',
        description: 'Sets clear performance expectations aligned with organizational objectives, monitors progress, provides timely and constructive feedback, and develops team members to achieve their full potential. Creates an environment of accountability where excellent performance is recognized and performance issues are addressed fairly and promptly. Applies coaching and mentoring approaches that build capability and support succession planning within CIC.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Understands performance standards, accepts feedback constructively, completes assigned tasks within deadlines, and participates in learning opportunities.',
                indicators: [
                    'Demonstrates clear understanding of own performance standards, targets, and expectations as defined in the Individual Performance Commitment and Review (IPCR)',
                    'Accepts feedback on performance constructively, reflects on areas for improvement, and takes action to address identified gaps',
                    'Completes assigned tasks and deliverables within established deadlines and quality standards',
                    'Actively participates in learning and development opportunities to enhance knowledge and skills relevant to current role'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Sets clear objectives for team members, provides regular performance feedback, identifies training needs, and conducts effective performance discussions.',
                indicators: [
                    'Establishes clear, specific, and measurable performance objectives for team members aligned with unit and organizational priorities',
                    'Provides regular, timely, and balanced feedback on performance, recognizing achievements and addressing areas needing improvement',
                    'Identifies training and development needs of staff and recommends appropriate interventions to build capability',
                    'Conducts performance planning, monitoring, and evaluation discussions effectively, ensuring mutual understanding of expectations and results'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Develops comprehensive performance management approaches, coaches high-potential employees, creates individualized development plans, and addresses performance issues promptly.',
                indicators: [
                    'Designs and implements comprehensive performance management systems and processes that drive unit and organizational results',
                    'Coaches high-potential employees for career advancement and leadership roles, applying deliberate development strategies',
                    'Creates individualized development plans that address capability gaps and prepare employees for current and future responsibilities',
                    'Addresses performance issues promptly, fairly, and constructively, applying progressive approaches while maintaining dignity and respect'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organization-wide performance culture, mentors other managers, designs succession planning programs, and is recognized for developing future leaders.',
                indicators: [
                    'Shapes and institutionalizes an organization-wide culture of performance excellence, accountability, and continuous improvement',
                    'Mentors and develops other managers and supervisors in coaching techniques, performance management, and talent development',
                    'Designs and leads succession planning and leadership pipeline programs that ensure organizational continuity and capability',
                    'Recognized within CIC and across the public sector for excellence in developing future leaders and building organizational capability'
                ]
            }
        ]
    },
    {
        id: 'L3',
        name: 'Leading Change',
        type: 'Leadership',
        cscReference: 'CSC MC No. 05, s. 2016',
        description: 'Champions and implements organizational change initiatives effectively, maintaining momentum during transitions while helping others adapt. Communicates the rationale for change, builds coalitions of support, addresses resistance constructively, and ensures that change efforts are sustainable. Recognizes that CIC operates in a dynamic environment requiring continuous adaptation to evolving regulations, technologies, and stakeholder needs.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Accepts and adapts to organizational changes, follows new procedures, maintains productivity during transitions, and seeks to understand the rationale for change.',
                indicators: [
                    'Accepts organizational changes positively and adapts work practices to align with new processes, systems, or priorities',
                    'Learns and follows new procedures, guidelines, and processes as they are introduced, seeking clarification when needed',
                    'Maintains personal productivity and quality of work during periods of organizational transition or uncertainty',
                    'Asks questions to understand the purpose and benefits of changes, demonstrating genuine interest in the rationale behind initiatives'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Communicates change initiatives to the team, supports team members during transitions, identifies and addresses concerns, and implements change plans within the unit.',
                indicators: [
                    'Communicates change initiatives clearly to team members, explaining the what, why, and how of organizational changes',
                    'Provides practical and emotional support to team members during transitions, acknowledging challenges while maintaining focus on objectives',
                    'Identifies sources of resistance or concern, addresses them constructively, and helps team members overcome obstacles to change adoption',
                    'Implements change plans within the unit effectively, monitoring progress and making adjustments as needed to achieve intended outcomes'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Designs and leads change management programs, builds coalitions of support, anticipates and mitigates risks, and creates sustainable change frameworks.',
                indicators: [
                    'Designs and leads comprehensive change management programs that address technical, process, and people dimensions of organizational change',
                    'Builds coalitions of support across units and stakeholder groups, leveraging influence to advance major change initiatives',
                    'Anticipates potential risks and sources of resistance, develops mitigation strategies, and adapts approaches based on feedback',
                    'Creates sustainable change frameworks that institutionalize improvements and ensure changes are embedded in organizational practice'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Drives transformational change across the organization, shapes change strategy, influences sector-wide initiatives, and is recognized as a change leadership authority.',
                indicators: [
                    'Drives transformational change across CIC, leading initiatives that fundamentally enhance organizational capability, culture, or impact',
                    'Shapes organizational change strategy in alignment with CIC\'s mandate, strategic direction, and evolving regulatory environment',
                    'Influences sector-wide change initiatives related to credit information systems, data governance, or public sector digital transformation',
                    'Recognized within the public sector as an authority on change leadership, sought for guidance on managing complex organizational transitions'
                ]
            }
        ]
    },
    {
        id: 'L4',
        name: 'Thinking Strategically and Creatively',
        type: 'Leadership',
        cscReference: 'CSC MC No. 05, s. 2016',
        description: 'Develops innovative solutions aligned with CIC\'s vision, mission, and strategic objectives. Anticipates future trends affecting credit information systems, financial inclusion, and data governance, and positions CIC for continued relevance and impact. Balances short-term operational needs with long-term strategic imperatives. Applies systems thinking to understand interconnections and implications of decisions.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Understands organizational mission and vision, contributes ideas for improvement, considers options before deciding, and aligns daily work with objectives.',
                indicators: [
                    'Demonstrates understanding of CIC\'s mission, vision, mandate under RA 9510, and how own role contributes to organizational objectives',
                    'Contributes ideas for process improvements, efficiency gains, or service enhancements within own area of responsibility',
                    'Considers multiple options, weighs pros and cons, and makes thoughtful decisions rather than defaulting to routine approaches',
                    'Aligns daily work activities and priorities with unit objectives and CIC\'s strategic direction'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Develops unit-level plans aligned with strategy, proposes innovative solutions, analyzes trends, and balances short-term and long-term considerations.',
                indicators: [
                    'Develops unit-level work plans, projects, and initiatives that are clearly aligned with CIC\'s strategic priorities and objectives',
                    'Proposes innovative solutions to operational challenges, thinking beyond conventional approaches to achieve better outcomes',
                    'Analyzes trends and developments affecting credit information systems, data privacy, or stakeholder needs, and applies insights to unit planning',
                    'Balances short-term operational requirements with longer-term strategic considerations when making decisions and recommendations'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Contributes to organizational strategic planning, leads innovation initiatives, identifies emerging opportunities and threats, and creates breakthrough solutions.',
                indicators: [
                    'Contributes meaningfully to organizational strategic planning processes, providing input on direction, priorities, and resource allocation',
                    'Leads innovation initiatives that introduce new approaches, technologies, or service models advancing CIC\'s mandate and effectiveness',
                    'Identifies emerging opportunities and threats in the credit information ecosystem, regulatory environment, or technology landscape',
                    'Creates breakthrough solutions to complex, multi-dimensional problems that require systems thinking and cross-functional perspectives'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organizational vision and strategic direction, drives sector-wide initiatives, anticipates long-term trends, and is recognized as a strategic thought leader.',
                indicators: [
                    'Shapes CIC\'s vision and strategic direction, ensuring alignment with national development priorities, regulatory requirements, and stakeholder needs',
                    'Drives strategic initiatives that advance the credit information sector, financial inclusion, or public sector data governance nationally',
                    'Anticipates long-term trends in financial technology, data systems, and regulation, positioning CIC to adapt and lead in a changing environment',
                    'Recognized as a strategic thought leader in credit information, data governance, or public sector transformation, influencing national discourse'
                ]
            }
        ]
    },
    {
        id: 'L5',
        name: 'Creating and Nurturing a High Performing Organization',
        type: 'Leadership',
        cscReference: 'CSC MC No. 05, s. 2016',
        description: 'Builds and sustains teams that consistently achieve exceptional results. Creates an environment that motivates excellence, fosters continuous improvement, and attracts and retains talented individuals. Establishes systems and practices that enable high performance while maintaining employee well-being and engagement. Ensures that CIC is recognized as an employer of choice in the public sector.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Contributes consistently to team goals, supports colleagues, maintains high personal standards, and participates in improvement activities.',
                indicators: [
                    'Contributes consistently and reliably to team goals, completing own responsibilities to enable collective success',
                    'Supports colleagues in achieving their objectives, offering assistance, sharing knowledge, and working collaboratively',
                    'Maintains high personal standards of work quality and professionalism, serving as a positive example to peers',
                    'Participates actively in team improvement activities, quality initiatives, and efforts to enhance unit performance'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Sets challenging but achievable team goals, recognizes achievements, removes obstacles, and builds team cohesion and morale.',
                indicators: [
                    'Establishes challenging but achievable team goals that stretch capabilities while remaining realistic and motivating',
                    'Recognizes and celebrates team and individual achievements, creating a culture where excellent performance is valued and visible',
                    'Identifies and removes obstacles, inefficiencies, or resource constraints that impede team performance',
                    'Builds team cohesion, morale, and engagement through inclusive leadership, clear communication, and genuine care for team members'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Creates high-performance team culture, develops continuous improvement systems, benchmarks against best practices, and attracts and retains talent.',
                indicators: [
                    'Creates and sustains a high-performance team culture characterized by accountability, collaboration, innovation, and results orientation',
                    'Develops and implements systems for continuous improvement, including regular performance review, lessons learned, and quality enhancement',
                    'Benchmarks unit performance against internal and external best practices, identifying opportunities for improvement',
                    'Attracts, develops, and retains talented individuals, building a team known for exceptional capability and commitment'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organization-wide excellence culture, designs enterprise performance systems, achieves recognition for outstanding results, and models high-performance leadership.',
                indicators: [
                    'Shapes and institutionalizes an organization-wide culture of excellence where high performance is expected, recognized, and rewarded',
                    'Designs and implements enterprise-wide performance systems, standards, and practices that enable consistent organizational excellence',
                    'Leads an organization recognized for outstanding results by oversight bodies (CSC, DBM, COA), stakeholders, and peer institutions',
                    'Models and advocates high-performance leadership externally, contributing to public sector improvement beyond CIC'
                ]
            }
        ]
    }
];

const CIC_FUNCTIONAL_COMPETENCIES = [
    {
        id: 'F1',
        name: 'Data Privacy and Protection',
        type: 'Functional',
        regulatoryFramework: [
            'Republic Act No. 10173 (Data Privacy Act of 2012)',
            'NPC Circular 16-01 (Security of Personal Data)',
            'NPC Circular 16-03 (Breach Notification)',
            'CIC Data Privacy Manual'
        ],
        description: 'Ensures compliance with the Data Privacy Act of 2012 (RA 10173), National Privacy Commission (NPC) issuances, and related regulations in the collection, processing, storage, and dissemination of credit information. Implements appropriate organizational, physical, and technical security measures to protect personal and sensitive personal information. Upholds the fundamental right of data subjects to privacy while enabling CIC to fulfill its mandate as custodian of 66+ million credit records.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Understands basic data privacy principles, follows data handling procedures, identifies personal information, and reports potential breaches.',
                indicators: [
                    'Demonstrates understanding of fundamental data privacy principles including transparency, legitimate purpose, and proportionality as defined under RA 10173',
                    'Follows established data handling procedures for collection, processing, storage, and transmission of credit information and personal data',
                    'Correctly identifies and classifies personal information, sensitive personal information, and privileged information in the course of work',
                    'Recognizes and immediately reports potential privacy incidents, security breaches, or unauthorized access through appropriate channels'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Implements data protection protocols, conducts privacy impact assessments, trains staff on requirements, and manages data subject requests.',
                indicators: [
                    'Implements technical, organizational, and physical data protection measures appropriate to the nature and sensitivity of information processed',
                    'Conducts or contributes to Privacy Impact Assessments (PIAs) for new systems, processes, or initiatives involving personal data',
                    'Trains and guides colleagues on data privacy requirements, ensuring team members understand their obligations under RA 10173',
                    'Processes data subject access requests, correction requests, and erasure requests in accordance with NPC guidelines and CIC procedures'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Designs privacy-by-design systems, leads compliance initiatives, manages complex breach incidents, and advises on regulatory interpretations.',
                indicators: [
                    'Designs systems, processes, and solutions applying privacy-by-design and privacy-by-default principles from inception',
                    'Leads organization-wide data privacy compliance initiatives, ensuring CIC meets all NPC registration, reporting, and compliance requirements',
                    'Manages complex data breach incidents, coordinating investigation, containment, notification, and remediation in accordance with NPC protocols',
                    'Provides authoritative guidance on interpretation of data privacy regulations and their application to CIC operations and initiatives'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organizational privacy strategy, influences sector standards, recognized as expert externally, and drives privacy innovation.',
                indicators: [
                    'Shapes CIC\'s organizational data privacy strategy, ensuring privacy governance is embedded in organizational culture and operations',
                    'Contributes to the development of sector-wide privacy standards, participating in NPC consultations and inter-agency privacy initiatives',
                    'Recognized externally as a privacy expert, invited to speak, advise, or contribute to national data privacy discourse and policy development',
                    'Drives innovation in privacy-enhancing technologies and practices, positioning CIC as a leader in responsible data stewardship'
                ]
            }
        ]
    },
    {
        id: 'F2',
        name: 'Credit Information Management',
        type: 'Functional',
        regulatoryFramework: [
            'Republic Act No. 9510 (Credit Information System Act)',
            'Implementing Rules and Regulations of RA 9510',
            'Executive Order No. 95 (Ease of Doing Business)',
            'CIC Circular Letters and Guidelines'
        ],
        description: 'Manages the complete lifecycle of credit information—from collection and validation through consolidation, storage, and dissemination—in accordance with Republic Act No. 9510 (Credit Information System Act) and implementing rules. Ensures the accuracy, completeness, timeliness, and integrity of data received from Submitting Entities and provided to Accessing Entities. Applies expertise in credit bureau operations, data quality management, and regulatory compliance to support CIC\'s mandate as the Philippines\' central credit registry serving 66+ million data subjects.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Understands credit information lifecycle, performs data entry and validation, follows data quality procedures, and uses credit information systems correctly.',
                indicators: [
                    'Demonstrates understanding of the credit information lifecycle from collection through dissemination as defined under RA 9510',
                    'Performs data entry, encoding, and initial validation tasks accurately and efficiently using established systems and tools',
                    'Follows data quality control procedures, including validation checks, error identification, and escalation of data issues',
                    'Operates credit information systems, databases, and applications correctly and in accordance with established protocols'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Manages credit data quality processes, coordinates with Submitting Entities, resolves data discrepancies, and produces standard credit reports.',
                indicators: [
                    'Manages day-to-day credit data quality processes including validation, cleansing, matching, and consolidation of records',
                    'Coordinates with Submitting Entities on data submission requirements, file formats, schedules, and resolution of submission issues',
                    'Investigates and resolves data discrepancies, disputes, and integrity issues, ensuring timely and accurate correction of records',
                    'Produces standard credit reports, data extracts, and analytical outputs meeting stakeholder requirements and regulatory standards'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Designs credit data management systems, develops data quality frameworks, leads Submitting Entity compliance programs, and creates advanced analytics.',
                indicators: [
                    'Designs credit data management systems, architectures, and processes that ensure scalability, integrity, and compliance at CIC\'s operational scale',
                    'Develops and implements comprehensive data quality frameworks including standards, metrics, monitoring, and remediation processes',
                    'Leads Submitting Entity compliance and onboarding programs, ensuring entities meet data submission requirements under RA 9510',
                    'Creates advanced credit analytics, reports, and insights that inform policy, strategy, and stakeholder understanding of credit trends'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes national credit information strategy, drives industry standards, innovates methodologies, and recognized as national expert.',
                indicators: [
                    'Shapes national credit information strategy, advising on policy and regulatory development affecting the credit information ecosystem',
                    'Drives the development of credit bureau industry standards in the Philippines, contributing to regional and international best practice adoption',
                    'Innovates credit data methodologies, scoring approaches, or analytical techniques that advance the utility and impact of credit information',
                    'Recognized nationally and regionally as an expert in credit information management, credit bureau operations, or credit data governance'
                ]
            }
        ]
    },
    {
        id: 'F3',
        name: 'Financial Analysis and Assessment',
        type: 'Functional',
        regulatoryFramework: [
            'Department of Budget and Management Guidelines',
            'Commission on Audit Rules and Regulations',
            'Bangko Sentral ng Pilipinas Prudential Standards (for SE assessment)',
            'RA 9510 Submitting Entity Requirements'
        ],
        description: 'Applies financial analysis skills to assess and verify Submitting Entities, evaluate organizational financial health, support budget planning, and ensure responsible stewardship of public resources. Evaluates financial compliance, operational capacity, and risk profiles of regulated institutions. Supports evidence-based decision-making through rigorous financial assessment aligned with DBM, COA, and BSP standards applicable to a GOCC with regulatory functions.',
        proficiencyLevels: [
            {
                level: 1,
                name: 'Basic',
                description: 'Understands financial statements, calculates standard ratios, prepares routine reports, and follows financial analysis procedures.',
                indicators: [
                    'Demonstrates understanding of basic financial statements (balance sheet, income statement, cash flow) and their components',
                    'Calculates and interprets standard financial ratios including liquidity, profitability, solvency, and efficiency measures',
                    'Prepares routine financial reports, schedules, and supporting documents accurately and within prescribed timelines',
                    'Follows established financial analysis procedures, methodologies, and templates in completing assigned analytical tasks'
                ]
            },
            {
                level: 2,
                name: 'Intermediate',
                description: 'Conducts comprehensive financial assessments, identifies risks and red flags, prepares evaluation reports, and makes informed recommendations.',
                indicators: [
                    'Conducts comprehensive financial assessments of Submitting Entities or organizational units, applying appropriate analytical frameworks',
                    'Identifies financial risks, red flags, anomalies, or compliance concerns and escalates appropriately with supporting analysis',
                    'Prepares well-structured evaluation reports that present findings, analysis, and recommendations clearly for decision-makers',
                    'Formulates informed recommendations on entity compliance, resource allocation, or financial decisions supported by evidence'
                ]
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Develops financial assessment frameworks, leads complex evaluations, mentors analysts, and creates sector-specific analysis tools.',
                indicators: [
                    'Develops and enhances financial assessment frameworks, criteria, and methodologies for evaluating Submitting Entities or internal units',
                    'Leads complex evaluations involving multiple entities, significant amounts, or high-risk profiles, ensuring thoroughness and objectivity',
                    'Mentors junior analysts on financial analysis methodologies, techniques, and professional standards',
                    'Creates sector-specific analysis tools, templates, or models that improve efficiency and consistency of financial assessments'
                ]
            },
            {
                level: 4,
                name: 'Superior',
                description: 'Shapes organizational assessment standards, influences regulatory requirements, recognized as authority, and drives financial oversight innovation.',
                indicators: [
                    'Shapes CIC\'s organizational standards for financial assessment, ensuring alignment with DBM, COA, and industry best practices',
                    'Contributes to the development of regulatory financial requirements for Submitting Entities, participating in policy consultations',
                    'Recognized within CIC and externally as an authority on financial analysis, entity assessment, or GOCC financial governance',
                    'Drives innovation in financial oversight practices, introducing approaches that enhance CIC\'s effectiveness as a regulatory institution'
                ]
            }
        ]
    }
];

const CIC_POSITIONS = [
    // ===== OFFICE OF THE PRESIDENT =====
    {
        id: 'president',
        title: 'President',
        department: 'Office of the President',
        requiredLevel: 4,
        requiredLevelName: 'Superior',
        description: 'Chief Executive Officer of the Credit Information Corporation',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'executive-assistant-v',
        title: 'Executive Assistant V',
        department: 'Office of the President',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Provides executive support to the President',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'board-secretary-v',
        title: 'Board Secretary V',
        department: 'Office of the President',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Handles corporate secretarial functions for the Board',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // ===== INTERNAL AUDIT OFFICE =====
    {
        id: 'internal-auditor-v',
        title: 'Internal Auditor V',
        department: 'Internal Audit Office',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Internal Audit Office',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'internal-auditor-iv-financial',
        title: 'Internal Auditor IV (Financial & Management)',
        department: 'Internal Audit Office',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Conducts financial and management audits',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'internal-auditor-iv-operation',
        title: 'Internal Auditor IV (Operation)',
        department: 'Internal Audit Office',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Conducts operational audits',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // ===== LEGAL UNIT =====
    {
        id: 'attorney-v',
        title: 'Attorney V',
        department: 'Legal Unit',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Legal Unit',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'legal-assistant-iii-1',
        title: 'Legal Assistant III',
        department: 'Legal Unit',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Provides legal assistance and documentation support',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // ===== CREDIT INFORMATION MANAGEMENT SERVICES GROUP (CIMSG) =====
    {
        id: 'svp-cimsg',
        title: 'Senior Vice President (CIMSG)',
        department: 'Credit Information Management Services Group',
        requiredLevel: 4,
        requiredLevelName: 'Superior',
        description: 'Head of Credit Information Management Services Group',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // Information Security Unit
    {
        id: 'it-officer-iii-security',
        title: 'Information Technology Officer III (Security)',
        department: 'Information Security Unit',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Information Security Officer',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'data-management-chief',
        title: 'Data Management Chief',
        department: 'Information Security Unit',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Chief Data Officer responsible for data governance',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // Application Development Department
    {
        id: 'dept-manager-iii-appdev',
        title: 'Department Manager III (Application Development)',
        department: 'Application Development Department',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Application Development Department',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'it-officer-iii-senior-ba',
        title: 'Information Technology Officer III (Senior Business Analyst)',
        department: 'Application Development Department',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Senior Business Analyst for application requirements',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'it-officer-ii-junior-ba',
        title: 'Information Technology Officer II (Junior Business Analyst)',
        department: 'Application Development Department',
        requiredLevel: 1,
        requiredLevelName: 'Basic',
        description: 'Junior Business Analyst',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // Technical Support Department
    {
        id: 'dept-manager-iii-techsupport',
        title: 'Department Manager III (Technical Support)',
        department: 'Technical Support Department',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Technical Support Department',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'it-officer-iii-dba',
        title: 'Information Technology Officer III (Database Administrator)',
        department: 'Technical Support Department',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Database Administrator',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // Data Center
    {
        id: 'dept-manager-iii-datacenter',
        title: 'Department Manager III (Data Center Head)',
        department: 'Data Center',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Data Center operations',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'computer-operator-iv',
        title: 'Computer Operator IV',
        department: 'Data Center',
        requiredLevel: 1,
        requiredLevelName: 'Basic',
        description: 'Data Center operations support',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // ===== FINANCE AND ADMINISTRATION GROUP (FAG) =====
    {
        id: 'svp-fag',
        title: 'Senior Vice President (FAG)',
        department: 'Finance and Administration Group',
        requiredLevel: 4,
        requiredLevelName: 'Superior',
        description: 'Head of Finance and Administration Group',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'chief-accountant',
        title: 'Chief Accountant',
        department: 'Finance and Administration Group',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Accounting Division',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'budget-officer-iv',
        title: 'Budget Officer IV',
        department: 'Finance and Administration Group',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Budget planning and monitoring',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'financial-analyst-iv',
        title: 'Financial Analyst IV',
        department: 'Finance and Administration Group',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Financial analysis and reporting',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'hr-officer-iv',
        title: 'HR Officer IV (HR Head)',
        department: 'Finance and Administration Group',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Human Resources',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'admin-services-officer-v',
        title: 'Administrative Services Officer V',
        department: 'Finance and Administration Group',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Administrative and general services',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'admin-aide-vi',
        title: 'Administrative Aide VI (Messenger/Utility)',
        department: 'Finance and Administration Group',
        requiredLevel: 1,
        requiredLevelName: 'Basic',
        description: 'Messenger and utility services',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'chauffeur-iv',
        title: 'Chauffeur IV',
        department: 'Finance and Administration Group',
        requiredLevel: 1,
        requiredLevelName: 'Basic',
        description: 'Official vehicle driver',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'driver-courier-ii',
        title: 'Driver Courier II',
        department: 'Finance and Administration Group',
        requiredLevel: 1,
        requiredLevelName: 'Basic',
        description: 'Driver and courier services',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },

    // ===== BUSINESS DEVELOPMENT AND COMMUNICATION GROUP (BDCG) =====
    {
        id: 'svp-bdcg',
        title: 'Senior Vice President (BDCG)',
        department: 'Business Development and Communication Group',
        requiredLevel: 4,
        requiredLevelName: 'Superior',
        description: 'Head of Business Development and Communication Group',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'info-officer-v',
        title: 'Information Officer V (Public Relations Head)',
        department: 'Business Development and Communication Group',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Head of Public Relations',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'chief-marketing-specialist',
        title: 'Chief Marketing Specialist (Sales Manager)',
        department: 'Business Development and Communication Group',
        requiredLevel: 3,
        requiredLevelName: 'Advanced',
        description: 'Sales Manager for submitting entities',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'marketing-specialist-sales',
        title: 'Marketing Specialist (Sales Associate)',
        department: 'Business Development and Communication Group',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Sales associate for business development',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    },
    {
        id: 'marketing-specialist-web',
        title: 'Marketing Specialist (Website Administrator)',
        department: 'Business Development and Communication Group',
        requiredLevel: 2,
        requiredLevelName: 'Intermediate',
        description: 'Website and digital marketing administrator',
        competencyIds: ['C1', 'C2', 'C3', 'C4', 'C5', 'L1', 'L2', 'L3', 'L4', 'L5', 'F1', 'F2', 'F3']
    }
];

const CIC_DEPARTMENTS = [
    // Office of the President
    {
        id: 'office-of-the-president',
        name: 'Office of the President',
        minPeerRaters: 2,
        maxPeerRaters: 3
    },
    // Internal Audit Office
    {
        id: 'internal-audit-office',
        name: 'Internal Audit Office',
        minPeerRaters: 2,
        maxPeerRaters: 3
    },
    // Legal Unit
    {
        id: 'legal-unit',
        name: 'Legal Unit',
        minPeerRaters: 2,
        maxPeerRaters: 3
    },
    // Credit Information Management Services Group (CIMSG)
    {
        id: 'cimsg',
        name: 'Credit Information Management Services Group',
        minPeerRaters: 2,
        maxPeerRaters: 4
    },
    {
        id: 'information-security-unit',
        name: 'Information Security Unit',
        minPeerRaters: 2,
        maxPeerRaters: 3
    },
    {
        id: 'application-development-department',
        name: 'Application Development Department',
        minPeerRaters: 2,
        maxPeerRaters: 4
    },
    {
        id: 'technical-support-department',
        name: 'Technical Support Department',
        minPeerRaters: 2,
        maxPeerRaters: 4
    },
    {
        id: 'data-center',
        name: 'Data Center',
        minPeerRaters: 2,
        maxPeerRaters: 3
    },
    // Finance and Administration Group (FAG)
    {
        id: 'fag',
        name: 'Finance and Administration Group',
        minPeerRaters: 2,
        maxPeerRaters: 5
    },
    // Business Development and Communication Group (BDCG)
    {
        id: 'bdcg',
        name: 'Business Development and Communication Group',
        minPeerRaters: 2,
        maxPeerRaters: 4
    }
];

// ============================================================================
// ORGANIZATIONAL UNIT COMPETENCY MAPPING
// Maps Functional Competencies to CIC Organizational Groups
// ============================================================================

const CIC_ORG_UNIT_MAPPING = [
    {
        id: 'cims',
        groupName: 'Credit Information Management Services (CIMS)',
        groupCode: 'CIMS',
        description: 'Core function involves credit data management with mandatory privacy compliance. Responsible for the collection, consolidation, validation, and dissemination of credit information.',
        primaryCompetencies: ['F1', 'F2'],
        secondaryCompetencies: ['F3'],
        rationale: {
            F1: 'Handles 66M+ personal records; privacy compliance is mission-critical',
            F2: 'Core function of the group; all roles involve credit data lifecycle',
            F3: 'Supporting role for SE assessment and data interpretation'
        },
        organizationalUnits: [
            'Information Security Unit',
            'Application Development Department',
            'Technical Support Department',
            'Data Center'
        ]
    },
    {
        id: 'bdc',
        groupName: 'Business Development and Communications (BDC)',
        groupCode: 'BDC',
        description: 'Responsible for expanding CIC\'s stakeholder base, managing relationships with Submitting and Accessing Entities, public relations, and communications. Drives revenue growth and stakeholder engagement.',
        primaryCompetencies: ['F2'],
        secondaryCompetencies: ['F1', 'F3'],
        rationale: {
            F1: 'Must understand privacy when discussing data products with stakeholders',
            F2: 'Must articulate credit information value proposition to stakeholders',
            F3: 'Useful for understanding SE profiles and market dynamics'
        },
        organizationalUnits: [
            'Public Relations',
            'Sales and Marketing',
            'Stakeholder Relations'
        ]
    },
    {
        id: 'legal',
        groupName: 'Legal and Regulatory Unit',
        groupCode: 'LEGAL',
        description: 'Provides legal counsel, ensures regulatory compliance, handles contracts and MOAs, supports enforcement actions, and represents CIC in legal proceedings. Critical for interpreting RA 9510, RA 10173, and other applicable laws.',
        primaryCompetencies: ['F1', 'F2'],
        secondaryCompetencies: ['F3'],
        rationale: {
            F1: 'Primary advisor on DPA compliance; handles NPC matters',
            F2: 'Must understand CISA thoroughly for legal interpretation and enforcement',
            F3: 'Supporting role for contract review and penalty assessment'
        },
        organizationalUnits: [
            'Legal Unit'
        ]
    },
    {
        id: 'fag',
        groupName: 'Finance and Administration Group (FAG)',
        groupCode: 'FAG',
        description: 'Manages CIC\'s financial resources, human resources, general services, procurement, and administrative functions. Ensures sound financial management and operational support for all CIC activities.',
        primaryCompetencies: ['F3'],
        secondaryCompetencies: ['F1'],
        rationale: {
            F1: 'HR handles employee personal data; must ensure privacy compliance',
            F3: 'Core function involves financial management, budgeting, and analysis'
        },
        organizationalUnits: [
            'Accounting',
            'Budget',
            'Human Resources',
            'General Services',
            'Procurement'
        ]
    },
    {
        id: 'iao',
        groupName: 'Internal Audit Office',
        groupCode: 'IAO',
        description: 'Provides independent assessment of CIC\'s operations, internal controls, compliance, and risk management. Auditors must have working knowledge across all functional areas to conduct comprehensive audits.',
        primaryCompetencies: ['F1', 'F2', 'F3'],
        secondaryCompetencies: [],
        rationale: {
            F1: 'Must audit privacy compliance and information security controls',
            F2: 'Must audit core operations and data quality controls',
            F3: 'Must audit financial controls, transactions, and reporting'
        },
        organizationalUnits: [
            'Internal Audit Office'
        ]
    },
    {
        id: 'op',
        groupName: 'Office of the President',
        groupCode: 'OP',
        description: 'Executive leadership and strategic oversight of CIC operations. Provides direction and governance for the organization.',
        primaryCompetencies: ['F1', 'F2', 'F3'],
        secondaryCompetencies: [],
        rationale: {
            F1: 'Executive oversight of privacy governance',
            F2: 'Executive oversight of core credit information mandate',
            F3: 'Executive oversight of financial stewardship'
        },
        organizationalUnits: [
            'Office of the President'
        ]
    }
];

// ============================================================================
// DATABASE SEEDING FUNCTIONS
// ============================================================================

/**
 * Seeds the database with initial competency data if empty
 * Call this function on first load to populate the database
 */
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Seed/Update Core Competencies
        console.log('🌟 Syncing Core Competencies (C1-C5)...');
        for (const competency of CIC_CORE_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Seed/Update Leadership Competencies
        console.log('📝 Syncing Leadership Competencies (L1-L5)...');
        for (const competency of CSC_LEADERSHIP_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Seed/Update Functional Competencies
        console.log('📝 Syncing Functional Competencies (F1-F3)...');
        for (const competency of CIC_FUNCTIONAL_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Only seed positions and departments if they don't exist
        const positionsSnapshot = await db.collection('positions').limit(1).get();
        if (positionsSnapshot.empty) {
            console.log('👔 Seeding Initial Positions...');
            for (const position of CIC_POSITIONS) {
                await db.collection('positions').doc(position.id).set(position);
            }
        }

        // Seed Departments
        console.log('🏢 Seeding Departments...');
        for (const department of CIC_DEPARTMENTS) {
            await db.collection('departments').doc(department.id).set(department);
        }

        // Seed Organizational Unit Mapping (NEW)
        console.log('🗂️ Seeding Organizational Unit Mapping...');
        for (const mapping of CIC_ORG_UNIT_MAPPING) {
            await db.collection('orgUnitMapping').doc(mapping.id).set(mapping);
        }

        console.log('✅ Database seeding completed successfully!');
        return { success: true, message: 'Database seeded successfully' };

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Clear all competency-related data from the database
 * WARNING: This will permanently delete all competencies, positions, departments, and org mappings
 */
async function clearDatabase() {
    try {
        console.log('🗑️ Clearing database...');

        // Helper function to delete all documents in a collection
        async function deleteCollection(collectionName) {
            const snapshot = await db.collection(collectionName).get();
            const batch = db.batch();
            let count = 0;

            snapshot.forEach(doc => {
                batch.delete(doc.ref);
                count++;
            });

            if (count > 0) {
                await batch.commit();
                console.log(`   Deleted ${count} documents from ${collectionName}`);
            } else {
                console.log(`   Collection ${collectionName} is empty`);
            }
            return count;
        }

        // Delete each collection
        await deleteCollection('competencies');
        await deleteCollection('positions');
        await deleteCollection('departments');
        await deleteCollection('orgUnitMapping');

        console.log('✅ Database cleared successfully!');
        return { success: true, message: 'Database cleared successfully' };

    } catch (error) {
        console.error('❌ Error clearing database:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Force re-seed the database (clears existing data and seeds fresh)
 * Use this when you want to update all competencies with new definitions
 */
async function forceSeedDatabase() {
    try {
        console.log('🔄 Force re-seeding database...');

        // First, clear existing data
        const clearResult = await clearDatabase();
        if (!clearResult.success) {
            throw new Error('Failed to clear database: ' + clearResult.message);
        }

        // Then seed fresh data
        console.log('🌱 Seeding fresh competency data...');

        // Seed Core Competencies
        console.log('🌟 Seeding Core Competencies (C1-C5)...');
        for (const competency of CIC_CORE_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Seed Leadership Competencies
        console.log('👔 Seeding Leadership Competencies (L1-L5)...');
        for (const competency of CSC_LEADERSHIP_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Seed Functional Competencies
        console.log('🔧 Seeding Functional Competencies (F1-F3)...');
        for (const competency of CIC_FUNCTIONAL_COMPETENCIES) {
            await db.collection('competencies').doc(competency.id).set(competency);
        }

        // Seed Positions
        console.log('📋 Seeding Positions...');
        for (const position of CIC_POSITIONS) {
            await db.collection('positions').doc(position.id).set(position);
        }

        // Seed Departments
        console.log('🏢 Seeding Departments...');
        for (const department of CIC_DEPARTMENTS) {
            await db.collection('departments').doc(department.id).set(department);
        }

        // Seed Organizational Unit Mapping
        console.log('🗂️ Seeding Organizational Unit Mapping...');
        for (const mapping of CIC_ORG_UNIT_MAPPING) {
            await db.collection('orgUnitMapping').doc(mapping.id).set(mapping);
        }

        console.log('✅ Force re-seed completed successfully!');
        console.log('📊 Seeded: 5 Core + 5 Leadership + 3 Functional competencies = 13 total');
        return {
            success: true,
            message: 'Database force re-seeded successfully',
            stats: {
                coreCompetencies: CIC_CORE_COMPETENCIES.length,
                leadershipCompetencies: CSC_LEADERSHIP_COMPETENCIES.length,
                functionalCompetencies: CIC_FUNCTIONAL_COMPETENCIES.length,
                positions: CIC_POSITIONS.length,
                departments: CIC_DEPARTMENTS.length,
                orgUnitMappings: CIC_ORG_UNIT_MAPPING.length
            }
        };

    } catch (error) {
        console.error('❌ Error force re-seeding database:', error);
        return { success: false, message: error.message };
    }
}

// ============================================================================
// COMPETENCY OPERATIONS
// ============================================================================

/**
 * Get all competencies from the database
 */
async function getAllCompetencies() {
    try {
        const snapshot = await db.collection('competencies').get();
        const competencies = [];
        snapshot.forEach(doc => {
            competencies.push({ id: doc.id, ...doc.data() });
        });
        return competencies;
    } catch (error) {
        console.error('Error fetching competencies:', error);
        throw error;
    }
}

/**
 * Get competencies by type (Leadership, Functional, Core)
 */
async function getCompetenciesByType(type) {
    try {
        const snapshot = await db.collection('competencies')
            .where('type', '==', type)
            .get();
        const competencies = [];
        snapshot.forEach(doc => {
            competencies.push({ id: doc.id, ...doc.data() });
        });
        return competencies;
    } catch (error) {
        console.error('Error fetching competencies by type:', error);
        throw error;
    }
}

/**
 * Get a single competency by ID
 */
async function getCompetencyById(competencyId) {
    try {
        const doc = await db.collection('competencies').doc(competencyId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching competency:', error);
        throw error;
    }
}

/**
 * Get all Core Competencies (CRISPIEE-based)
 */
async function getCoreCompetencies() {
    try {
        const snapshot = await db.collection('competencies')
            .where('type', '==', 'Core')
            .get();
        const competencies = [];
        snapshot.forEach(doc => {
            competencies.push({ id: doc.id, ...doc.data() });
        });
        // Sort by ID (C1, C2, C3, etc.)
        return competencies.sort((a, b) => a.id.localeCompare(b.id));
    } catch (error) {
        console.error('Error fetching core competencies:', error);
        throw error;
    }
}

/**
 * Get all Organizational Unit Mappings
 */
async function getOrgUnitMappings() {
    try {
        const snapshot = await db.collection('orgUnitMapping').get();
        const mappings = [];
        snapshot.forEach(doc => {
            mappings.push({ id: doc.id, ...doc.data() });
        });
        return mappings;
    } catch (error) {
        console.error('Error fetching org unit mappings:', error);
        throw error;
    }
}

/**
 * Get Organizational Unit Mapping by Group ID
 */
async function getOrgUnitMappingByGroup(groupId) {
    try {
        const doc = await db.collection('orgUnitMapping').doc(groupId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching org unit mapping:', error);
        throw error;
    }
}

/**
 * Get competencies required for a specific organizational group
 * Returns both primary and secondary competencies with their details
 */
async function getCompetenciesForOrgGroup(groupId) {
    try {
        const mapping = await getOrgUnitMappingByGroup(groupId);
        if (!mapping) {
            return null;
        }

        const allCompetencyIds = [...mapping.primaryCompetencies, ...mapping.secondaryCompetencies];
        const competencies = [];

        for (const compId of allCompetencyIds) {
            const competency = await getCompetencyById(compId);
            if (competency) {
                competencies.push({
                    ...competency,
                    isPrimary: mapping.primaryCompetencies.includes(compId),
                    rationale: mapping.rationale[compId] || ''
                });
            }
        }

        return {
            group: mapping,
            competencies: competencies
        };
    } catch (error) {
        console.error('Error fetching competencies for org group:', error);
        throw error;
    }
}

// ============================================================================
// POSITION OPERATIONS
// ============================================================================

/**
 * Get all positions
 */
async function getAllPositions() {
    try {
        const snapshot = await db.collection('positions').get();
        const positions = [];
        snapshot.forEach(doc => {
            positions.push({ id: doc.id, ...doc.data() });
        });
        return positions;
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
}

/**
 * Get a position by ID
 */
async function getPositionById(positionId) {
    try {
        const doc = await db.collection('positions').doc(positionId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching position:', error);
        throw error;
    }
}

// ============================================================================
// DEPARTMENT OPERATIONS
// ============================================================================

/**
 * Get all departments
 */
async function getAllDepartments() {
    try {
        const snapshot = await db.collection('departments').get();
        const departments = [];
        snapshot.forEach(doc => {
            departments.push({ id: doc.id, ...doc.data() });
        });
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
}

/**
 * Update department peer rater settings
 */
async function updateDepartmentPeerSettings(departmentId, minPeerRaters, maxPeerRaters) {
    try {
        await db.collection('departments').doc(departmentId).update({
            minPeerRaters,
            maxPeerRaters,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Create or update a user profile
 */
async function saveUserProfile(userId, userData) {
    try {
        await db.collection('users').doc(userId).set({
            ...userData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

/**
 * Get a user by ID
 */
async function getUserById(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

/**
 * Get all users in a department
 */
async function getUsersByDepartment(departmentId) {
    try {
        const snapshot = await db.collection('users')
            .where('departmentId', '==', departmentId)
            .get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error('Error fetching users by department:', error);
        throw error;
    }
}

// ============================================================================
// ASSESSMENT OPERATIONS
// ============================================================================

/**
 * Create a new assessment
 */
async function createAssessment(assessmentData) {
    try {
        const docRef = await db.collection('assessments').add({
            ...assessmentData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, assessmentId: docRef.id };
    } catch (error) {
        console.error('Error creating assessment:', error);
        throw error;
    }
}

/**
 * Get assessments for a user (as subject)
 */
async function getAssessmentsForUser(userId) {
    try {
        const snapshot = await db.collection('assessments')
            .where('subjectUserId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        const assessments = [];
        snapshot.forEach(doc => {
            assessments.push({ id: doc.id, ...doc.data() });
        });
        return assessments;
    } catch (error) {
        console.error('Error fetching assessments:', error);
        throw error;
    }
}

/**
 * Get pending peer assessment requests for a user
 */
async function getPendingPeerRequests(userId) {
    try {
        const snapshot = await db.collection('assessment_ratings')
            .where('raterId', '==', userId)
            .where('raterType', '==', 'peer')
            .where('status', '==', 'pending')
            .get();
        const requests = [];
        snapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        return requests;
    } catch (error) {
        console.error('Error fetching peer requests:', error);
        throw error;
    }
}

/**
 * Submit a rating (self, peer, or superior)
 */
async function submitRating(ratingData) {
    try {
        const docRef = await db.collection('assessment_ratings').add({
            ...ratingData,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'completed'
        });

        // Check if all ratings are complete and update assessment status
        await checkAndUpdateAssessmentStatus(ratingData.assessmentId);

        return { success: true, ratingId: docRef.id };
    } catch (error) {
        console.error('Error submitting rating:', error);
        throw error;
    }
}

/**
 * Check if all ratings are complete and update assessment status
 */
async function checkAndUpdateAssessmentStatus(assessmentId) {
    try {
        const assessment = await db.collection('assessments').doc(assessmentId).get();
        if (!assessment.exists) return;

        const assessmentData = assessment.data();

        // Get all ratings for this assessment
        const ratingsSnapshot = await db.collection('assessment_ratings')
            .where('assessmentId', '==', assessmentId)
            .where('status', '==', 'completed')
            .get();

        let hasSelf = false;
        let peerCount = 0;
        let hasSuperior = false;

        ratingsSnapshot.forEach(doc => {
            const rating = doc.data();
            if (rating.raterType === 'self') hasSelf = true;
            if (rating.raterType === 'peer') peerCount++;
            if (rating.raterType === 'superior') hasSuperior = true;
        });

        // Check if all required ratings are complete
        const requiredPeers = assessmentData.requiredPeerCount || 2;
        const isComplete = hasSelf && peerCount >= requiredPeers && hasSuperior;

        if (isComplete) {
            await db.collection('assessments').doc(assessmentId).update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else if (hasSelf || peerCount > 0 || hasSuperior) {
            await db.collection('assessments').doc(assessmentId).update({
                status: 'in_progress'
            });
        }
    } catch (error) {
        console.error('Error updating assessment status:', error);
    }
}

/**
 * Calculate weighted scores for an assessment
 */
async function calculateWeightedScores(assessmentId) {
    try {
        const ratingsSnapshot = await db.collection('assessment_ratings')
            .where('assessmentId', '==', assessmentId)
            .where('status', '==', 'completed')
            .get();

        const ratingsByType = {
            self: null,
            peer: [],
            superior: null
        };

        ratingsSnapshot.forEach(doc => {
            const rating = doc.data();
            if (rating.raterType === 'self') {
                ratingsByType.self = rating.ratings;
            } else if (rating.raterType === 'peer') {
                ratingsByType.peer.push(rating.ratings);
            } else if (rating.raterType === 'superior') {
                ratingsByType.superior = rating.ratings;
            }
        });

        // Calculate weighted scores for each competency
        const weightedScores = {};
        const weights = { self: 0.20, peer: 0.30, superior: 0.50 };

        // Get all competency IDs from self-rating
        if (ratingsByType.self) {
            for (const competencyId of Object.keys(ratingsByType.self)) {
                let weightedSum = 0;
                let totalWeight = 0;

                // Self score
                if (ratingsByType.self[competencyId]) {
                    weightedSum += ratingsByType.self[competencyId] * weights.self;
                    totalWeight += weights.self;
                }

                // Peer average
                if (ratingsByType.peer.length > 0) {
                    const peerSum = ratingsByType.peer.reduce((sum, peerRating) => {
                        return sum + (peerRating[competencyId] || 0);
                    }, 0);
                    const peerAvg = peerSum / ratingsByType.peer.length;
                    weightedSum += peerAvg * weights.peer;
                    totalWeight += weights.peer;
                }

                // Superior score
                if (ratingsByType.superior && ratingsByType.superior[competencyId]) {
                    weightedSum += ratingsByType.superior[competencyId] * weights.superior;
                    totalWeight += weights.superior;
                }

                // Normalize if not all raters participated
                weightedScores[competencyId] = {
                    weighted: totalWeight > 0 ? weightedSum / totalWeight * (1 / (weights.self + weights.peer + weights.superior)) * 4 : 0,
                    self: ratingsByType.self[competencyId] || null,
                    peerAvg: ratingsByType.peer.length > 0
                        ? ratingsByType.peer.reduce((sum, p) => sum + (p[competencyId] || 0), 0) / ratingsByType.peer.length
                        : null,
                    superior: ratingsByType.superior ? ratingsByType.superior[competencyId] : null
                };
            }
        }

        return weightedScores;
    } catch (error) {
        console.error('Error calculating weighted scores:', error);
        throw error;
    }
}

// ============================================================================
// ASSESSMENT CYCLE OPERATIONS
// ============================================================================

/**
 * Create a new assessment cycle (HR/Admin function)
 */
async function createAssessmentCycle(cycleData) {
    try {
        const docRef = await db.collection('assessment_cycles').add({
            ...cycleData,
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, cycleId: docRef.id };
    } catch (error) {
        console.error('Error creating assessment cycle:', error);
        throw error;
    }
}

/**
 * Get active assessment cycle
 */
async function getActiveAssessmentCycle() {
    try {
        const snapshot = await db.collection('assessment_cycles')
            .where('status', '==', 'active')
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching active cycle:', error);
        throw error;
    }
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

/**
 * Generate gap analysis for an assessment
 */
async function generateGapAnalysis(assessmentId, positionId) {
    try {
        const position = await getPositionById(positionId);
        const weightedScores = await calculateWeightedScores(assessmentId);
        const competencies = await getAllCompetencies();

        const gapAnalysis = [];

        for (const competency of competencies) {
            if (position.competencyIds.includes(competency.id)) {
                const scores = weightedScores[competency.id] || { weighted: 0 };
                const gap = position.requiredLevel - scores.weighted;

                gapAnalysis.push({
                    competencyId: competency.id,
                    competencyName: competency.name,
                    competencyType: competency.type,
                    requiredLevel: position.requiredLevel,
                    requiredLevelName: position.requiredLevelName,
                    actualScore: scores.weighted,
                    selfScore: scores.self,
                    peerScore: scores.peerAvg,
                    superiorScore: scores.superior,
                    gap: gap,
                    status: gap <= 0 ? 'met' : 'development_need',
                    perceptionGap: scores.self && scores.superior
                        ? Math.abs(scores.self - scores.superior)
                        : null
                });
            }
        }

        return gapAnalysis;
    } catch (error) {
        console.error('Error generating gap analysis:', error);
        throw error;
    }
}

// ============================================================================
// PEER RATER ASSIGNMENT FUNCTIONS
// ============================================================================

/**
 * Assign peer raters to an assessment
 * @param {string} assessmentId - The assessment ID
 * @param {Array<string>} peerUserIds - Array of user IDs to assign as peer raters
 * @returns {Object} Result of the assignment
 */
async function assignPeerRaters(assessmentId, peerUserIds) {
    try {
        const assessmentRef = db.collection('assessments').doc(assessmentId);
        const assessment = await assessmentRef.get();

        if (!assessment.exists) {
            throw new Error('Assessment not found');
        }

        const assessmentData = assessment.data();

        // Validate against department quotas
        const user = await getUserById(assessmentData.subjectUserId);
        const position = CIC_POSITIONS.find(p => p.id === user?.positionId);
        const department = CIC_DEPARTMENTS.find(d => d.name === position?.department);

        if (department) {
            if (peerUserIds.length < department.minPeerRaters) {
                throw new Error(`Minimum ${department.minPeerRaters} peer raters required for ${department.name}`);
            }
            if (peerUserIds.length > department.maxPeerRaters) {
                throw new Error(`Maximum ${department.maxPeerRaters} peer raters allowed for ${department.name}`);
            }
        }

        // Update assessment with peer rater IDs
        await assessmentRef.update({
            assignedPeerRaterIds: peerUserIds,
            peerAssessmentStatus: 'pending',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Create individual peer rating documents
        const batch = db.batch();
        for (const peerId of peerUserIds) {
            const peerRatingRef = db.collection('peer_ratings').doc();
            batch.set(peerRatingRef, {
                assessmentId: assessmentId,
                subjectUserId: assessmentData.subjectUserId,
                raterUserId: peerId,
                cycleId: assessmentData.cycleId,
                status: 'pending',
                ratings: {},
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        await batch.commit();

        console.log(`✅ Assigned ${peerUserIds.length} peer raters to assessment ${assessmentId}`);
        return { success: true, assignedCount: peerUserIds.length };
    } catch (error) {
        console.error('Error assigning peer raters:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get peer assessments assigned to a user (assessments they need to complete)
 * @param {string} userId - The rater user ID
 * @returns {Array} List of peer assessments to complete
 */
async function getAssignedPeerAssessments(userId) {
    try {
        const snapshot = await db.collection('peer_ratings')
            .where('raterUserId', '==', userId)
            .where('status', '==', 'pending')
            .get();

        const assessments = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const subjectUser = await getUserById(data.subjectUserId);
            assessments.push({
                id: doc.id,
                ...data,
                subjectUserName: subjectUser?.name || 'Unknown User'
            });
        }

        return assessments;
    } catch (error) {
        console.error('Error getting assigned peer assessments:', error);
        return [];
    }
}

/**
 * Submit a peer rating
 * @param {string} peerRatingId - The peer rating document ID
 * @param {Object} ratings - Rating data by competency
 * @returns {Object} Result of the submission
 */
async function submitPeerRating(peerRatingId, ratings) {
    try {
        const peerRatingRef = db.collection('peer_ratings').doc(peerRatingId);

        await peerRatingRef.update({
            ratings: ratings,
            status: 'completed',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Check if all peer ratings for this assessment are complete
        const peerRating = await peerRatingRef.get();
        const peerRatingData = peerRating.data();

        const allPeerRatings = await db.collection('peer_ratings')
            .where('assessmentId', '==', peerRatingData.assessmentId)
            .get();

        const allComplete = allPeerRatings.docs.every(doc => doc.data().status === 'completed');

        if (allComplete) {
            await db.collection('assessments').doc(peerRatingData.assessmentId).update({
                peerAssessmentStatus: 'completed'
            });
        } else {
            const completedCount = allPeerRatings.docs.filter(doc => doc.data().status === 'completed').length;
            await db.collection('assessments').doc(peerRatingData.assessmentId).update({
                peerAssessmentStatus: 'partial',
                peerCompletedCount: completedCount,
                peerTotalCount: allPeerRatings.docs.length
            });
        }

        console.log('✅ Peer rating submitted successfully');
        return { success: true };
    } catch (error) {
        console.error('Error submitting peer rating:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get peer rater assignments for HR view
 * @param {string} cycleId - The assessment cycle ID
 * @returns {Array} List of all peer assignments
 */
async function getPeerRaterAssignments(cycleId) {
    try {
        const snapshot = await db.collection('assessments')
            .where('cycleId', '==', cycleId)
            .get();

        const assignments = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const user = await getUserById(data.subjectUserId);
            const position = CIC_POSITIONS.find(p => p.id === user?.positionId);
            const department = CIC_DEPARTMENTS.find(d => d.name === position?.department);

            assignments.push({
                assessmentId: doc.id,
                userId: data.subjectUserId,
                userName: user?.name || 'Unknown',
                position: position?.title || 'N/A',
                department: position?.department || 'N/A',
                assignedPeerRaterIds: data.assignedPeerRaterIds || [],
                minRequired: department?.minPeerRaters || 2,
                maxAllowed: department?.maxPeerRaters || 3,
                peerAssessmentStatus: data.peerAssessmentStatus || 'pending'
            });
        }

        return assignments;
    } catch (error) {
        console.error('Error getting peer rater assignments:', error);
        return [];
    }
}

// ============================================================================
// DEVELOPMENT PLAN (IDP) FUNCTIONS
// ============================================================================

/**
 * Create a development plan from gap analysis
 * @param {string} userId - The user ID
 * @param {string} assessmentId - The assessment ID
 * @param {string} cycleId - The cycle ID
 * @returns {Object} Created development plan
 */
async function createDevelopmentPlan(userId, assessmentId, cycleId) {
    try {
        // Get gap analysis
        const gapAnalysis = await generateGapAnalysis(assessmentId);
        const developmentNeeds = gapAnalysis.filter(gap => gap.status === 'development_need');

        const planRef = db.collection('development_plans').doc();
        const planData = {
            id: planRef.id,
            userId: userId,
            assessmentId: assessmentId,
            cycleId: cycleId,
            status: 'draft', // draft, submitted, approved, in_progress, completed
            developmentNeeds: developmentNeeds.map(need => ({
                competencyId: need.competencyId,
                competencyName: need.competencyName,
                gap: need.gap,
                currentLevel: need.actualScore,
                targetLevel: need.requiredLevel
            })),
            activities: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await planRef.set(planData);

        console.log('✅ Development plan created:', planRef.id);
        return { success: true, plan: planData };
    } catch (error) {
        console.error('Error creating development plan:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get development plan for a user
 * @param {string} userId - The user ID
 * @param {string} cycleId - Optional cycle ID filter
 * @returns {Object|null} Development plan or null
 */
async function getDevelopmentPlan(userId, cycleId = null) {
    try {
        let query = db.collection('development_plans').where('userId', '==', userId);

        if (cycleId) {
            query = query.where('cycleId', '==', cycleId);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').limit(1).get();

        if (snapshot.empty) {
            return null;
        }

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        };
    } catch (error) {
        console.error('Error getting development plan:', error);
        return null;
    }
}

/**
 * Add a development activity to a plan
 * @param {string} planId - The development plan ID
 * @param {Object} activity - Activity data
 * @returns {Object} Result of the operation
 */
async function addDevelopmentActivity(planId, activity) {
    try {
        const planRef = db.collection('development_plans').doc(planId);
        const plan = await planRef.get();

        if (!plan.exists) {
            throw new Error('Development plan not found');
        }

        const activityData = {
            id: `act-${Date.now()}`,
            title: activity.title,
            type: activity.type, // training, mentoring, job_rotation, self_study, coaching, special_project
            description: activity.description || '',
            targetCompetencyIds: activity.targetCompetencyIds || [],
            targetDate: activity.targetDate,
            status: 'planned', // planned, in_progress, completed, cancelled
            progress: 0,
            evidence: [],
            notes: '',
            createdAt: new Date().toISOString()
        };

        await planRef.update({
            activities: firebase.firestore.FieldValue.arrayUnion(activityData),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Activity added to development plan');
        return { success: true, activity: activityData };
    } catch (error) {
        console.error('Error adding development activity:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update activity status/progress
 * @param {string} planId - The development plan ID
 * @param {string} activityId - The activity ID
 * @param {Object} updates - Updates to apply
 * @returns {Object} Result of the operation
 */
async function updateActivityStatus(planId, activityId, updates) {
    try {
        const planRef = db.collection('development_plans').doc(planId);
        const plan = await planRef.get();

        if (!plan.exists) {
            throw new Error('Development plan not found');
        }

        const planData = plan.data();
        const activities = planData.activities || [];
        const activityIndex = activities.findIndex(a => a.id === activityId);

        if (activityIndex === -1) {
            throw new Error('Activity not found');
        }

        // Update the activity
        activities[activityIndex] = {
            ...activities[activityIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await planRef.update({
            activities: activities,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Activity status updated');
        return { success: true };
    } catch (error) {
        console.error('Error updating activity status:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Submit development plan for supervisor approval
 * @param {string} planId - The development plan ID
 * @returns {Object} Result of the operation
 */
async function submitPlanForApproval(planId) {
    try {
        const planRef = db.collection('development_plans').doc(planId);

        await planRef.update({
            status: 'submitted',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Development plan submitted for approval');
        return { success: true };
    } catch (error) {
        console.error('Error submitting plan for approval:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Approve or reject a development plan (supervisor action)
 * @param {string} planId - The development plan ID
 * @param {string} supervisorId - The supervisor user ID
 * @param {boolean} approved - Approval status
 * @param {string} comments - Optional supervisor comments
 * @returns {Object} Result of the operation
 */
async function approveDevelopmentPlan(planId, supervisorId, approved, comments = '') {
    try {
        const planRef = db.collection('development_plans').doc(planId);

        await planRef.update({
            status: approved ? 'approved' : 'rejected',
            approvedBy: supervisorId,
            approvalDate: firebase.firestore.FieldValue.serverTimestamp(),
            supervisorComments: comments,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Development plan ${approved ? 'approved' : 'rejected'}`);
        return { success: true };
    } catch (error) {
        console.error('Error approving development plan:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get subordinate development plans (for supervisors)
 * @param {string} supervisorId - The supervisor user ID
 * @returns {Array} List of subordinate development plans
 */
async function getSubordinateDevelopmentPlans(supervisorId) {
    try {
        // Get subordinates
        const subordinatesSnapshot = await db.collection('users')
            .where('supervisorId', '==', supervisorId)
            .get();

        const subordinateIds = subordinatesSnapshot.docs.map(doc => doc.id);

        if (subordinateIds.length === 0) {
            return [];
        }

        // Get development plans for subordinates
        const plans = [];
        for (const subId of subordinateIds) {
            const planSnapshot = await db.collection('development_plans')
                .where('userId', '==', subId)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

            if (!planSnapshot.empty) {
                const user = await getUserById(subId);
                plans.push({
                    id: planSnapshot.docs[0].id,
                    ...planSnapshot.docs[0].data(),
                    userName: user?.name || 'Unknown'
                });
            }
        }

        return plans;
    } catch (error) {
        console.error('Error getting subordinate development plans:', error);
        return [];
    }
}

// ============================================================================
// SUPERIOR ASSESSMENT FUNCTIONS
// ============================================================================

/**
 * Submit a superior assessment rating
 * @param {string} assessmentId - The assessment ID
 * @param {string} supervisorId - The supervisor user ID
 * @param {Object} ratings - Rating data by competency
 * @returns {Object} Result of the submission
 */
async function submitSuperiorRating(assessmentId, supervisorId, ratings) {
    try {
        const assessmentRef = db.collection('assessments').doc(assessmentId);

        await assessmentRef.update({
            superiorRaterId: supervisorId,
            superiorRatings: ratings,
            superiorAssessmentStatus: 'completed',
            superiorSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Check if all assessment components are complete
        const assessment = await assessmentRef.get();
        const data = assessment.data();

        if (data.selfAssessmentStatus === 'completed' &&
            data.peerAssessmentStatus === 'completed' &&
            data.superiorAssessmentStatus === 'completed') {
            await assessmentRef.update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log('✅ Superior rating submitted successfully');
        return { success: true };
    } catch (error) {
        console.error('Error submitting superior rating:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get pending superior assessments for a supervisor
 * @param {string} supervisorId - The supervisor user ID
 * @returns {Array} List of pending assessments to rate
 */
async function getSuperiorPendingRatings(supervisorId) {
    try {
        // Get subordinates
        const subordinatesSnapshot = await db.collection('users')
            .where('supervisorId', '==', supervisorId)
            .get();

        const subordinateIds = subordinatesSnapshot.docs.map(doc => doc.id);

        if (subordinateIds.length === 0) {
            return [];
        }

        // Get assessments for subordinates that need superior rating
        const pendingAssessments = [];

        for (const subId of subordinateIds) {
            const assessmentSnapshot = await db.collection('assessments')
                .where('subjectUserId', '==', subId)
                .where('superiorAssessmentStatus', 'in', ['pending', ''])
                .get();

            for (const doc of assessmentSnapshot.docs) {
                const user = await getUserById(subId);
                pendingAssessments.push({
                    id: doc.id,
                    ...doc.data(),
                    subjectUserName: user?.name || 'Unknown'
                });
            }
        }

        return pendingAssessments;
    } catch (error) {
        console.error('Error getting superior pending ratings:', error);
        return [];
    }
}

// Export functions globally
window.seedDatabase = seedDatabase;
window.clearDatabase = clearDatabase;
window.forceSeedDatabase = forceSeedDatabase;
window.getAllCompetencies = getAllCompetencies;
window.getCompetenciesByType = getCompetenciesByType;
window.getCompetencyById = getCompetencyById;
window.getCoreCompetencies = getCoreCompetencies;
window.getOrgUnitMappings = getOrgUnitMappings;
window.getOrgUnitMappingByGroup = getOrgUnitMappingByGroup;
window.getCompetenciesForOrgGroup = getCompetenciesForOrgGroup;
window.getAllPositions = getAllPositions;
window.getPositionById = getPositionById;
window.getAllDepartments = getAllDepartments;
window.updateDepartmentPeerSettings = updateDepartmentPeerSettings;
window.saveUserProfile = saveUserProfile;
window.getUserById = getUserById;
window.getUsersByDepartment = getUsersByDepartment;
window.createAssessment = createAssessment;
window.getAssessmentsForUser = getAssessmentsForUser;
window.getPendingPeerRequests = getPendingPeerRequests;
window.submitRating = submitRating;
window.calculateWeightedScores = calculateWeightedScores;
window.createAssessmentCycle = createAssessmentCycle;
window.getActiveAssessmentCycle = getActiveAssessmentCycle;
window.generateGapAnalysis = generateGapAnalysis;

// Peer Assignment Functions
window.assignPeerRaters = assignPeerRaters;
window.getAssignedPeerAssessments = getAssignedPeerAssessments;
window.submitPeerRating = submitPeerRating;
window.getPeerRaterAssignments = getPeerRaterAssignments;

// Development Plan Functions
window.createDevelopmentPlan = createDevelopmentPlan;
window.getDevelopmentPlan = getDevelopmentPlan;
window.addDevelopmentActivity = addDevelopmentActivity;
window.updateActivityStatus = updateActivityStatus;
window.submitPlanForApproval = submitPlanForApproval;
window.approveDevelopmentPlan = approveDevelopmentPlan;
window.getSubordinateDevelopmentPlans = getSubordinateDevelopmentPlans;

// Superior Assessment Functions
window.submitSuperiorRating = submitSuperiorRating;
window.getSuperiorPendingRatings = getSuperiorPendingRatings;

// ============================================================================
// ORG UNIT MAPPING HELPERS
// ============================================================================

/**
 * Get competencies for a specific org unit
 * @param {string} orgUnitId - The org unit ID (e.g., 'cims', 'bdc', 'legal')
 * @returns {Object} - { primary: [...], secondary: [...], all: [...] }
 */
function getCompetenciesByOrgUnit(orgUnitId) {
    const mapping = CIC_ORG_UNIT_MAPPING.find(m => m.id === orgUnitId);
    if (!mapping) {
        return { primary: [], secondary: [], all: [] };
    }

    const allCompetencies = [
        ...CIC_CORE_COMPETENCIES,
        ...CSC_LEADERSHIP_COMPETENCIES,
        ...CIC_FUNCTIONAL_COMPETENCIES
    ];

    const primary = allCompetencies.filter(c => mapping.primaryCompetencies.includes(c.id));
    const secondary = allCompetencies.filter(c => mapping.secondaryCompetencies?.includes(c.id));

    return {
        primary,
        secondary,
        all: [...primary, ...secondary],
        rationale: mapping.rationale
    };
}

/**
 * Get org unit for a user based on their department
 * @param {string} departmentName - The user's department name
 * @returns {Object|null} - The matching org unit mapping or null
 */
function getOrgUnitForDepartment(departmentName) {
    if (!departmentName) return null;

    const normalizedDept = departmentName.toLowerCase();

    return CIC_ORG_UNIT_MAPPING.find(mapping =>
        mapping.organizationalUnits.some(unit =>
            normalizedDept.includes(unit.toLowerCase()) ||
            unit.toLowerCase().includes(normalizedDept)
        )
    );
}

/**
 * Get all org unit mappings
 */
function getAllOrgUnitMappings() {
    return CIC_ORG_UNIT_MAPPING;
}

// Export org unit helpers
window.getCompetenciesByOrgUnit = getCompetenciesByOrgUnit;
window.getOrgUnitForDepartment = getOrgUnitForDepartment;
window.getAllOrgUnitMappings = getAllOrgUnitMappings;

// Also export the static data for local use
window.CIC_CORE_COMPETENCIES = CIC_CORE_COMPETENCIES;
window.CSC_LEADERSHIP_COMPETENCIES = CSC_LEADERSHIP_COMPETENCIES;
window.CIC_FUNCTIONAL_COMPETENCIES = CIC_FUNCTIONAL_COMPETENCIES;
window.CIC_POSITIONS = CIC_POSITIONS;
window.CIC_DEPARTMENTS = CIC_DEPARTMENTS;
window.CIC_ORG_UNIT_MAPPING = CIC_ORG_UNIT_MAPPING;

console.log('📦 Database module loaded');
console.log('📊 Competencies: 5 Core + 5 Leadership + 3 Functional = 13 total');
