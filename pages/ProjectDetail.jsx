import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import projectsData from '../data/projects.json';

export default function ProjectDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const project = projectsData.find(p => p.id === parseInt(id));
  const isRTL = language === 'ar';

  if (!project) {
    return (
      <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#1e1e1e] mb-4">
          {t({ ar: project.name_ar, en: project.name_en })}
        </h1>
        <p className="text-lg text-[#6D6D6D]">
          {t({ ar: project.description_ar, en: project.description_en })}
        </p>
      </div>
      <Footer />
    </div>
  );
}
