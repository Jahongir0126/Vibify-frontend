import React from "react"
import { useAuth } from "../../hooks/useAuth"

import "./Home.scss"

export default function Home() {
  const { user, logout, loading } = useAuth()
  // console.log(user);
  

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  if (loading) {
    return (
      <>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">Добро пожаловать!</h1>
                <div className="text-center mb-4">
                  <p className="lead">Привет, {user?.username}!</p>
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-danger btn-lg"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? 'Выход...' : 'Выйти'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


