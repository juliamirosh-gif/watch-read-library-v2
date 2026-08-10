import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">
            WatchRead<span className="logo-accent">Library</span>
          </span>
        </Link>

        <nav className="navbar-nav">
          {user ? (
            <>
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Моя бібліотека
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {user.username}
              </NavLink>
              <button onClick={handleLogout} className="nav-btn-logout">
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Увійти
              </Link>
              <Link to="/register" className="nav-btn-register">
                Реєстрація
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
