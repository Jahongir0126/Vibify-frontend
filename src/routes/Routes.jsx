import React from "react"
import { Route, Routes } from "react-router-dom"

import Private from "../Private/Private"
import Login from "../Pages/Auth/Login"
import Register from "../Pages/Auth/Register"
import Home from "../Pages/Home/Home"

export default function RoutesWrapper() {
  return ( 
    <Routes>
      <Route path="/" element={<Private />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="*" element={<NotFound/>} /> */}

      
    </Routes>
  )
}
