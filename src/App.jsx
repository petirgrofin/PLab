// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import CoursesPage from "./pages/CoursesPage";
import RoadmapPage from "./pages/RoadmapPage";
import Template from "./lessons/Template";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/roadmap/:courseId" element={<RoadmapPage />} />
        <Route path="/lesson/:courseId/:lessonId" element={<Template />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
