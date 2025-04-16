import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../Api";
import "./Auth.scss"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const Navigate = useNavigate()
  const { login } = useAuth()

  async function handleForm(e) {
    e.preventDefault()

    if (username.trim().length === 0 || password.trim().length === 0) {
      showToast.error("Fill Username or Password");
    } else {
      const response = await api.login({ username, password });
      const conflictError = response.message;
      const accessToken = response.data?.accessToken;

      if (conflictError) {
        showToast.error(conflictError);
      }

      if (accessToken) {
        login(accessToken, {
          username: username,
          email: response.data?.email || username + '@example.com'
        });
        showToast.success("Success login");
        setUsername("");
        setPassword("");
        setTimeout(() => {
          Navigate("/");
        }, 1400);
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center login">
      <form className='w-25' onSubmit={handleForm}>
        <h3 className='text-center mb-4'>Вход</h3>
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
        <div className="mb-4">
          <input
            type="password"
            name='password'
            value={password}
            placeholder="Введите пароль"
            className="form-control border-0 border-3 border-bottom"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Войти</button>
        <div className="mt-3 text-center">
          <Link to="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}
