import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import CoursesPage from "./pages/CoursesPage";
import RoadmapPage from "./pages/RoadmapPage";
import Template from "./lessons/Template";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/*<Route path="/login" element={<LoginPage />} />*/}
        {/* <Route path="/signup" element={<SignupPage />} /> */}

        {/* Protected routes */}
        <Route
          path="/main"
          element={
              <MainPage />
          }
        />
        <Route
          path="/courses"
          element={
              <CoursesPage />
          }
        />
        <Route
          path="/roadmap/:courseId"
          element={
              <RoadmapPage />
          }
        />
        <Route
          path="/lesson/:courseId/:lessonId"
          element={
              <Template />
          }
        />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
