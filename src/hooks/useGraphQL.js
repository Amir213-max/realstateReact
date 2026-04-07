/**
 * All data is loaded via graphqlRequest() against REACT_APP_GRAPHQL_ENDPOINT (required).
 */
import { useState, useEffect, useMemo } from 'react';
import { graphqlRequest } from '@/lib/graphql';
import * as queries from '@/lib/queries';
import {
  transformProjects,
  transformRegions,
  transformDevelopers,
  transformUnits,
  transformProject,
  transformRegion,
  transformDeveloper,
  transformUnit,
  transformCountry,
} from '@/lib/dataTransform';
import { unwrapPaginated, paginatedTotal } from '@/lib/graphqlHelpers';

const DEFAULT_PROJECTS_PAGE_SIZE = 48;
const DEFAULT_SIMPLE_PAGE_SIZE = 36;

export function useProjects(regionId = null, options = {}) {
  const first = options.first ?? DEFAULT_PROJECTS_PAGE_SIZE;
  const page = options.page ?? 1;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_PROJECTS, {
          regionId: regionId || undefined,
          first,
          page,
        });
        if (data) {
          const transformed = transformProjects(data?.projects, 'ar');

          const projectsWithUnitsCount = await Promise.all(
            transformed.map(async (project) => {
              try {
                const unitsData = await graphqlRequest(queries.GET_UNITS_BY_PROJECT, {
                  project_id: project.id,
                  first: 1,
                  page: 1,
                });
                const unitsCount = paginatedTotal(unitsData?.units);
                return { ...project, unitsCount };
              } catch {
                return { ...project, unitsCount: project.unitsCount || 0 };
              }
            })
          );

          setProjects(projectsWithUnitsCount);
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [regionId, first, page]);

  return { projects, loading, error };
}

export function useProjectsSimple(options = {}) {
  const first = options.first ?? DEFAULT_SIMPLE_PAGE_SIZE;
  const page = options.page ?? 1;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_PROJECTS_SIMPLE, { first, page });

        if (data) {
          const transformed = transformProjects(data?.projects, 'ar');

          const projectsWithUnitsCount = await Promise.all(
            transformed.map(async (project) => {
              try {
                const unitsData = await graphqlRequest(queries.GET_UNITS_BY_PROJECT, {
                  project_id: project.id,
                  first: 1,
                  page: 1,
                });
                const unitsCount = paginatedTotal(unitsData?.units);
                return { ...project, unitsCount };
              } catch {
                return { ...project, unitsCount: 0 };
              }
            })
          );

          setProjects(projectsWithUnitsCount);
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [first, page]);

  return { projects, loading, error };
}

export function useMostBrowsedProjects(count = 10, regionId = null) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMostBrowsed() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_MOST_BROWSED_PROJECTS, {
          first: count,
          regionId: regionId || undefined,
        });
        const { items: raw } = unwrapPaginated(data?.mostBrowsedProjects);
        const transformed = raw.map((p) => {
          const t = transformProject(p, 'ar');
          const n = p.units?.length ?? 0;
          return { ...t, unitsCount: t.unitsCount || n };
        });
        setProjects(transformed);
      } catch (err) {
        setError(err.message || 'Failed to load most browsed projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMostBrowsed();
  }, [count, regionId]);

  return { projects, loading, error };
}

export function useMostBrowsedUnits(count = 10, projectId = null) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMostBrowsedUnits() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_MOST_BROWSED_UNITS, {
          first: count,
          projectId: projectId ? String(projectId) : undefined,
        });
        const raw = data?.mostBrowsedUnits;
        const list = Array.isArray(raw) ? raw : [];
        setUnits(transformUnits(list, 'ar'));
      } catch (err) {
        setError(err.message || 'Failed to load most browsed units');
        setUnits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMostBrowsedUnits();
  }, [count, projectId]);

  return { units, loading, error };
}

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_COUNTRIES);
        const list = data?.countries;
        const arr = Array.isArray(list) ? list : [];
        setCountries(arr.map((c) => transformCountry(c)).filter(Boolean));
      } catch (err) {
        setError(err.message || 'Failed to load countries');
        setCountries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return { countries, loading, error };
}

export function useSettingsGroup(group) {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!group) {
      setLoading(false);
      return;
    }

    async function fetchGroup() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_SETTINGS_BY_GROUP, { group });
        const list = data?.settings;
        setSettings(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.message || 'Failed to load settings');
        setSettings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [group]);

  return { settings, loading, error };
}

