import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Users from './pages/Users'
import Reviews from './pages/Reviews'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl=import.meta.env.VITE_BACKEND_URL
export const currency ='$'
const App = () => {

const getStoredToken = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token || !expiry) return "";

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return "";
  }

  return token;
};

const [token, setToken] = useState(getStoredToken());
useEffect(() => {
  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
  }
}, [token]);


  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken}/>
        : <>
          <Navbar setToken={setToken}/>
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[82%] mx-auto px-8 my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/dashboard' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token}/>} />
                <Route path='/list' element={<List token={token}/>} />
                <Route path='/orders' element={<Orders token={token}/>} />
              <Route path='/users' element={<Users token={token}/>} />
              <Route path='/reviews' element={<Reviews token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}
export default App