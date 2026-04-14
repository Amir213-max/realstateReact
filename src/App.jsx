import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import BackToTop from '@/components/BackToTop';
import WhatsAppFloatFab from '@/components/WhatsAppFloatFab';
import PageLoadingFallback from '@/components/PageLoadingFallback';
import { lazyPage } from '@/lib/lazyPage';

const Home = lazyPage(() => import('@/pages/Home'), 'Home');
const About = lazyPage(() => import('@/pages/About'), 'About');
const Contact = lazyPage(() => import('@/pages/Contact'), 'Contact');
const Properties = lazyPage(() => import('@/pages/Properties'), 'Properties');
const PropertyDetail = lazyPage(() => import('@/pages/PropertyDetail'), 'PropertyDetail');
const Projects = lazyPage(() => import('@/pages/Projects'), 'Projects');
const ProjectDetail = lazyPage(() => import('@/pages/ProjectDetail'), 'ProjectDetail');
const Destinations = lazyPage(() => import('@/pages/Destinations'), 'Destinations');
const DestinationDetail = lazyPage(() => import('@/pages/DestinationDetail'), 'DestinationDetail');
const DeveloperDetail = lazyPage(() => import('@/pages/DeveloperDetail'), 'DeveloperDetail');
const UnitDetail = lazyPage(() => import('@/pages/UnitDetail'), 'UnitDetail');
const Offers = lazyPage(() => import('@/pages/Offers'), 'Offers');
const Sell = lazyPage(() => import('@/pages/Sell'), 'Sell');
const Rentals = lazyPage(() => import('@/pages/Rentals'), 'Rentals');
const NotFound = lazyPage(() => import('@/pages/NotFound'), 'NotFound');

export default function App() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <BackToTop />
      <WhatsAppFloatFab />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/developers/:id" element={<DeveloperDetail />} />
        <Route path="/units/:id" element={<UnitDetail />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
