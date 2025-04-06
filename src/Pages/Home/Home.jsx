import React from "react"
import Sidebar from "../../components/Sidebar/Sidebar"
import Hero from "../../components/Hero/Hero"
import Footer from "../../components/Footer/Footer"
import "./Home.scss"

export default function Home({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={`home-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar />
      <main className="main-content">
        <Hero />
      </main>
      <Footer 
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  )
}


