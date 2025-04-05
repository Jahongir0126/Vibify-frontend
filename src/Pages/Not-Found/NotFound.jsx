import React from 'react'
import { Link } from 'react-router-dom'

import Header from '../../Components/Header/Header'
import './NotFound.scss'

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="py-5 row justify-content-center">
          <div md={6}>
            <div className="text-center">
              <h1 className="display-4">404 - Page Not Found</h1>
              <p className="lead">Oops! The page you are looking for does not exist.</p>
              <p>Please check the URL or go back to the homepage.</p>
              <Link to={"/"}>
                <button className='btn btn-primary my-btn-not'>Go to Homepage</button>
              </Link>
            </div>
          </div >
        </div>
      </div>


    </>
  )
}
