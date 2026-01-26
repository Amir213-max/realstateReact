// Transform GraphQL data to match existing component expectations

const STORAGE_BASE_URL = 'https://keeper.in-brackets.online/storage';

// Helper function to fix image URLs
function fixImageUrl(url) {
  if (!url) return '';
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Remove leading slash if present
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  // Add storage base URL
  return `${STORAGE_BASE_URL}/${cleanUrl}`;
}

export function transformProject(project, language = 'ar') {
  if (!project) return null;
  
  const mainImage = project.main_image ? fixImageUrl(project.main_image) : '';
  
  return {
    id: project.id,
    name_ar: project.name,
    name_en: project.name,
    description_ar: project.description || '',
    description_en: project.description || '',
    address_ar: project.address || '',
    address_en: project.address || '',
    images: mainImage ? [mainImage] : [],
    main_image: mainImage,
    latitude: project.latitude,
    longitude: project.longitude,
    // unitsCount will be set by the hook after fetching units separately
    unitsCount: project.unitsCount !== undefined ? project.unitsCount : (project.units?.length || 0),
    developerId: project.developers?.[0]?.id,
    destinationId: project.region?.id,
    whatsappNumber: project.developers?.[0]?.phone || '',
  };
}

export function transformRegion(region, language = 'ar') {
  if (!region) return null;
  
  // Get unique developers from projects
  const developers = new Set();
  region.projects?.forEach(project => {
    project.developers?.forEach(dev => developers.add(dev.id));
  });
  
  const regionImage = region.projects?.[0]?.main_image 
    ? fixImageUrl(region.projects[0].main_image) 
    : '';
  
  return {
    id: region.id,
    name_ar: region.name,
    name_en: region.name,
    description_ar: '',
    description_en: '',
    image: regionImage,
    developersCount: developers.size,
    projectsCount: region.projects?.length || 0,
  };
}

export function transformDeveloper(developer, language = 'ar') {
  if (!developer) return null;
  
  return {
    id: developer.id,
    name_ar: developer.name,
    name_en: developer.name,
    description_ar: developer.description || '',
    description_en: developer.description || '',
    logo: developer.logo ? fixImageUrl(developer.logo) : '',
    destinationId: developer.projects?.[0]?.region?.id,
    isPrimary: false,
    projectsCount: developer.projects?.length || 0,
    unitsCount: developer.units?.length || 0,
    website: developer.website,
    email: developer.email,
    phone: developer.phone,
  };
}

export function transformUnit(unit, language = 'ar') {
  if (!unit) return null;
  
  // Sort images by order first, then fix URLs
  const sortedImages = unit.images?.sort((a, b) => {
    return (a?.order || 0) - (b?.order || 0);
  }) || [];
  
  const images = sortedImages.map(img => fixImageUrl(img.image_path));
  
  const mainImage = unit.main_image ? fixImageUrl(unit.main_image) : '';
  if (mainImage && !images.includes(mainImage)) {
    images.unshift(mainImage);
  }
  
  return {
    id: unit.id,
    projectId: unit.project?.id || unit.project_id,
    name_ar: unit.name,
    name_en: unit.name,
    description_ar: unit.description || '',
    description_en: unit.description || '',
    price: unit.price,
    area: unit.area,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    images: images.length > 0 ? images : [],
    latitude: unit.project?.latitude,
    longitude: unit.project?.longitude,
    status: unit.is_available ? 'available' : 'sold',
    type: unit.type,
    developerId: unit.developers?.[0]?.id,
  };
}

export function transformProjects(projects, language = 'ar') {
  if (!projects) return [];
  const data = projects.data || projects;
  return data.map(p => transformProject(p, language));
}

export function transformRegions(regions, language = 'ar') {
  if (!regions) return [];
  return regions.map(r => transformRegion(r, language));
}

export function transformDevelopers(developers, language = 'ar') {
  if (!developers) return [];
  return developers.map(d => transformDeveloper(d, language));
}

export function transformUnits(units, language = 'ar') {
  if (!units) return [];
  const data = units.data || units;
  return data.map(u => transformUnit(u, language));
}
