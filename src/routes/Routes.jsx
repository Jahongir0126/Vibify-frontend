import React from "react"
import { Route, Routes } from "react-router-dom"

import Private from "../Private/Private"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Home from "../pages/Home/Home"
import NotFound from "../pages/Not-Found/NotFound"
import Profile from "../pages/Profile/Profile"
import Chats from "../pages/Chats/Chats"
import Challenges from "../pages/Challenges/Challenges"
import Search from "../pages/Search/Search"
import Settings from "../pages/Settings/Settings"

export default function RoutesWrapper({ isDarkMode, setIsDarkMode }) {
  return (
    <Routes>
      <Route path="/" element={<Private isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
        <Route index element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="profile" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="profile/:userId" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="chats" element={<Chats isDarkMode={isDarkMode} />} />
        <Route path="challenges" element={<Challenges isDarkMode={isDarkMode} />} />
        <Route path="search" element={<Search isDarkMode={isDarkMode} />} />
        <Route path="settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      </Route>
      <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
      <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
      <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
    </Routes>
  )
}
