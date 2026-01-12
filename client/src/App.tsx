import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import ContactUs from './pages/ContactUs';
import JoinUs from './pages/JoinUs';
import Layout from './components/Layout';
import ActivityPage from './pages/ActivityPage';
import ResearchPage from './pages/ResearchPage';
import MembersPage from './pages/MembersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/members" element={<MembersPage />}></Route>
          <Route path="/research" element={<ResearchPage />}></Route>
          <Route path="/activity" element={<ActivityPage />}></Route>
          <Route path="/join" element={<JoinUs />}></Route>
          <Route path="/contact" element={<ContactUs />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
