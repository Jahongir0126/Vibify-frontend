import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../Api";
import Header from "../../Components/Header/Header";
import "./Auth.scss"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const Navigate = useNavigate()

  async function handleForm(e) {
    e.preventDefault()

    if (username.trim().length === 0 || password.trim().length === 0) {

      toast.error("Fill Username or Password", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } else {
      const response = await api.login({ username,password})

      const conflictError = response.message
      const accessToken = response.data?.accessToken;

      if(conflictError){
        toast.error()
        toast.error(conflictError, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }

      if (accessToken) {
        
        localStorage.setItem("accessToken", accessToken)
        
        toast.success("Success login", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        setUsername("")
        setPassword("")
        setTimeout(()=>{        
          Navigate("/")
        },1400)
      } 
    }
  }


  return (
    <>
      <Header />
      <div className="d-flex justify-content-center align-items-center login">
        <form className='w-25' onSubmit={handleForm}>
          <h3 className='text-center mb-4'>Вход</h3>
          <div className="mb-3">
            <input
              value={username}
              type="text"
              name="username"
              placeholder="Введите E-mail"
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


          <div className="d-grid mt-4 ">
            <button type="submit" className="btn btn-dark rounded-0  fw-light mx-4 py-2">Войти</button>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Link to={"/register"} className="nav-link link-dark me-1" >Регистрация</Link>/
            <Link to={"/register"} className="nav-link link-dark ms-1" >Забыли пароль?</Link>
          </div>
        </form>
      </div>

    </>
  );
}
