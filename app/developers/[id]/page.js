'use client';

import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/Cards/ProjectCard';
import Badge from '@/components/Badge';
import Image from 'next/image';
import developersData from '@/data/developers.json';
import projectsData from '@/data/projects.json';

export default function DeveloperDetailPage({ params }) {
  const { language, t } = useLanguage();
  const resolvedParams = use(params);
  const developerId = parseInt(resolvedParams.id);
  const developer = developersData.find((d) => d.id === developerId);
  const projects = projectsData.filter((p) => p.developerId === developerId);
  const isRTL = language === 'ar';

  if (!developer) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'المطور غير موجود' : 'Developer not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Developer Header */}
      <section className="bg-white py-16 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={developer.logo || '/logos/default.png'}
                alt={t({ ar: developer.name_ar, en: developer.name_en })}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-right rtl:md:text-left">
              <div className="flex items-center justify-center md:justify-end rtl:md:justify-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {t({ ar: developer.name_ar, en: developer.name_en })}
                </h1>
                {developer.isPrimary && <Badge />}
              </div>
              <p className="text-lg text-gray-600 mb-6">
                {t({ ar: developer.description_ar, en: developer.description_en })}
              </p>
              <div className="flex items-center justify-center md:justify-end rtl:md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{developer.projectsCount || 0}</div>
                  <div className="text-gray-600">
                    {language === 'ar' ? 'مشروع' : 'Projects'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{developer.unitsCount || 0}</div>
                  <div className="text-gray-600">
                    {language === 'ar' ? 'وحدة متاحة' : 'Units Available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={language === 'ar' ? 'مشاريع المطور' : 'Developer Projects'}
            subtitle={language === 'ar' ? 'اكتشف جميع المشاريع' : 'Discover all projects'}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

