import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.scss"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  async function handleForm(e) {
    e.preventDefault();
    if (username.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    
    await login({ username, password });
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center login">
        <form className='min-vw-25' onSubmit={handleForm}>
          <h3 className='text-center mb-4'>Вход</h3>
          <div className="mb-3">
            <input
              value={username}
              type="text"
              name="username"
              placeholder="Введите имя пользователя"
              className="form-control border-0 border-3 border-bottom"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              value={password}
              type="password"
              name="password"
              placeholder="Введите пароль"
              className="form-control border-0 border-3 border-bottom"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-dark rounded-0 fw-light mx-4 py-2">
              Войти
            </button>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Link to="/register" className="nav-link link-dark me-1">
              Регистрация
            </Link>
            /
            <Link to="/forgot-password" className="nav-link link-dark ms-1">
              Забыли пароль?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
