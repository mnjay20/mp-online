import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeskHeader } from './DeskHeader';
import { DeskFooter } from './DeskFooter';
import { CopilotDrawer } from '../CopilotDrawer';

export const PublicLayout: React.FC = () => {
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

      {/* Main Public Body Container */}
      <div className="app-container" style={{ flex: 1, paddingBottom: '40px' }}>
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
