import React from "react"
import { Route, Routes } from "react-router-dom"

import Private from "../Private/Private"
import Login from "../Pages/Auth/Login"
import Register from "../Pages/Auth/Register"
import Home from "../Pages/Home/Home"
import NotFound from "../Pages/Not-Found/NotFound"
import Profile from "../Pages/Profile/Profile"
import Chats from "../Pages/Chats/Chats"
import Challenges from "../Pages/Challenges/Challenges"
import Search from "../Pages/Search/Search"
import Settings from "../Pages/Settings/Settings"
import Notifications from "../Pages/Notifications/Notifications"
import MyLikes from "../Pages/MyLikes/MyLikes"

export default function RoutesWrapper({ isDarkMode, setIsDarkMode }) {
  return (
    <Routes>
      <Route path="/" element={<Private isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
        <Route index element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="profile" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="profile/:userId" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="chats" element={<Chats isDarkMode={isDarkMode} />} />
        <Route path="chats/:userId" element={<Chats isDarkMode={isDarkMode} />} />
        <Route path="challenges" element={<Challenges isDarkMode={isDarkMode} />} />
        <Route path="search" element={<Search isDarkMode={isDarkMode} />} />
        <Route path="settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="notifications" element={<Notifications isDarkMode={isDarkMode} />} />
        <Route path="favorites" element={<MyLikes isDarkMode={isDarkMode} />} />
      </Route>
      <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
      <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
      <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
    </Routes>
  )
}
