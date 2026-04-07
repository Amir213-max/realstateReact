/** Default CDN for Laravel `storage` paths (override with `REACT_APP_STORAGE_BASE_URL`). */
export const STORAGE_BASE_URL = 'https://keeper.in-brackets.online/storage';

export function getStorageBaseUrl() {
  const env =
    typeof process !== 'undefined' && process.env.REACT_APP_STORAGE_BASE_URL != null
      ? String(process.env.REACT_APP_STORAGE_BASE_URL).trim()
      : '';
  const base = env || STORAGE_BASE_URL;
  return base.replace(/\/+$/, '');
}

/** Build absolute URL under storage base (relative path from API). */
export function joinStorageRelativePath(relativePath) {
  if (relativePath == null) return '';
  let path = String(relativePath).trim().replace(/^\/+/, '');
  if (!path) return '';

  const base = getStorageBaseUrl().replace(/\/+$/, '');
  const baseEndsStorage = /\/storage$/i.test(base);
  if (baseEndsStorage && /^storage(\/|$)/i.test(path)) {
    path = path.replace(/^storage\/?/i, '');
  }

  return `${base}/${path}`.replace(/([^:]\/)\/+/g, '$1');
}

export function fixImageUrl(url) {
  if (url == null) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      if (/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)) {
        const pathOnly = `${u.pathname.replace(/^\/+/, '')}${u.search || ''}`;
        return joinStorageRelativePath(pathOnly);
      }
      const p = u.pathname;
      const lower = p.toLowerCase();
      const key = '/storage/';
      const i = lower.indexOf(key);
      if (i >= 0) {
        const afterStorage = p.slice(i + key.length);
        if (afterStorage) return joinStorageRelativePath(afterStorage);
      }
    } catch {
      /* ignore invalid URL */
    }
    return trimmed;
  }

  if (/^[\w.-]+\.[a-z]{2,}\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return joinStorageRelativePath(trimmed);
}

function collectProjectImageUrls(project) {
  const seen = new Set();
  const out = [];
  const push = (fixed) => {
    if (!fixed || seen.has(fixed)) return;
    seen.add(fixed);
    out.push(fixed);
  };

  const main = project.main_image ? fixImageUrl(project.main_image) : '';
  push(main);

  const units = project.units;
  if (!Array.isArray(units)) {
    return out.length ? out : main ? [main] : [];
  }

  for (const unit of units) {
    if (!unit) continue;
    if (unit.main_image) push(fixImageUrl(unit.main_image));
    const sorted = [...(unit.images || [])].sort(
      (a, b) => (a?.order || 0) - (b?.order || 0)
    );
    for (const img of sorted) {
      if (img?.image_path) push(fixImageUrl(img.image_path));
    }
  }

  return out.length ? out : main ? [main] : [];
}

export function transformProject(project, language = 'ar') {
  if (!project) return null;
  const mainImage = project.main_image ? fixImageUrl(project.main_image) : '';
  const images = collectProjectImageUrls(project);
  return {
    id: project.id,
    name_ar: project.name,
    name_en: project.name,
    description_ar: project.description || '',
    description_en: project.description || '',
    address_ar: project.address || '',
    address_en: project.address || '',
    images,
    main_image: mainImage || images[0] || '',
    latitude: project.latitude,
    longitude: project.longitude,
    unitsCount: project.unitsCount !== undefined ? project.unitsCount : (project.units?.length || 0),
    developerId: project.developers?.[0]?.id,
    destinationId: project.region?.id,
    whatsappNumber: project.developers?.[0]?.phone || '',
    region: project.region
      ? {
          id: project.region.id,
          name_ar: project.region.name,
          name_en: project.region.name,
        }
      : null,
    developers:
      project.developers?.map((d) => ({
        id: d.id,
        name_ar: d.name,
        name_en: d.name,
        logo: d.logo ? fixImageUrl(d.logo) : '',
      })) || [],
    viewsCount: project.views_count != null ? Number(project.views_count) : 0,
  };
}

export function transformRegion(region, language = 'ar') {
  if (!region) return null;
  const developers = new Set();
  region.projects?.forEach(project => {
    project.developers?.forEach(dev => developers.add(dev.id));
  });
  const regionImage = region.projects?.[0]?.main_image ? fixImageUrl(region.projects[0].main_image) : '';
  return {
    id: region.id,
    name_ar: region.name,
    name_en: region.name,
    description_ar: region.description || '',
    description_en: region.description || '',
    image: regionImage,
    developersCount: developers.size,
    projectsCount: region.projects?.length || 0,
    isFeatured: !!region.is_featured,
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
  const sortedImages = unit.images?.sort((a, b) => (a?.order || 0) - (b?.order || 0)) || [];
  const images = sortedImages.map(img => fixImageUrl(img.image_path));
  const mainImage = unit.main_image ? fixImageUrl(unit.main_image) : '';
  if (mainImage && !images.includes(mainImage)) images.unshift(mainImage);
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
    isAvailable: !!unit.is_available,
    isFeatured: !!unit.is_featured,
    type: unit.type,
    developerId: unit.developers?.[0]?.id,
    developerLogo: unit.developers?.[0]?.logo ? fixImageUrl(unit.developers[0].logo) : '',
    viewsCount: unit.views_count != null ? Number(unit.views_count) : 0,
    attributeValues: (unit.attributeValues || []).map((av) => ({
      id: av.id,
      value: av.value,
      attribute: av.attribute
        ? {
            id: av.attribute.id,
            name: av.attribute.name,
            slug: av.attribute.slug,
            type: av.attribute.type,
          }
        : null,
    })),
    project: unit.project ? transformProject(unit.project, language) : null,
  };
}

export function transformCountry(country) {
  if (!country) return null;
  return {
    id: country.id,
    name_ar: country.name,
    name_en: country.name,
    code: country.code || '',
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

