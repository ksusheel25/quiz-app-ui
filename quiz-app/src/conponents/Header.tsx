import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getUserRole, getUserEmail } from "../api/auth.api";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = getUserEmail();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold">🎯 Quizify</div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {/* Public Nav */}
          {!loggedIn && (
            <>
              <Link to="/" className={`text-sm font-semibold hover:text-indigo-200 transition ${location.pathname === "/" ? "border-b-2 border-white pb-1" : ""}`}>
                Home
              </Link>
              <Link to="/login" className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                Register
              </Link>
            </>
          )}

          {/* Authenticated Nav */}
          {loggedIn && (
            <>
              <Link to="/" className={`text-sm font-semibold hover:text-indigo-200 transition ${location.pathname === "/" ? "border-b-2 border-white pb-1" : ""}`}>
                Home
              </Link>

              {userRole === "STUDENT" && (
                <Link to="/student" className={`text-sm font-semibold hover:text-indigo-200 transition ${location.pathname === "/student" ? "border-b-2 border-white pb-1" : ""}`}>
                  My Quizzes
                </Link>
              )}

              {userRole === "ADMIN" && (
                <Link to="/admin" className={`text-sm font-semibold hover:text-indigo-200 transition ${location.pathname === "/admin" ? "border-b-2 border-white pb-1" : ""}`}>
                  Dashboard
                </Link>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center gap-4 border-l border-indigo-300 pl-4">
                <div className="text-sm">
                  <p className="font-semibold">{userEmail}</p>
                  <p className="text-indigo-200 text-xs">{userRole === "ADMIN" ? "👨‍💼 Admin" : "👤 Student"}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
