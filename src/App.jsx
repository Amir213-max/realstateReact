import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import BackToTop from '@/components/BackToTop';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Properties = lazy(() => import('@/pages/Properties'));
const PropertyDetail = lazy(() => import('@/pages/PropertyDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'));
const DeveloperDetail = lazy(() => import('@/pages/DeveloperDetail'));
const UnitDetail = lazy(() => import('@/pages/UnitDetail'));
const Offers = lazy(() => import('@/pages/Offers'));
const Sell = lazy(() => import('@/pages/Sell'));
const Rentals = lazy(() => import('@/pages/Rentals'));

function PageFallback() {
  return (
    <div
      style={{ minHeight: '60vh' }}
      className="flex items-center justify-center bg-bgSection text-textSecondary"
    >
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BackToTop />
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
      </Routes>
    </Suspense>
  );
}
