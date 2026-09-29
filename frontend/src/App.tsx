import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { InterviewStudioPage } from '@/pages/InterviewStudioPage';
import { RecruiterPortalPage } from '@/pages/RecruiterPortalPage';
import { ResumeScannerPage } from '@/pages/ResumeScannerPage';
import { SkillGapRoadmapPage } from '@/pages/SkillGapRoadmapPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { JobsPage } from '@/pages/JobsPage';
import { ApplicationsTrackerPage } from '@/pages/ApplicationsTrackerPage';
import { CopilotChatPage } from '@/pages/CopilotChatPage';
import { CareersExplorerPage } from '@/pages/CareersExplorerPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/interview" element={<InterviewStudioPage />} />
          <Route path="/recruiter" element={<RecruiterPortalPage />} />
          <Route path="/resume" element={<ResumeScannerPage />} />
          <Route path="/skill-gap" element={<SkillGapRoadmapPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/applications" element={<ApplicationsTrackerPage />} />
          <Route path="/copilot" element={<CopilotChatPage />} />
          <Route path="/careers" element={<CareersExplorerPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
