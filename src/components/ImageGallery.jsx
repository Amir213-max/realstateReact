'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(() => images?.[0] || '');

  useEffect(() => {
    const first = images?.[0];
    if (!first) {
      setSelectedImage('');
      return;
    }
    setSelectedImage((prev) => (prev && images.includes(prev) ? prev : first));
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-bgSection to-borderColor-strong rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-textSecondary mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-textSecondary">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <ImageWithLoader
          src={selectedImage}
          alt="Main"
          fill
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={4}
          navigation
          className="h-24"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative w-full h-full rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImage === img ? 'border-blue-600' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(img)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(img)}
                role="button"
                tabIndex={0}
              >
                <ImageWithLoader
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
