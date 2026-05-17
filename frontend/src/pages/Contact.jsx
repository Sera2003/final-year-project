import React from 'react';
import Title from '../components/Title';
import assets from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      
      <div className='my-10 flex flex-col items-center md:flex-row gap-10 mb-28'>
        <img 
          className='w-full md:max-w-[480px]' 
          src={assets.contact_img} 
          alt="Contact Wolfitness team" 
        />
        
        <div className='flex flex-col gap-4 justify-center'>
          <div>
            <p className='text-black-500'>ABC Mall, 3rd Floor</p>
            <p className='text-black-500'>Beirut Central District, Lebanon</p>
          </div>
          
          <div>
            <p className='text-black-500'>Tel: +961 1 999 999</p>
            <p className='text-black-500'>Email: info@wolfitness.com</p>
          </div>
          
      
        
        </div>
      </div>
      <NewsletterBox/>
    </div>
  );
};

export default Contact;