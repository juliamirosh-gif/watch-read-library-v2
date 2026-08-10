import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getLibrary } from '../api/index.js'
import LibraryCard from '../components/LibraryCard'
import { FaSearch, FaHeart, FaRegHeart, FaGhost } from 'react-icons/fa'
import './Library.css'

const CATEGORIES = [
  'Фільми','Серіали','Аніме','Дорами','Лакорни',
  'Манга','Манхва','Маньхуа','Книги','Ранобе','Новели','Комікси','Фанфіки'
]
const STATUSES = ['Планую', 'В процесі', 'Завершено']
const SORTS = [
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'year_new', label: 'Рік ↓' },
  { value: 'year_old', label: 'Рік ↑' },
  { value: 'title', label: 'За назвою' },
]

export default function Library() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    category: '', search: '', minRating: '',
    favorites: false, sort: 'newest'
  })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getLibrary(filters)
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <main className="library-page">
      <div className="library-header">
        <h1 className="library-title">Моя бібліотека</h1>
        <Link to="/library/new" className="btn-add">+ Додати</Link>
      </div>

      {/* Панель фильтров */}
      <section className="filters">
        {/* Поиск */}
        <div className="filter-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          {/* Категории */}
          <div className="filter-chips">
            <button
              className={`chip ${!filters.category ? 'chip-active' : ''}`}
              onClick={() => updateFilter('category', '')}
            >Всі</button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`chip ${filters.category === cat ? 'chip-active' : ''}`}
                onClick={() => updateFilter('category', cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Сортировка */}
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="filter-select"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Избранное */}
          <button
            className={`chip ${filters.favorites ? 'chip-active' : ''}`}
            onClick={() => updateFilter('favorites', !filters.favorites)}
          >
            {filters.favorites ? <><FaHeart style={{ color: 'var(--red)', marginRight: '5px' }} /> Обране</> : <><FaRegHeart style={{ marginRight: '5px' }} /> Обране</>}
          </button>
        </div>
      </section>

      {/* Результати */}
      {loading && (
        <div className="library-loading">
          <div className="spinner"></div>
        </div>
      )}

      {error && <div className="library-error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="library-empty">
          <p>Нічого не знайдено <FaGhost style={{ marginLeft: '5px' }} /></p>
          <Link to="/library/new" className="btn-primary">Додати перший тайтл</Link>
        </div>
      )}

      {!loading && (
        <div className="library-grid">
          {items.map(item => (
            <LibraryCard key={item.id} item={item} onUpdate={fetchItems} />
          ))}
        </div>
      )}
    </main>
  )
}
