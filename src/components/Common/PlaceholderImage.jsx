// frontend-user/src/components/Common/PlaceholderImage.jsx
import React from 'react';
import { FiImage } from 'react-icons/fi';

const PlaceholderImage = ({ text = "No Image", className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center ${className}`}>
      <FiImage className="w-12 h-12 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm">{text}</span>
    </div>
  );
};

export default PlaceholderImage;