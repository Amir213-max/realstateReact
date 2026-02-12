'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import Card from '../ui/Card';
import Badge from '../Badge';

export default function ProjectCard({ project, priority = false }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover className={`hover-lift ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-56 w-full overflow-hidden bg-gray-200">
          <Image
            src={project.images?.[0] || project.main_image || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
            alt={t({ ar: project.name_ar, en: project.name_en })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#1e1e1e] mb-3">
            {t({ ar: project.name_ar, en: project.name_en })}
          </h3>
          <p className="text-[#6D6D6D] text-sm mb-4 line-clamp-2 leading-relaxed">
            {t({ ar: project.description_ar, en: project.description_en })}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-[#efefef]">
            <span className="text-sm text-[#6D6D6D]">
              {t({ ar: project.address_ar, en: project.address_en })}
            </span>
            <span className="text-[#f0cb8e] font-semibold text-sm">
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'} →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
