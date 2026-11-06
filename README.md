# GradeMate – Personal Academic Performance Tracker

GradeMate is a modern, responsive, single-user academic performance dashboard designed with a premium dark fintech aesthetic.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB?style=flat-square)
![Design](https://img.shields.io/badge/Design-Fintech%20%2F%20Neo--banking-9AF04F?style=flat-square)
![Routing](https://img.shields.io/badge/Routing-React%20Router%20v6-CA4245?style=flat-square)
![Charts](https://img.shields.io/badge/Charts-Recharts-22C55E?style=flat-square)

---

## ✨ Features

- **Fintech Visual Design**: High-contrast near-black theme (`#08090C`), neon lime green (`#9AF04F`) primary highlights, and electric purple (`#9655F5`) analytics.
- **Academic Balance Hero Card**: Displays Current CGPA, semester comparison, honours tracking, and quick action shortcuts.
- **Semester 5 Regular Subjects**: Full CRUD for core curriculum subjects with internal assessment (CIA) and end-semester (ESE) tracking.
- **Minor – IoT and Sensors**: Completely segregated minor track with dedicated GPA and credit progression.
- **Elective – Operating System Security**: Specialized professional elective module management.
- **Performance Analytics**: SGPA trajectory area chart, subject-wise marks comparison, credit completion gauge, and letter grade ledger.
- **Live GPA Calculators**: Instant dynamic calculation for both SGPA ($\sum (\text{Credit} \times \text{GP}) / \sum \text{Credits}$) and cumulative CGPA.
- **Data Persistence & Backups**: LocalStorage persistence with one-click JSON backup export and import.
- **Upcoming Exam Calendar**: Interactive exam scheduler with date countdowns and syllabus coverage.
- **Responsive Layout**: Desktop fixed sidebar and floating glassmorphism mobile bottom navigation bar.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Visualizations**: Recharts
- **State & Storage**: React Context + LocalStorage (ready for future Spring Boot REST API integration)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WilliamsVarghese/grade-mate.git

# Navigate to the project directory
cd grade-mate

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License.
