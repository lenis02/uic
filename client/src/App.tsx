import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import useAutoLogout from './hooks/useAutoLogout';
import PrivateRoute from './components/auth/PrivateRoute';

import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import ContactUs from './pages/ContactUs';
import JoinUs from './pages/JoinUs';
import Layout from './components/Layout';
import ActivityPage from './pages/ActivityPage';
import ResearchPage from './pages/ResearchPage';
import MembersPage from './pages/MembersPage';
import LoginPage from './pages/AdminPages/LoginPage';
import AdminPage from './pages/AdminPages/AdminPage';

import AdminHistory from './pages/AdminPages/AdminHistory';
import AdminMembers from './pages/AdminPages/AdminMembers';
import AdminResearch from './pages/AdminPages/AdminResearch';
import AdminGreeting from './pages/AdminPages/AdminGreeting';

const AppContent = () => {
  useAutoLogout(30 * 60 * 1000);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 공개 라우트 */}
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/members" element={<MembersPage />}></Route>
        <Route path="/research" element={<ResearchPage />}></Route>
        <Route path="/activity" element={<ActivityPage />}></Route>
        <Route path="/join" element={<JoinUs />}></Route>
        <Route path="/contact" element={<ContactUs />}></Route>
      </Route>

      {/* 🔒 2. 보호된 라우트 (관리자 전용) */}
      <Route element={<PrivateRoute />}>
        {/* 이 안에 있는 페이지들은 로그인 안 하면 절대 못 들어옴 */}
        <Route path="/admin" element={<AdminPage />}>
          <Route path="greeting" element={<AdminGreeting />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="research" element={<AdminResearch />} />
          {/* 나중에 다른 관리 페이지도 여기에 추가 */}
        </Route>
      </Route>

      {/* 404 페이지 */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
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
