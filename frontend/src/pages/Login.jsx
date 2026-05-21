import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const {token,setToken,navigate,backendUrl} = useContext(ShopContext)

    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [resetCode,setResetCode]=useState('')
    const [showPassword,setShowPassword]=useState(false)
    const [email,setEmail]=useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [fitnessPreferences, setFitnessPreferences] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const preferencesOptions = ['Weightlifting', 'Cardio', 'Yoga', 'CrossFit'];

    const isForgotPassword = currentState === 'Forgot Password';
    const isResetPassword = currentState === 'Reset Password';

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
    );

    const handlePreferenceChange = (pref) => {
        setFitnessPreferences(prev => 
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        if (isForgotPassword) {
            const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
            if (response.data.success) {
                toast.success(response.data.message);
                setCurrentState('Reset Password');
            } else {
                toast.error(response.data.message);
            }
        } else if (isResetPassword) {
            const response = await axios.post(backendUrl + '/api/user/reset-password', {
                email,
                code: resetCode,
                password
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setPassword('');
                setResetCode('');
                setCurrentState('Login');
            } else {
                toast.error(response.data.message);
            }
        } else if (currentState==='Sign Up') {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }
            formData.append('fitnessPreferences', JSON.stringify(fitnessPreferences));
            
            const response = await axios.post(
              backendUrl + '/api/user/register',
              formData,
              {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
              }
            )
            if (response.data.success) {
                setToken(response.data.token)
const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week

localStorage.setItem('token', response.data.token)
localStorage.setItem('tokenExpiry', expiryTime)                
toast.success('Account created successfully!')
            } else {
                toast.error(response.data.message)
            }

        } else {

            const response=await axios.post(backendUrl + '/api/user/login',{email,password},{ withCredentials: true } )
            if (response.data.success) {
                setToken(response.data.token)
const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week

localStorage.setItem('token', response.data.token)
localStorage.setItem('tokenExpiry', expiryTime)
                toast.success('Welcome back!')
            } else {
                toast.error(response.data.message)
            }

        }

      } catch (error) {
  console.log(error);

  // If backend sent a friendly message (like "Invalid email or password")
  const backendMessage = error.response?.data?.message;

  if (backendMessage) {
    toast.error(backendMessage);
  } else {
    // Fallback for network errors, etc.
    toast.error(error.message || "Something went wrong");
  }
      } finally {
        setIsSubmitting(false);
      }
  }

  useEffect(()=>{
    if (token) {
        navigate('/')
    }
  },[token])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 mx-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {currentState === 'Sign Up' && (
                <>
                <input 
                    id="signup-name"
                    name="name"
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    type="text" 
                    className='w-full px-3 py-2 border border-gray-800' 
                    placeholder='Full Name' 
                    required 
                />
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="signup-profile-picture" className='text-sm text-gray-600'>Profile Picture (Required for Virtual Try-On)</label>
                    <input 
                        id="signup-profile-picture"
                        name="profilePicture"
                        type="file" 
                        accept="image/*"
                        onChange={(e)=>setProfilePicture(e.target.files[0])}
                        className='w-full px-3 py-2 border border-gray-800 text-sm' 
                    />
                </div>
                <div className='w-full flex flex-col gap-2 mt-2'>
                    <label className='text-sm text-gray-600'>Primary Fitness Interests</label>
                    <div className='flex flex-wrap gap-2'>
                        {preferencesOptions.map(pref => (
                            <label key={pref} className='flex items-center gap-1 text-sm border px-2 py-1 cursor-pointer bg-gray-50 hover:bg-gray-100'>
                                <input 
                                    id={`signup-pref-${pref.toLowerCase()}`}
                                    name="fitnessPreferences"
                                    type="checkbox" 
                                    checked={fitnessPreferences.includes(pref)}
                                    onChange={() => handlePreferenceChange(pref)}
                                />
                                {pref}
                            </label>
                        ))}
                    </div>
                </div>
                </>
            )}
            <input 
                id="login-email"
                name="email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                type="email" 
                className='w-full px-3 py-2 border border-gray-800' 
                placeholder='Email'  
                required
            />
            {isResetPassword && (
                <input
                    id="reset-code"
                    name="resetCode"
                    onChange={(e)=>setResetCode(e.target.value)}
                    value={resetCode}
                    type="text"
                    className='w-full px-3 py-2 border border-gray-800'
                    placeholder='Reset code from email'
                    required
                />
            )}
            {!isForgotPassword && (
                <div className='relative w-full'>
                    <input
                        id="login-password"
                        name="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        className='w-full px-3 py-2 pr-11 border border-gray-800'
                        placeholder={isResetPassword ? 'New password' : 'Password'}
                        required
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black'
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <PasswordToggleIcon />
                    </button>
                </div>
            )}
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
    {currentState === 'Login'
    ? <p onClick={() => setCurrentState("Forgot Password")} className='cursor-pointer'>Forgot your password?</p>
    : <p onClick={() => setCurrentState("Login")} className='cursor-pointer'>Login Here</p>
    }
    {currentState === 'Login'
    ?<p onClick={() => setCurrentState("Sign Up")} className='cursor-pointer'>Create account</p>
    : <span />
    }
</div>
<button
  id="auth-submit-btn"
  disabled={isSubmitting}
  className='bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
>
  {isSubmitting
    ? 'Please wait...'
    : isForgotPassword ? 'Send Reset Code' : isResetPassword ? 'Change Password' : currentState === 'Login' ? 'Sign In' : 'Sign Up'
  }
</button>
        </form>
    );
};

export default Login;
