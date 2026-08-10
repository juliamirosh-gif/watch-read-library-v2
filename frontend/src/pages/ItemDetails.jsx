import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLibraryItem, deleteLibraryItem } from "../api/index.js";
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
  FaHeart,
  FaStar,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import "./ItemDetails.css";

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

const FavoriteIcon = () => <FaHeart />;
const StarIcon = () => <FaStar />;
const EditIcon = () => <FaEdit />;
const DeleteIcon = () => <FaTrash />;
const BackIcon = () => <FaArrowLeft />;

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getLibraryItem(id)
      .then(setItem)
      .catch(() => navigate("/library"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm(`Видалити "${item.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteLibraryItem(id);
      navigate("/library");
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  if (!item) return null;

  const progress =
    item.totalProgress && item.currentProgress
      ? Math.round((item.currentProgress / item.totalProgress) * 100)
      : null;

  return (
    <main className="details-page">
      <div className="details-container">
        {/* Обложка */}
        <div className="details-cover">
          {item.coverPath ? (
            <img src={item.coverPath} alt={item.title} />
          ) : (
            <div className="details-cover-placeholder">
              <CategoryIcon category={item.category} />
            </div>
          )}
        </div>

        <div className="details-info">
          <div className="details-meta-top">
            <span className="details-category">
              <CategoryIcon category={item.category} /> {item.category}
            </span>
            {item.isFavorite && (
              <span className="details-favorite">
                <FavoriteIcon /> Обране
              </span>
            )}
          </div>

          <h1 className="details-title">{item.title}</h1>

          <div className="details-badges">
            <span className="badge-status">{item.status}</span>
            {item.year > 0 && <span className="badge-year">{item.year}</span>}
            {item.rating > 0 && (
              <span className="badge-rating">
                <StarIcon /> {item.rating}/10
              </span>
            )}
          </div>

          {progress !== null && (
            <div className="details-progress">
              <div className="progress-label">
                Прогрес: {item.currentProgress} / {item.totalProgress}{" "}
                {item.progressType}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-percent">{progress}%</span>
            </div>
          )}

          {item.description && (
            <div className="details-section">
              <h2>Опис</h2>
              <p>{item.description}</p>
            </div>
          )}

          {item.review && (
            <div className="details-section details-review">
              <h2>Мій відгук</h2>
              <p>{item.review}</p>
            </div>
          )}

          <div className="details-actions">
            <Link to={`/library/${id}/edit`} className="btn-edit">
              <EditIcon /> Редагувати
            </Link>
            <button
              onClick={handleDelete}
              className="btn-delete"
              disabled={deleting}
            >
              {deleting ? (
                "Видаляємо..."
              ) : (
                <>
                  <DeleteIcon /> Видалити
                </>
              )}
            </button>
            <Link to="/library" className="btn-back">
              <BackIcon /> Назад
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