export function useOfferProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_UNITS, {
          isFeatured: true,
          first: 120,
          page: 1,
        });
        const { items: rawUnits } = unwrapPaginated(data?.units);
        const seen = new Set();
        const list = [];
        for (const raw of rawUnits) {
          if (!raw?.project) continue;
          const id = String(raw.project.id);
          if (seen.has(id)) continue;
          seen.add(id);
          list.push(transformProject(raw.project, 'ar'));
        }
        setProjects(list);
      } catch (err) {
        setError(err.message || 'Failed to load offers');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  return { projects, loading, error };
}

export function useSiteSetting(group, key) {
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!group || !key) {
      setLoading(false);
      return;
    }

    async function fetchSetting() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_SETTING, { group, key });
        setSetting(data?.getSetting ?? null);
      } catch (err) {
        setError(err.message || 'Failed to load setting');
        setSetting(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSetting();
  }, [group, key]);

  return { setting, loading, error };
}

export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_PROJECT, { id: String(id) });
        if (data && data.project) {
          const transformed = transformProject(data.project, 'ar');
          setProject(transformed);
        } else {
          setProject(null);
        }
      } catch (err) {
        setError(err.message);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  return { project, loading, error };
}

export function useRegions(countryId = null, isFeatured = null) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_REGIONS, {
          countryId: countryId || undefined,
          isFeatured: isFeatured === null ? undefined : isFeatured,
        });
        if (data) {
          const { items: regionItems } = unwrapPaginated(data?.regions);
          const transformed = transformRegions(regionItems, 'ar');
          setRegions(transformed);
        } else {
          setRegions([]);
        }
      } catch (err) {
        setError(err.message);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, [countryId, isFeatured]);

  return { regions, loading, error };
}

export function useRegion(id) {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchRegion() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_REGION, { id: String(id) });
        if (data) {
          const transformed = transformRegion(data?.region, 'ar');
          setRegion(transformed);
        } else {
          setRegion(null);
        }
      } catch (err) {
        setError(err.message);
        setRegion(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRegion();
  }, [id]);

  return { region, loading, error };
}

export function useDevelopers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDevelopers() {
      try {
        setLoading(true);
        setError(null);
        const result = await graphqlRequest(queries.GET_DEVELOPERS);

        if (result && result.developers != null) {
          const { items } = unwrapPaginated(result.developers);
          const transformed = transformDevelopers(items, 'ar');
          setDevelopers(transformed);
        } else {
          setDevelopers([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch developers');
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDevelopers();
  }, []);

  return { developers, loading, error };
}

export function useDeveloper(id) {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchDeveloper() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_DEVELOPER, { id: String(id) });
        if (data) {
          const transformed = transformDeveloper(data?.developer, 'ar');
          setDeveloper(transformed);
        } else {
          setDeveloper(null);
        }
      } catch (err) {
        setError(err.message);
        setDeveloper(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDeveloper();
  }, [id]);

  return { developer, loading, error };
}

export function useUnits(filters = {}) {
  const first = filters.first ?? 12;
  const page = filters.page ?? 1;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginatorInfo, setPaginatorInfo] = useState(null);

  const depKey = useMemo(
    () =>
      JSON.stringify({
        type: filters.type || null,
        isAvailable: filters.isAvailable,
        isFeatured: filters.isFeatured,
        isRentable: filters.isRentable,
        projectId: filters.projectId || null,
        developerId: filters.developerId || null,
        first,
        page,
      }),
    [
      filters.type,
      filters.isAvailable,
      filters.isFeatured,
      filters.isRentable,
      filters.projectId,
      filters.developerId,
      first,
      page,
    ]
  );

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        setError(null);
        const variables = {
          type: filters.type || undefined,
          isAvailable: filters.isAvailable !== undefined ? filters.isAvailable : undefined,
          isFeatured: filters.isFeatured !== undefined ? filters.isFeatured : undefined,
          isRentable: filters.isRentable !== undefined ? filters.isRentable : undefined,
          projectId: filters.projectId ? String(filters.projectId) : undefined,
          developerId: filters.developerId ? String(filters.developerId) : undefined,
          first,
          page,
        };
        const data = await graphqlRequest(queries.GET_UNITS, variables);
        if (data) {
          const { items, paginatorInfo } = unwrapPaginated(data?.units);
          const transformed = transformUnits(items, 'ar');
          setUnits(transformed);
          setPaginatorInfo(paginatorInfo);
        } else {
          setUnits([]);
          setPaginatorInfo(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load units');
        setUnits([]);
        setPaginatorInfo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, [depKey]);

  return { units, loading, error, paginatorInfo };
}

export function useUnit(id) {
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchUnit() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_UNIT, { id: String(id) });
        if (data) {
          const transformed = transformUnit(data?.unit, 'ar');
          setUnit(transformed);
        } else {
          setUnit(null);
        }
      } catch (err) {
        setError(err.message);
        setUnit(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUnit();
  }, [id]);

  return { unit, loading, error };
}
