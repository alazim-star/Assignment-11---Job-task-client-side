import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

// Banner Component
const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    const slides = [
        {
            id: 1,
            image: 'https://i.ibb.co/VY76pWxs/Citizen-engagement.jpg',
            title: 'Welcome to Our Website',
            description: 'Discover amazing features and services.',
        },
        {
            id: 2,
            image: 'https://i.ibb.co/TM5Ztg6x/cropped-comunity-handholding-small.png',
            title: 'Explore Our Products',
            description: 'Find the best products for your needs.',
        },
        {
            id: 3,
            image: 'https://i.ibb.co/5XL4JXVC/360-F-22920451-gz2-C8q-Ytp-Y8-Dcx-Q9-SKdl-NKC580n1cb-T8.jpg',
            title: 'Join Our Community',
            description: 'Connect with like-minded people.',
        },
    ];

    return (
        <div className="banner w-full">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 flex flex-col items-center justify-center text-white text-center px-6">
                            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide drop-shadow-lg bg-gradient-to-l from-pink-800 to-[#23085a] p-5">
                                {slide.title}
                            </h2>
                            <p className="mt-4 text-lg md:text-xl max-w-2xl bg-white/20 px-6 py-3 rounded-lg backdrop-blur-md shadow-lg">
                                {slide.description}
                            </p>
                          <Link to="/dashBoard/myTasks">   <button   className="px-4 py-3 mt-3 border-2 border-primary rounded-full bg-gradient-to-l from-pink-800 to-[#23085a] text-white shadow-xl transition duration-300">Explore More</button></Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Banner;
