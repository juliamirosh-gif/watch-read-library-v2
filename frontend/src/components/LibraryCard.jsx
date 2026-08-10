import { Link } from "react-router-dom";
import { toggleFavorite } from "../api/index.js";
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
  FaRegHeart,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import "./LibraryCard.css";

const CategoryIcon = ({ category }) => {
  const icons = {
    "Фільми": FaFilm,
    "Серіали": FaTv,
    "Аніме": FaGhost,
    "Дорами": FaLeaf,
    "Лакорни": FaGlobe,
    "Манга": FaBook,
    "Манхва": FaPaintBrush,
    "Маньхуа": FaDragon,
    "Книги": FaBookOpen,
    "Ранобе": FaFeatherAlt,
    "Новели": FaCommentDots,
    "Комікси": FaMask,
  };
  const IconComponent = icons[category] || FaBook;
  return <IconComponent />;
};

const FavoriteIcon = ({ isFavorite }) => {
  return isFavorite ? <FaHeart /> : <FaRegHeart />;
};

const StarIcon = () => {
  return <FaStar />;
};

export default function LibraryCard({ item, onUpdate }) {
  const statusColors = {
    Завершено: "status-done",
    "В процесі": "status-progress",
    Планую: "status-planned",
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    try {
      await toggleFavorite(item.id);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const progress =
    item.totalProgress && item.currentProgress
      ? Math.round((item.currentProgress / item.totalProgress) * 100)
      : null;

  return (
    <article className="library-card">
      <Link to={`/library/${item.id}`} className="card-cover-link">
        <div className="card-cover">
          {item.coverPath ? (
            <img src={item.coverPath} alt={item.title} loading="lazy" />
          ) : (
            <div className="card-cover-placeholder">
              <CategoryIcon category={item.category} />
            </div>
          )}
          <div className="card-overlay">
            <span className={`card-status ${statusColors[item.status] || ""}`}>
              {item.status}
            </span>
          </div>
        </div>
      </Link>

      <div className="card-body">
        <div className="card-header">
          <span className="card-category">
            <CategoryIcon category={item.category} /> {item.category}
          </span>
          <button
            onClick={handleFavorite}
            className={`card-favorite ${item.isFavorite ? "active" : ""}`}
            title={item.isFavorite ? "Видалити з обраного" : "В обране"}
          >
            <FavoriteIcon isFavorite={item.isFavorite} />
          </button>
        </div>

        <Link to={`/library/${item.id}`} className="card-title-link">
          <h3 className="card-title">{item.title}</h3>
        </Link>

        <div className="card-meta">
          {item.year > 0 && <span className="card-year">{item.year}</span>}
          {item.rating > 0 && (
            <span className="card-rating">
              <StarIcon /> {item.rating}/10
            </span>
          )}
        </div>

        {progress !== null && (
          <div className="card-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">
              {item.currentProgress}/{item.totalProgress} {item.progressType}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
