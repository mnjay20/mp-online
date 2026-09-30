import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/authContext';
import { DynamicUiProvider, useDynamicUi } from './services/dynamicUiContext';
import { MainLayout } from './components/layout/MainLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { LoadingScreen } from './components/common/LoadingScreen';
import { DynamicAdjusterPanel } from './components/common/DynamicAdjusterPanel';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { CareersExplorerPage } from './pages/public/CareersExplorerPage';
import { JobsExplorerPage } from './pages/public/JobsExplorerPage';
import { LoginPage, RegisterPage } from './pages/auth/LoginPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentSkillsPage } from './pages/student/StudentSkillsPage';
import { CareerPlannerPage } from './pages/student/CareerPlannerPage';
import { CareerRoadmapPage } from './pages/student/CareerRoadmapPage';
import { CourseHubPage } from './pages/student/CourseHubPage';
import { ResumeScannerPage } from './pages/student/ResumeScannerPage';
import { InterviewStudioPage } from './pages/student/InterviewStudioPage';
import { StudentApplicationsPage } from './pages/student/StudentApplicationsPage';

// Recruiter Pages
import { RecruiterDashboardPage, RecruiterJobsPage } from './pages/recruiter/RecruiterDashboardPage';
import { JobPostingWizardPage } from './pages/recruiter/JobPostingWizardPage';
import { CandidateAtsKanbanPage } from './pages/recruiter/CandidateAtsKanbanPage';
import { CompanyProfilePage } from './pages/recruiter/CompanyProfilePage';

// Admin Pages
import { AdminDashboardPage, AdminCoursesPage, AdminTaxonomyPage } from './pages/admin/AdminPages';

function AppContent() {
  const { showStartupLoading, setShowStartupLoading } = useDynamicUi();

  return (
    <>
      {/* Startup Loading Animation Screen with Logo Animation */}
      {showStartupLoading && (
        <LoadingScreen 
          minDuration={2200} 
          onComplete={() => setShowStartupLoading(false)} 
        />
      )}

      {/* Dynamic UI Adjuster Floating Panel & Controls */}
      <DynamicAdjusterPanel />

      <BrowserRouter>
        <Routes>
          {/* Public Landing & Exploration Layout (No dashboard secondary tabs) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/careers" element={<CareersExplorerPage />} />
            <Route path="/jobs" element={<JobsExplorerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated Portals Layout (Includes portal category secondary tabs) */}
          <Route element={<MainLayout />}>
            {/* Student Portal */}
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/skills" element={<StudentSkillsPage />} />
            <Route path="/student/career-planner" element={<CareerPlannerPage />} />
            <Route path="/student/career-planner/roadmap" element={<CareerRoadmapPage />} />
            <Route path="/student/courses" element={<CourseHubPage />} />
            <Route path="/student/resume-scanner" element={<ResumeScannerPage />} />
            <Route path="/student/interviews" element={<InterviewStudioPage />} />
            <Route path="/student/applications" element={<StudentApplicationsPage />} />

            {/* Recruiter Portal */}
            <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/jobs/new" element={<JobPostingWizardPage />} />
            <Route path="/recruiter/jobs/:id/candidates" element={<CandidateAtsKanbanPage />} />
            <Route path="/recruiter/company-profile" element={<CompanyProfilePage />} />

            {/* Admin Portal */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/skills-taxonomy" element={<AdminTaxonomyPage />} />

            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export function App() {
  return (
    <DynamicUiProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DynamicUiProvider>
  );
}

export default App;
