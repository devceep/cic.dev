# CIC Competency Framework System

A web-based HRIS application for the Credit Information Corporation (CIC) to manage competency assessments aligned with **CSC Memorandum Circular No. 05, s. 2016** regarding Leadership Competencies and the Generic Competency Dictionary (GCD).

## Features

### Core Features
- **Integrated Competency Library**: Browse all CIC Core, CSC Leadership, and CIC Functional competencies with detailed proficiency levels and behavioral indicators
- **360-Degree Assessment**: Self-assessment, anonymous peer assessment, and superior assessment
- **Weighted Scoring**: Self (20%) + Peer Average (30%) + Superior (50%)
- **Gap Analysis**: Visual charts comparing actual vs required competency levels
- **Development Recommendations**: Auto-generated based on identified gaps
- **Organizational Unit Mapping**: Competencies mapped to CIC organizational groups for job profiling

### Competencies Included

#### Core Competencies (CRISPIEE Values-Based - Applied to ALL Employees)
1. **C1: Integrity and Public Accountability** - Ethical conduct and transparency
2. **C2: Excellence in Service Delivery** - Customer-first mindset and quality outputs
3. **C3: Results-Driven Focus** - Goal achievement and accountability
4. **C4: Innovation and Strategic Agility** - Adaptability and creative problem-solving
5. **C5: Precision and Attention to Detail** - Accuracy and data integrity

#### CSC Leadership Competencies (per MC No. 05, s. 2016)
1. **L1:** Building Collaborative and Inclusive Working Relationships
2. **L2:** Managing Performance and Coaching for Results
3. **L3:** Leading Change
4. **L4:** Thinking Strategically and Creatively
5. **L5:** Creating and Nurturing a High Performing Organization

#### CIC-Specific Functional Competencies
1. **F1: Data Privacy and Protection** - RA 10173 (DPA) compliance
2. **F2: Credit Information Management** - RA 9510 (CISA) mandate
3. **F3: Financial Analysis and Assessment** - Public financial governance

### Position Profiles
| Position | Required Level |
|----------|---------------|
| Division Chief | Intermediate (Level 2) |
| Department Manager | Advanced (Level 3) |
| Deputy Administrator | Superior (Level 4) |
| Executive Director | Superior (Level 4) |


## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click the gear icon (⚙️) → "Project settings"
4. Scroll to "Your apps" section
5. Click "Add app" and select Web (</>)
6. Register your app and copy the configuration values

### 2. Enable Firestore

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred Cloud Firestore location
5. Click "Enable"

### 3. Configure the Application

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 4. Run the Application

You can run this application using any static file server:

**Option A: Using Python**
```bash
cd cic-competency-framework
python -m http.server 8080
```

**Option B: Using Node.js (http-server)**
```bash
npx http-server -p 8080
```

**Option C: Using VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

### 5. Seed the Database

On first load, click the "Seed Data" button in the header to populate the Firestore database with:
- 5 CSC Leadership Competencies
- 3 CIC Functional Competencies
- 4 Position Profiles
- 6 CIC Departments

## Usage Guide

### For Employees

1. **Dashboard**: View your competency profile overview and pending assessments
2. **Self Assessment**: 
   - Select your position
   - Rate your proficiency for each competency (1-4 scale)
   - Submit to see your gap analysis
3. **Peer Requests**: Complete anonymous assessments for colleagues who nominated you
4. **Gap Analysis**: View detailed charts comparing your ratings vs required levels

### For HR/Admin

1. **Departments**: Configure peer rater quotas per department
2. **User Management**: Add users and assign positions/departments
3. **Assessment Cycles**: Create and manage assessment periods

## Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN) + Custom CSS
- **Charts**: Chart.js
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth (optional)

## File Structure

```
cic-competency-framework/
├── index.html              # Main single-page application
├── css/
│   └── styles.css          # Custom styles (CIC corporate theme)
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── database.js         # Firestore operations & data seeding
│   ├── charts.js           # Chart.js visualization
│   └── app.js              # Main application controller
└── README.md               # This file
```

## Compliance Notes

This system is designed to comply with:
- **CSC Memorandum Circular No. 05, s. 2016**: Leadership Competency Framework
- **Republic Act No. 10173**: Data Privacy Act of 2012
- **CIC Mandate**: Credit Information System Act

## Support

For issues or questions, please contact the CIC IT Department or HR Division.

---

© 2024 Credit Information Corporation. All rights reserved.
