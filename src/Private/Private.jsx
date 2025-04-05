import React from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function Private({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();
  
  return (
    <>
      {localStorage.getItem("accessToken") ? (
        <Outlet context={{ isDarkMode, setIsDarkMode }} />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  )
}
