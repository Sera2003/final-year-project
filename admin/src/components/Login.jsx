import axios from'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Login = ({setToken}) => {

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[showPassword,setShowPassword]=useState(false)

    const PasswordToggleIcon = () => (
      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
        {showPassword ? (
          <>
            <path d='M3 3l18 18' />
            <path d='M10.6 10.6a2 2 0 0 0 2.8 2.8' />
            <path d='M9.9 4.2A10.9 10.9 0 0 1 12 4c5 0 9.3 3.1 11 8a11.8 11.8 0 0 1-3.1 4.7' />
            <path d='M6.4 6.4A11.8 11.8 0 0 0 1 12c1.7 4.9 6 8 11 8 1.8 0 3.5-.4 5-1.2' />
          </>
        ) : (
          <>
            <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
            <circle cx='12' cy='12' r='3' />
          </>
        )}
      </svg>
    )


const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      backendUrl + "/api/user/admin",
      { email, password },
      { withCredentials: true }   // send / receive cookie
    );

    if (response.data.success) {
      setToken(response.data.token);         // just for UI
      toast.success("Admin logged in");
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    const backendMessage = error.response?.data?.message;
    toast.error(backendMessage || error.message || "Login failed");
  }
};

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <div className='relative'>
                          <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 pr-11 border border-gray-300 outline-none' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' required />
                          <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !prev)}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black'
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <PasswordToggleIcon />
                          </button>
                        </div>
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit">Login</button>
                </form>
            </div>

        </div>
    )
}
export default Login
