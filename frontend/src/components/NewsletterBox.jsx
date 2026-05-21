import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const NewsletterBox = () => {
    const { backendUrl } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isHidden, setIsHidden] = useState(() => localStorage.getItem('wolfNewsletterDiscountHidden') === 'true')

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true)
        try {
          const response = await axios.post(
            `${backendUrl}/api/newsletter/subscribe`,
            { email },
            { timeout: 15000 }
          )

          if (response.data.success) {
            toast.success(response.data.message)
            setEmail('')
            localStorage.setItem('wolfNewsletterDiscountHidden', 'true')
            setIsHidden(true)
          } else {
            toast.error(response.data.message || 'Failed to subscribe.')
          }
        } catch (error) {
          toast.error(error.code === 'ECONNABORTED' ? 'Email request timed out. Please check backend email settings.' : error.response?.data?.message || error.message || 'Failed to subscribe.')
        } finally {
          setIsSubmitting(false)
      }
    }

  if (isHidden) return null

  return (
    <div className='text-center'>
      <p className='text-2xl font_medium text-gray-800 '>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
      Get early access to our latest performance wear and special offers.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
      <input
        className='w-full sm:flex-1 outline-none'
        type="email"
        placeholder='Enter your email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-black text-white text-xs px-10 py-4 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSubmitting ? 'SENDING...' : 'SUBSCRIBE'}
      </button>

      </form>
    </div>
  )
}

export default NewsletterBox
