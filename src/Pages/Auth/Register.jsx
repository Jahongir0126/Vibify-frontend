import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { showToast } from '../../utils/toast'
import "./Auth.scss"

export default function Register() {
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")
  const { register } = useAuth()

  async function handleForm(e) {
    e.preventDefault()
    if (password.trim() !== checkPassword.trim()) {
      showToast.error("Пароли не совпадают")
      return
    }
    
    if (username.trim().length === 0 || password.trim().length === 0) {
      showToast.error("Заполните имя пользователя и пароль")
      return
    }

    await register({ username, password })
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center login">
        <form className='min-vw-25' onSubmit={handleForm}>
          <h3 className='text-center mb-4'>Регистрация</h3>
          <div className="mb-3">
            <input
              type="text"
              name='username'
              value={username}
              placeholder="Введите имя пользователя"
              className="form-control border-0 border-3 border-bottom"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name='password'
              value={password}
              placeholder="Введите пароль"
              className="form-control border-0 border-3 border-bottom"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={checkPassword}
              placeholder="Подтвердите пароль"
              className="form-control border-0 border-3 border-bottom"
              onChange={(e) => setCheckPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-dark rounded-0 fw-light mx-4 py-2">
              Зарегистрироваться
            </button>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <span className="text-muted me-2">Уже есть аккаунт?</span>
            <Link to="/login" className="nav-link link-dark">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
