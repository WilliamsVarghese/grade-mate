import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AcademicProvider } from './context/AcademicContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Semester5 } from './pages/Semester5';
import { Elective } from './pages/Elective';
import { AcademicCalendar } from './pages/AcademicCalendar';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <ThemeProvider>
      <AcademicProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="semester-5" element={<Semester5 />} />
              <Route path="semesters" element={<Semester5 />} />
              <Route path="curriculum" element={<Semester5 />} />
              <Route path="calendar" element={<AcademicCalendar />} />
              <Route path="minor" element={<Navigate to="/" replace />} />
              <Route path="elective" element={<Elective />} />
              <Route path="performance" element={<AcademicCalendar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AcademicProvider>
    </ThemeProvider>
  );
}

export default App;

