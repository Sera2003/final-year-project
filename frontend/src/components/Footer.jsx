import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.wolflogo} className='mb-5 w-56' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Elevate your workout with premium gym wear designed for performance and style. 
                        Our collection combines cutting-edge fabrics with ergonomic designs to help you 
                        train harder and recover faster.
                    </p>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
                        <li><a href="/about" className="hover:text-gray-900 transition-colors">About us</a></li>
                        <li><a href="/delivery" className="hover:text-gray-900 transition-colors">Delivery</a></li>
                        <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy policy</a></li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><a href="mailto:contact@wolfitness.com" className="hover:text-gray-900 transition-colors">contact@wolfitness.com</a></li>
                        <li className='flex items-center gap-3 mt-3'>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <img src={assets.instagram_icon} className='w-8 h-8' alt="Instagram" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <img src={assets.facebook_icon} className='w-8 h-8' alt="Facebook" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
           
            <div>
                <hr />
                <p className="py-5 text-sm text-center text-gray-500">
                    Copyright 2025@ wolfitness.com All Rights Reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer