// frontend-user/src/components/Home/BannerSlider.jsx
import React from 'react';
import Slider from 'react-slick';
import { FiImage } from 'react-icons/fi';

const BannerSlider = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: true,
    pauseOnHover: true,
  };

   // Fixed getImageUrl function with proper null checks
   const getImageUrl = (imagePath) => {
     if (!imagePath || typeof imagePath !== 'string') return null;
     // Fix spaces in filename
     let cleanPath = imagePath;
     if (cleanPath.includes(' ')) {
       cleanPath = cleanPath.replace(/ /g, '%20');
     }
     if (cleanPath.startsWith('http')) return cleanPath;
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     return `${apiBaseUrl.replace('/api', '')}${cleanPath}`;
   };

   // Fixed getVideoUrl function
   const getVideoUrl = (videoPath) => {
     if (!videoPath || typeof videoPath !== 'string') return null;
     if (videoPath.startsWith('http')) return videoPath;
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     return `${apiBaseUrl.replace('/api', '')}${videoPath}`;
   };

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <FiImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our School</h1>
          <p className="text-xl">Quality Education for Better Future</p>
        </div>
      </div>
    );
  }

  return (
    <Slider {...settings} className="banner-slider">
      {banners.map((banner, index) => {
        const imageUrl = getImageUrl(banner.image_url);
        const videoUrl = getVideoUrl(banner.video_url);
        
        return (
          <div key={banner.id || index} className="relative h-[500px] md:h-[600px] overflow-hidden">
            {banner.is_video && videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Banner image failed to load:', imageUrl);
                  e.target.src = 'https://via.placeholder.com/1920x600?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                <FiImage className="w-20 h-20 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                {banner.title && (
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-lg md:text-xl animate-slide-up">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default BannerSlider;