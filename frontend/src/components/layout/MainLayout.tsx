import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeskHeader } from './DeskHeader';
import { DeskNavigation } from './DeskNavigation';
import { DeskFooter } from './DeskFooter';
import { CopilotDrawer } from '../CopilotDrawer';

export const MainLayout: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      {/* Sticky Modern Top Header (LinkedIn + Udemy style) */}
      <DeskHeader />

      {/* Main Page Body Container */}
      <div className="app-container">
        {/* Secondary Category & Portal Navigation Tab Bar */}
        <DeskNavigation />

        {/* Dynamic Outlet Page Content */}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* Modern Light Corporate Footer */}
      <DeskFooter />

      {/* Floating AI Career Copilot Drawer */}
      <CopilotDrawer />
    </div>
  );
};
