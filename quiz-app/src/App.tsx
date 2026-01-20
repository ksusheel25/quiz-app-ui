import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Home from "./conponents/Home";
import Login from "./pages/Login";
import AuthLayout from "./conponents/AuthLayout";
import Layout from "./conponents/Layout";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages with main layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboards and Quiz (no public header) */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
