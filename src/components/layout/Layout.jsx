import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { MarksCalculatorModal } from '../subjects/MarksCalculatorModal';
import { SubjectModal } from '../subjects/SubjectModal';
import { useAcademic } from '../../context/AcademicContext';

export function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);

  const { addSemester5Subject } = useAcademic();

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col antialiased selection:bg-[#9AF04F] selection:text-[#090D04]">
      {/* Desktop Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 pb-24 lg:pb-12">
        <Header
          onMenuClick={() => setMobileSidebarOpen(true)}
          onOpenCalculator={() => setCalculatorOpen(true)}
          onOpenAddSubject={() => setAddSubjectOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav onQuickAction={() => setAddSubjectOpen(true)} />

      {/* Quick Marks Calculator Modal */}
      <MarksCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        initialTab="internal"
      />

      {/* Quick Add Subject Modal */}
      <SubjectModal
        isOpen={addSubjectOpen}
        onClose={() => setAddSubjectOpen(false)}
        onSave={addSemester5Subject}
        sectionTitle="Semester 5 Regular Subject"
      />
    </div>
  );
}
