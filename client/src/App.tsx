import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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

          <Route path="/admin" element={<AdminPage />}>
            <Route path="greeting" element={<AdminGreeting />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="research" element={<AdminResearch />} />
            {/* 나중에 다른 관리 페이지도 여기에 추가 */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
