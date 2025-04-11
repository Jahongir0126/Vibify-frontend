import React from "react"
import Hero from '../../components/Hero/Hero'
import "./Home.scss"

export default function Home({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={`home-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Hero />

    </div>
  )
}


