import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function PropertyImageGallery({ images, propertyName }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-[#efefef] to-[#cfcfcf] rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-[#6D6D6D] mx-auto mb-2"
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
          <p className="text-[#6D6D6D]">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative group">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          spaceBetween={10}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="property-main-swiper rounded-2xl overflow-hidden shadow-xl"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px]">
                <Image
                  src={img}
                  alt={`${propertyName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Thumbs]}
          freeMode={true}
          watchSlidesProgress={true}
          spaceBetween={12}
          slidesPerView="auto"
          className="property-thumbs-swiper"
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              className="!w-auto cursor-pointer"
            >
              <div
                className={`relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  activeIndex === index
                    ? 'border-[#f0cb8e] scale-105 shadow-lg'
                    : 'border-transparent hover:border-[#cfcfcf] opacity-70 hover:opacity-100'
                }`}
              >
                <Image
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
