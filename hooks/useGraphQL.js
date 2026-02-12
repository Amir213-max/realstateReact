import { useState, useEffect } from 'react';
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
} from '@/lib/dataTransform';

export function useProjects(regionId = null) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_PROJECTS, { regionId: regionId || undefined });
        if (data) {
          const transformed = transformProjects(data?.projects?.data || [], 'ar');
          
          // Fetch units count for each project
          const projectsWithUnitsCount = await Promise.all(
            transformed.map(async (project) => {
              try {
                const unitsData = await graphqlRequest(queries.GET_UNITS_BY_PROJECT, {
                  project_id: project.id,
                });
                const unitsCount = unitsData?.units?.paginatorInfo?.total || unitsData?.units?.data?.length || 0;
                return {
                  ...project,
                  unitsCount,
                };
              } catch (err) {
                console.error(`Error fetching units count for project ${project.id}:`, err);
                // Fallback to units from project data if available
                return {
                  ...project,
                  unitsCount: project.unitsCount || 0,
                };
              }
            })
          );
          
          setProjects(projectsWithUnitsCount);
        } else {
          // API not available or error - set empty array
          setProjects([]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [regionId]);

  return { projects, loading, error };
}

// Hook for simple projects query (without region filter)
export function useProjectsSimple() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_PROJECTS_SIMPLE);
        
        // Log the raw API response to console
        console.group('📊 PROJECTS OUTPUT - Raw API Response');
        console.log('Full API Response:', JSON.stringify(data, null, 2));
        if (data?.projects?.data) {
          console.log('Projects Count:', data.projects.data.length);
          console.log('Projects Data:', data.projects.data);
          data.projects.data.forEach((project, index) => {
            console.log(`Project ${index + 1}:`, {
              id: project.id,
              name: project.name,
              description: project.description,
              address: project.address,
              main_image: project.main_image,
              region: project.region?.name,
              country: project.region?.country?.name,
              developers: project.developers?.map(d => d.name),
              created_at: project.created_at,
            });
          });
        }
        console.groupEnd();
        
        if (data) {
          const transformed = transformProjects(data?.projects?.data || [], 'ar');
          
          // Fetch units count for each project
          const projectsWithUnitsCount = await Promise.all(
            transformed.map(async (project) => {
              try {
                const unitsData = await graphqlRequest(queries.GET_UNITS_BY_PROJECT, {
                  project_id: project.id,
                });
                const unitsCount = unitsData?.units?.paginatorInfo?.total || unitsData?.units?.data?.length || 0;
                return {
                  ...project,
                  unitsCount,
                };
              } catch (err) {
                console.error(`Error fetching units count for project ${project.id}:`, err);
                return {
                  ...project,
                  unitsCount: 0,
                };
              }
            })
          );
          
          // Log transformed data
          console.group('🔄 PROJECTS OUTPUT - Transformed Data');
          console.log('Transformed Projects:', projectsWithUnitsCount);
          projectsWithUnitsCount.forEach((project, index) => {
            console.log(`Transformed Project ${index + 1}:`, project);
          });
          console.groupEnd();
          
          setProjects(projectsWithUnitsCount);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
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
        console.log('🔍 Fetching project with ID:', id);
        const data = await graphqlRequest(queries.GET_PROJECT, { id: String(id) });
        console.log('📦 Raw project data:', data);
        if (data && data.project) {
          const transformed = transformProject(data.project, 'ar');
          console.log('✨ Transformed project:', transformed);
          setProject(transformed);
        } else {
          console.warn('⚠️ No project data returned for ID:', id);
          setProject(null);
        }
      } catch (err) {
        console.error('❌ Error fetching project:', err);
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

export function useRegions(countryId = null) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest(queries.GET_REGIONS, { countryId: countryId || undefined });
        if (data) {
          const transformed = transformRegions(data?.regions || [], 'ar');
          setRegions(transformed);
        } else {
          setRegions([]);
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
        setError(err.message);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, [countryId]);

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
        console.error('Error fetching region:', err);
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
        
        // Handle both data and errors
        if (result && result.errors) {
          console.warn('GraphQL returned errors:', result.errors);
          setError(result.errors[0]?.message || 'Failed to fetch developers');
          setDevelopers([]);
        } else if (result && result.data) {
          const transformed = transformDevelopers(result.data?.developers || [], 'ar');
          setDevelopers(transformed);
        } else if (result && result.developers) {
          // Direct data structure
          const transformed = transformDevelopers(result.developers || [], 'ar');
          setDevelopers(transformed);
        } else {
          setDevelopers([]);
        }
      } catch (err) {
        console.error('Error fetching developers:', err);
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
        console.error('Error fetching developer:', err);
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
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        setError(null);
        // Map filter keys to match GraphQL schema parameter names
        const variables = {
          type: filters.type || undefined,
          isAvailable: filters.isAvailable !== undefined ? filters.isAvailable : undefined,
          projectId: filters.projectId ? String(filters.projectId) : undefined,
          developerId: filters.developerId ? String(filters.developerId) : undefined,
        };
        const data = await graphqlRequest(queries.GET_UNITS, variables);
        if (data) {
          const transformed = transformUnits(data?.units?.data || [], 'ar');
          setUnits(transformed);
        } else {
          setUnits([]);
        }
      } catch (err) {
        console.error('Error fetching units:', err);
        setError(err.message);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, [filters.type, filters.isAvailable, filters.projectId, filters.developerId]);

  return { units, loading, error };
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
        console.error('Error fetching unit:', err);
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
