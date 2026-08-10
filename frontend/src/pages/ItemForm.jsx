import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLibraryItem,
  createLibraryItem,
  updateLibraryItem,
} from "../api/index.js";
import { FaCloudUploadAlt, FaHeart } from "react-icons/fa";
import "./ItemForm.css";

const CATEGORIES = ["Фільми", "Серіали", "Аніме", "Дорами", "Лакорни", "Манга", "Манхва", "Маньхуа", "Книги", "Ранобе", "Новели", "Комікси", "Фанфіки"];
const STATUSES = ["Планую", "У процесі", "Завершено"];
const PROGRESS_TYPES = ["", "епізодів", "сторінок", "глав", "томів"];

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  review: "",
  rating: 0,
  year: new Date().getFullYear(),
  status: "",
  currentProgress: "",
  totalProgress: "",
  progressType: "",
  isFavorite: false,
};

export default function ItemForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getLibraryItem(id)
        .then((item) => {
          setForm({
            title: item.title,
            category: item.category,
            description: item.description || "",
            review: item.review || "",
            rating: item.rating,
            year: item.year,
            status: item.status,
            currentProgress: item.currentProgress ?? "",
            totalProgress: item.totalProgress ?? "",
            progressType: item.progressType || "",
            isFavorite: item.isFavorite,
          });
          if (item.coverPath) setCoverPreview(item.coverPath);
        })
        .catch(() => navigate("/library"));
    }
  }, [id, isEditing, navigate]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCoverFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    handleCoverFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleCoverFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.status) {
      return setError("Заповніть обов'язкові поля: назва, категорія, статус");
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (coverFile) fd.append("cover", coverFile);

      if (isEditing) {
        await updateLibraryItem(id, fd);
      } else {
        await createLibraryItem(fd);
      }
      navigate("/library");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <div className="form-container">
        <p className="section-label">
          {isEditing ? "EDIT ITEM" : "NEW ITEM"}
        </p>
        <h1 className="form-title">
          {isEditing ? "Редагувати запис" : "Додати запис"}
        </h1>
        <p style={{ color: "var(--light-gray)", marginBottom: "28px", fontSize: "16px" }}>
          Заповни інформацію про фільм, книгу, дораму, мангу або інший тайтл.
        </p>

        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-grid">
            {/* Ліва колонка — обкладинка */}
            <div className="form-cover-col">
              <div
                className={`cover-upload ${dragOver ? "drag-over" : ""}`}
                onClick={() => document.getElementById("coverInput").click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Обкладинка"
                    className="cover-preview"
                  />
                ) : (
                  <div className="cover-placeholder">
                    <span className="upload-icon"><FaCloudUploadAlt /></span>
                    <h3>Перетягни обкладинку сюди</h3>
                    <p>або натисни для вибору файлу</p>
                  </div>
                )}
              </div>
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />
              {coverPreview && (
                <button
                  type="button"
                  className="cover-remove"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview("");
                  }}
                >
                  Видалити обкладинку
                </button>
              )}
            </div>

            {/* Правая колонка — поля */}
            <div className="form-fields-col">
              <div className="form-group">
                <label>Назва *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Назва тайтлу"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Категорія *</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                  >
                    <option value="">Обери категорію</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Статус *</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    required
                  >
                    <option value="">Обери статус</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Рейтинг (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.rating}
                    onChange={(e) => updateField("rating", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Рік</label>
                  <input
                    type="number"
                    min="1800"
                    max="2100"
                    value={form.year}
                    onChange={(e) => updateField("year", e.target.value)}
                  />
                </div>
              </div>

              {/* Прогресс */}
              <div className="form-group">
                <label>Тип прогресу</label>
                <select
                  value={form.progressType}
                  onChange={(e) => updateField("progressType", e.target.value)}
                >
                  {PROGRESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t || "— не відстежувати —"}
                    </option>
                  ))}
                </select>
              </div>

              {form.progressType && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Поточний ({form.progressType})</label>
                    <input
                      type="number"
                      min="0"
                      value={form.currentProgress}
                      onChange={(e) =>
                        updateField("currentProgress", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Всього ({form.progressType})</label>
                    <input
                      type="number"
                      min="0"
                      value={form.totalProgress}
                      onChange={(e) =>
                        updateField("totalProgress", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* Избранное */}
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={form.isFavorite}
                  onChange={(e) => updateField("isFavorite", e.target.checked)}
                />
                <span><FaHeart style={{ color: 'var(--red)', marginRight: '6px' }} /> Додати до обраного</span>
              </label>
            </div>
          </div>

          {/* Описание и отзыв — на всю ширину */}
          <div className="form-group">
            <label>Опис</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Короткий опис..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Мій відгук</label>
            <textarea
              value={form.review}
              onChange={(e) => updateField("review", e.target.value)}
              placeholder="Твої враження..."
              rows={4}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading
                ? "Зберігаємо..."
                : isEditing
                  ? "Зберегти зміни"
                  : "Додати до бібліотеки"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() =>
                navigate(isEditing ? `/library/${id}` : "/library")
              }
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
