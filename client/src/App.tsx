import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import useAutoLogout from './hooks/useAutoLogout';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/Layout';

const MainPage = lazy(() => import('./pages/MainPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const MembersPage = lazy(() => import('./pages/MembersPage'));
const LoginPage = lazy(() => import('./pages/AdminPages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPages/AdminPage'));
const AdminHistory = lazy(() => import('./pages/AdminPages/AdminHistory'));
const AdminMembers = lazy(() => import('./pages/AdminPages/AdminMembers'));
const AdminResearch = lazy(() => import('./pages/AdminPages/AdminResearch'));
const AdminGreeting = lazy(() => import('./pages/AdminPages/AdminGreeting'));
const AdminPopup = lazy(() => import('./pages/AdminPages/AdminPopup'));
const AdminNetwork = lazy(() => import('./pages/AdminPages/AdminNetwork'));
const AdminPartner = lazy(() => import('./pages/AdminPages/AdminPartner'));

const AppContent = () => {
  useAutoLogout(30 * 60 * 1000);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/members" element={<MembersPage />}></Route>
          <Route path="/research" element={<ResearchPage />}></Route>
          <Route path="/activity" element={<ActivityPage />}></Route>
          <Route path="/join" element={<JoinUs />}></Route>
          <Route path="/contact" element={<ContactUs />}></Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="greeting" element={<AdminGreeting />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="research" element={<AdminResearch />} />
            <Route path="popup" element={<AdminPopup />} />
            <Route path="network" element={<AdminNetwork />} />
            <Route path="partner" element={<AdminPartner />} />
          </Route>
        </Route>

        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
