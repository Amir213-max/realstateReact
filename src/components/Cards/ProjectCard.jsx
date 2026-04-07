'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/Badge';
import ImageWithLoader from '@/components/ui/ImageWithLoader';

export default function ProjectCard({ project, priority = false, size = 'md' }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link to={`/projects/${project.id}`} className="block h-full group/card">
      <Card hover className={`hover-lift h-full flex flex-col rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className={`relative ${size === 'sm' ? 'h-48 md:h-56 lg:h-64' : size === 'lg' ? 'h-80 md:h-96 lg:h-[28rem]' : 'h-72 md:h-80 lg:h-96'} w-full overflow-hidden bg-gradient-to-br from-bgSection to-borderColor flex-shrink-0`}>
          <ImageWithLoader
            src={project.images?.[0] || project.main_image || ''}
            alt={t({ ar: project.name_ar, en: project.name_en })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex flex-col gap-2 items-end">
            <Badge variant="secondary">
              {project.unitsCount || 0} {language === 'ar' ? 'وحدة' : 'Units'}
            </Badge>
            {project.viewsCount > 0 && (
              <Badge variant="secondary" className="inline-flex items-center gap-1 font-normal text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {project.viewsCount}
              </Badge>
            )}
          </div>
        </div>
        <div className={`${size === 'sm' ? 'p-4 md:p-5' : 'p-6 md:p-8'} flex-1 flex flex-col`}>
          <h3 className={`${size === 'sm' ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} font-bold text-textPrimary mb-2 group-hover/card:text-gold transition-colors duration-300`}>
            {t({ ar: project.name_ar, en: project.name_en })}
          </h3>
          <p className={`text-textSecondary ${size === 'sm' ? 'text-sm md:text-base mb-4' : 'text-base md:text-lg mb-6'} line-clamp-3 leading-relaxed`}>
            {t({ ar: project.description_ar, en: project.description_en })}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-borderColor mt-auto">
            <span className={`${size === 'sm' ? 'text-sm md:text-base' : 'text-base md:text-lg'} text-textSecondary truncate flex-1 mr-2`}>
              {t({ ar: project.address_ar, en: project.address_en })}
            </span>
            <span className={`text-gold font-semibold ${size === 'sm' ? 'text-sm md:text-base' : 'text-base md:text-lg'} whitespace-nowrap group-hover/card:translate-x-1 transition-transform duration-300 flex items-center gap-2`}>
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              <span className={`inline-block group-hover/card:translate-x-1 transition-transform duration-300 ${size === 'sm' ? 'text-lg' : 'text-xl'}`}>
                {isRTL ? '←' : '→'}
              </span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

