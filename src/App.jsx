import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AcademicProvider } from './context/AcademicContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Semester5 } from './pages/Semester5';
import { Minor } from './pages/Minor';
import { Elective } from './pages/Elective';
import { Performance } from './pages/Performance';
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
              <Route path="minor" element={<Minor />} />
              <Route path="elective" element={<Elective />} />
              <Route path="performance" element={<Performance />} />
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

