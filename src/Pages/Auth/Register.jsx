import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import api from '../../Api'
import "./Auth.scss"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")
  const Navigate = useNavigate()

  async function handleForm(e) {
    e.preventDefault()
    const trimmedUsername = username.replace(/\s+/g, '');

    if (password.trim() != checkPassword.trim()) {
      showToast.error("Password mismatch");
    } else if (trimmedUsername.length === 0 || password.trim().length === 0) {
      showToast.error("Fill Username or Password");
    } else {
      const response = await api.register({ username:trimmedUsername, password });
      const conflictError = response.message;
      const accessToken = response.data?.accessToken;

      if (conflictError) {
        showToast.error(conflictError);
      }

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        showToast.success("Success registration");
        setUsername("");
        setPassword("");
        setCheckPassword("");
        setTimeout(() => {
          Navigate("/");
        }, 1400);
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center login">
      <form className='w-25' onSubmit={handleForm}>
        <h3 className='text-center mb-4'>Регистрация</h3>
        <div className="mb-3">
          <input
            type="text"
            name='username'
            value={username}
            placeholder="Введите Имя пользователя"
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
        <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
        <div className="mt-3 text-center">
          <Link to="/login">Уже есть аккаунт? Войти</Link>
        </div>
      </form>
    </div>
  );
}
