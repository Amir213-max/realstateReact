import { useRef, useEffect, useMemo, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y, Virtual } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import ProjectCard from '@/components/Cards/ProjectCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

const SlideItem = memo(({ project, index }) => (
  <SwiperSlide style={{ height: 'auto' }}>
    <div className="h-full w-full">
      <ProjectCard project={project} priority={index === 0} />
    </div>
  </SwiperSlide>
));

SlideItem.displayName = 'SlideItem';

export default function ProjectsSwiper({
  projects,
  className = '',
  showNavigation = true,
  showPagination = true,
  autoplay = true,
}) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const swiperRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;

      const handleChange = (e) => {
        prefersReducedMotion.current = e.matches;
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const direction = isRTL ? 'rtl' : 'ltr';

      if (swiper.autoplay && typeof swiper.autoplay.stop === 'function') {
        try {
          swiper.autoplay.stop();
        } catch (e) {
          console.warn('Error stopping autoplay:', e);
        }
      }

      if (swiper.changeDirection && typeof swiper.changeDirection === 'function') {
        try {
          swiper.changeDirection(direction);
        } catch (e) {
          console.warn('Error changing direction:', e);
        }
      }

      if (swiper.update && typeof swiper.update === 'function') {
        swiper.update();
      }
      if (swiper.updateSlides && typeof swiper.updateSlides === 'function') {
        swiper.updateSlides();
      }
      if (swiper.updateSlidesClasses && typeof swiper.updateSlidesClasses === 'function') {
        swiper.updateSlidesClasses();
      }

      if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
        setTimeout(() => {
          try {
            swiper.autoplay.start();
          } catch (e) {
            console.warn('Error starting autoplay:', e);
          }
        }, 300);
      }
    }
  }, [isRTL, language]);

  const useVirtual = useMemo(() => projects.length > 8, [projects.length]);

  const modules = useMemo(() => {
    const baseModules = [Navigation, Pagination, A11y];
    if (autoplay && !prefersReducedMotion.current) {
      baseModules.push(Autoplay);
    }
    if (useVirtual) {
      baseModules.push(Virtual);
    }
    return baseModules;
  }, [autoplay, useVirtual]);

  const autoplayConfig = useMemo(() => {
    if (!autoplay || prefersReducedMotion.current) return false;

    return {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: isRTL,
    };
  }, [autoplay, isRTL]);

  const navigationConfig = useMemo(() => {
    if (!showNavigation) return false;

    return {
      nextEl: '.projects-swiper-button-next',
      prevEl: '.projects-swiper-button-prev',
      disabledClass: 'swiper-button-disabled',
    };
  }, [showNavigation]);

  const paginationConfig = useMemo(() => {
    if (!showPagination) return false;

    return {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3,
      renderBullet: (index, className) => {
        return `<span class="${className}" role="button" aria-label="Go to slide ${index + 1}" tabindex="0"></span>`;
      },
    };
  }, [showPagination]);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section
      className={`projects-swiper-section ${className}`}
      aria-label={isRTL ? 'مشاريع جديدة' : 'New Projects'}
    >
      <div className="relative">
        <Swiper
          modules={modules}
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          centeredSlidesBounds={true}
          speed={700}
          grabCursor={true}
          loop={projects.length > 3}
          loopAdditionalSlides={2}
          watchSlidesProgress={true}
          effect="slide"
          resistance={true}
          resistanceRatio={0.85}
          touchRatio={1}
          touchAngle={45}
          simulateTouch={true}
          allowTouchMove={true}
          observer={true}
          observeParents={true}
          updateOnWindowResize={true}
          virtual={
            useVirtual
              ? {
                  enabled: true,
                  addSlidesBefore: 2,
                  addSlidesAfter: 2,
                }
              : false
          }
          navigation={navigationConfig}
          pagination={paginationConfig}
          autoplay={autoplayConfig}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="projects-swiper"
          key={`swiper-${language}-${isRTL}`}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            const direction = isRTL ? 'rtl' : 'ltr';
            if (swiper.changeDirection) {
              swiper.changeDirection(direction);
            }
            swiper.update();
          }}
          onInit={(swiper) => {
            const direction = isRTL ? 'rtl' : 'ltr';
            if (swiper.changeDirection) {
              swiper.changeDirection(direction);
            }
            swiper.update();
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
              centeredSlides: false,
            },
            1440: {
              slidesPerView: 4,
              spaceBetween: 28,
              centeredSlides: false,
            },
          }}
        >
          {projects.map((project, index) => (
            <SlideItem key={project.id} project={project} index={index} />
          ))}
        </Swiper>

        {showNavigation && (
          <div className={`flex items-center justify-center gap-4 mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              className="projects-swiper-button-prev w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gold active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              aria-label={isRTL ? 'السابق' : 'Previous slide'}
            >
              <svg
                className="w-6 h-6 text-textPrimary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isRTL ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                />
              </svg>
            </button>
            <button
              type="button"
              className="projects-swiper-button-next w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gold active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              aria-label={isRTL ? 'التالي' : 'Next slide'}
            >
              <svg
                className="w-6 h-6 text-textPrimary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
