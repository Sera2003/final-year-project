import React from 'react';
import Title from '../components/Title';
import assets from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img 
                    className='w-full md:max-w-[450px]' 
                    src={assets.about_img} 
                    alt="Wolfitness gym wear and equipment" 
                />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>
                        Wolfitness was born out of a passion for fitness innovation and a desire to revolutionize workout experiences. 
                        We specialize in high-performance gym wear and cutting-edge equipment designed to enhance every training session.
                    </p>
                    <p>
                        Since our inception, we've worked tirelessly to curate a diverse selection of premium fitness gear that combines 
                        style, functionality, and durability to help athletes at all levels achieve their goals.
                    </p>
                    <h3 className='text-gray-800 font-bold text-xl'>Our Mission</h3>
                    <p className='text-gray-600'>
                        Our mission at Wolfitness is to empower athletes and fitness enthusiasts with 
                        high-performance gym wear and innovative equipment that enhances every workout. 
                        We combine cutting-edge technology with premium materials to help you push beyond 
                        your limits.
                    </p>
                </div>
            </div>

            <div className='text-xl py-4'>
                <Title text1={"WHY"} text2={"CHOOSE WOLFITNESS"} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
                {/* Quality Assurance Section */}
                <div className='border px-6 md:px-8 py-8 flex flex-col gap-4'>
                    <b className='text-lg'>Quality Assurance</b>
                    <p className='text-gray-600'>
                        At Wolfitness, we rigorously test every piece of gym wear and equipment 
                        to ensure it meets our stringent durability and performance standards. 
                        From stress-testing weight plates to evaluating fabric endurance, 
                        we guarantee products that withstand intense workouts.
                    </p>
                </div>

                {/* Convenience Section */}
                <div className='border px-6 md:px-8 py-8 flex flex-col gap-4'>
                    <b className='text-lg'>Convenience</b>
                    <p className='text-gray-600'>
                        Wolfitness makes fitness effortless with our seamless shopping experience, fast shipping, 
                        and easy returns. Our versatile products adapt to any workout environment, from home gyms 
                        to professional training facilities, saving you time and hassle.
                    </p>
                </div>

                {/* Customer Service Section */}
                <div className='border px-6 md:px-8 py-8 flex flex-col gap-4'>
                    <b className='text-lg'>Exceptional Service</b>
                    <p className='text-gray-600'>
                        Our Wolfitness support team includes certified fitness experts available 24/7 to provide 
                        product recommendations, workout advice, and troubleshooting. We're committed to your 
                        complete satisfaction with personalized solutions.
                    </p>
                </div>
            </div>
            <NewsletterBox/>
        </div>
    );
};

export default About;