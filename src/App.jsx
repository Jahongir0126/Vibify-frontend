import React from 'react';
import { BrowserRouter } from "react-router-dom"
import RoutesWrapper from "./routes/Routes"
import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <RoutesWrapper />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App
