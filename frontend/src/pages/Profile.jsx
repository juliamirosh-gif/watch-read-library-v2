import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../api/index.js'
import { useAuth } from '../context/AuthContext'
import { FaCamera, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import './Profile.css'

export default function Profile() {
  const { setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data)
      setUsername(data.username)
      if (data.avatarPath) setAvatarPreview(data.avatarPath)
    }).finally(() => setLoading(false))
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const fd = new FormData()
      fd.append('username', username)
      if (avatarFile) fd.append('avatar', avatarFile)

      const updated = await updateProfile(fd)
      setProfile(prev => ({ ...prev, ...updated }))
      setUser(prev => ({ ...prev, username: updated.username }))
      setMessage('Профіль оновлено!')
      setAvatarFile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Мій профіль</h1>

        <form onSubmit={handleSave} className="profile-form">
          {/* Аватар */}
          <div className="avatar-section">
            <div className="avatar-wrapper" onClick={() => document.getElementById('avatarInput').click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Аватар" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {profile.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="avatar-overlay"><FaCamera /></div>
            </div>
            <input id="avatarInput" type="file" accept="image/*"
              onChange={handleAvatarChange} style={{ display: 'none' }} />
            <p className="avatar-hint">Натисни на аватар, щоб змінити</p>
          </div>

          {/* Поля */}
          <div className="profile-fields">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={profile.email} disabled className="input-disabled" />
              <span className="field-hint">Email змінити не можна</span>
            </div>

            <div className="form-group">
              <label>Ім'я користувача</label>
              <input type="text" value={username}
                onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>

          {/* Статистика */}
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-number">{profile._count?.libraryItems || 0}</span>
              <span className="stat-label">Тайтлів у бібліотеці</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {new Date(profile.createdAt).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
              </span>
              <span className="stat-label">Дата реєстрації</span>
            </div>
          </div>

          {message && <div className="form-success"><FaCheckCircle /> {message}</div>}
          {error && <div className="form-error"><FaTimesCircle /> {error}</div>}

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Зберігаємо...' : 'Зберегти'}
          </button>
        </form>
      </div>
    </main>
  )
}
