import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../Api'

export default function Register() {
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")
  const Navigate = useNavigate()





  async function handleForm(e) {
    e.preventDefault()
    if(password.trim()!=checkPassword.trim()){
      toast.error("Password mismatch", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }else if (username.trim().length === 0 || password.trim().length === 0) {

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
      const response = await api.register({ username,password})

      const conflictError = response.message
      const accessToken = response.data?.accessToken;

      if(conflictError){
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
        setCheckPassword("")
        setTimeout(()=>{        
          Navigate("/")
        },1400)
      } 
    }
  }





  return (
    <>
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
          <div className="mb-4 d-flex align-items-center ms-3">
            <input
              type="checkbox"
              className="custom-control custom-checkbox me-2  "
              id="check"
            />
            <label htmlFor="check" className="custom-input-label my_check">Я согласен с политикой конфиденциальности и с обработкой персональных данных
            </label>
          </div>
          <div className="d-grid">
            <button className="btn btn-dark rounded-0   fw-light mx-4 py-2">Зарегистрироваться</button>
          </div>
        </form>
      </div>
    </>
  )
}
