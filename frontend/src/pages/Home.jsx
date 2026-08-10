import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaFilm,
  FaTv,
  FaGhost,
  FaLeaf,
  FaGlobe,
  FaBook,
  FaPaintBrush,
  FaDragon,
  FaBookOpen,
  FaFeatherAlt,
  FaCommentDots,
  FaMask,
} from "react-icons/fa";
import "./Home.css";

const CATEGORIES = [
  { icon: <FaFilm />, name: "Фільми", value: "Фільми" },
  { icon: <FaTv />, name: "Серіали", value: "Серіали" },
  { icon: <FaGhost />, name: "Аніме", value: "Аніме" },
  { icon: <FaLeaf />, name: "Дорами", value: "Дорами" },
  { icon: <FaGlobe />, name: "Лакорни", value: "Лакорни" },
  { icon: <FaBook />, name: "Манга", value: "Манга" },
  { icon: <FaPaintBrush />, name: "Манхва", value: "Манхва" },
  { icon: <FaDragon />, name: "Маньхуа", value: "Маньхуа" },
  { icon: <FaBookOpen />, name: "Книги", value: "Книги" },
  { icon: <FaFeatherAlt />, name: "Ранобе", value: "Ранобе" },
  { icon: <FaCommentDots />, name: "Новели", value: "Новели" },
  { icon: <FaMask />, name: "Комікси", value: "Комікси" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-corner-decor hero-corner-left" />
        <div className="hero-corner-decor hero-corner-right" />

        <div className="hero-content">
          <p className="section-label">PERSONAL MEDIA LIBRARY</p>
          <h1 className="hero-title">
            Watch &amp; Read
            <br />
            <span className="hero-accent">Library</span>
          </h1>
          <p className="hero-subtitle">
            Твоя особиста бібліотека для фільмів, лакорнів, дорам, манги, манхв,
            маньхуа та книг. Зберігай обкладинки, рейтинги, відгуки й улюблене.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/library" className="btn-primary">
                  Відкрити бібліотеку
                </Link>
                <Link to="/library/new" className="btn-ghost">
                  + Додати запис
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Почати безкоштовно
                </Link>
                <Link to="/login" className="btn-ghost">
                  Увійти
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-side-card">
          <img src="/src/assets/d4fbbaf873c9377b3d442d5d6cd2d64d.jpg" alt="Бібліотека" />
          <div className="hero-side-placeholder">
            <span></span>
          </div>
          <div className="hero-side-content">
            <div className="line"></div>
            <h3>Personal collection</h3>
            <p>Track. Rate. Remember.</p>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <p className="section-label">CATEGORIES</p>
        <h2>Обери розділ бібліотеки</h2>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={user ? `/library?category=${cat.value}` : "/login"}
              className="category-card"
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
