import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";


export default function Header() {

  return (

    <>
      <header >
        <nav className="navbar navbar-expand-lg container">
          <Link to="/" className="navbar-brand fw-light fs-3" >ChatApp</Link>
          <div className="container-fluid mx-4 m-2 hamburger_menu">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link link-dark link-opacity-75-hover">Home</Link>
                </li>
                <li>
                  <Link to="/profile" className="nav-link link-dark link-opacity-75-hover ">Profile</Link>
                </li>

              </ul>

              <form className="d-flex" role="search">
                <input className="form-control me-2 border-0 border-3 border-bottom" type="search" placeholder={"Поиск"} aria-label="Search" />
              </form>

            </div>
          </div>
          <div className="d-flex ">
            <Link to="/login" className="nav-link link-dark link-opacity-75-hover" >
              <FontAwesomeIcon icon={faUser} className="mx-3" />
            </Link>

          </div>
        </nav>
      </header>

    </>

  )
}
