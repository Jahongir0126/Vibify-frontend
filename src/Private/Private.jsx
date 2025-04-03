import React from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function Private() {
  return (
    <>{localStorage.getItem("accessToken") ? <Outlet /> : <Navigate to="/login" />}</>
  )
}
