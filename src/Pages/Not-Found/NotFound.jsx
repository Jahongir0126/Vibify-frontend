import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.scss'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>
          <div className="error-actions">
            <Link to="/" className="home-button">
              Return to Homepage
            </Link>
            <button onClick={() => window.history.back()} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
