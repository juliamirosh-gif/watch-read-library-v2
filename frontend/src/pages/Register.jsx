import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../api/index.js'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      return setError('Пароль має містити мінімум 6 символів')
    }
    setLoading(true)
    try {
      const data = await registerApi(email, username, password)
      login(data.token, data.user)
      navigate('/library')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Створити акаунт</h1>
          <p className="auth-subtitle">Почни вести свою бібліотеку</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="username">Ім'я користувача</label>
            <input id="username" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coolreader" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="мінімум 6 символів" required />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Створюємо...' : 'Зареєструватися'}
          </button>
        </form>

        <p className="auth-footer">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </main>
  )
}
