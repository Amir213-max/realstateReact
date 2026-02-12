'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Card from '../ui/Card';
import Badge from '../Badge';
import ImageWithLoader from '../ui/ImageWithLoader';

export default function ProjectCard({ project, priority = false }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/projects/${project.id}`} className="block h-full group">
      <Card hover className={`hover-lift h-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-72 md:h-80 lg:h-96 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
          <ImageWithLoader
            src={project.images?.[0] || project.main_image || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
            alt={t({ ar: project.name_ar, en: project.name_en })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            onError={(e) => {
              e.target.src = 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv';
            }}
          />
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
            <Badge variant="secondary">
              {project.unitsCount || 0} {language === 'ar' ? 'وحدة' : 'Units'}
            </Badge>
          </div>
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-4 group-hover:text-[#f0cb8e] transition-colors duration-300">
            {t({ ar: project.name_ar, en: project.name_en })}
          </h3>
          <p className="text-[#6D6D6D] text-base md:text-lg mb-6 line-clamp-3 leading-relaxed">
            {t({ ar: project.description_ar, en: project.description_en })}
          </p>
          <div className="flex items-center justify-between pt-5 border-t border-[#efefef] mt-auto">
            <span className="text-base md:text-lg text-[#6D6D6D] truncate flex-1 mr-2">
              {t({ ar: project.address_ar, en: project.address_en })}
            </span>
            <span className="text-[#f0cb8e] font-semibold text-base md:text-lg whitespace-nowrap group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              <span className="inline-block group-hover:translate-x-1 transition-transform duration-300 text-xl">
                {isRTL ? '←' : '→'}
              </span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
