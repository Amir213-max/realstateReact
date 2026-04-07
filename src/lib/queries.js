// GraphQL queries aligned with schema.graphql (Lighthouse @paginate: first, page)

export const GET_PROJECTS = `
  query GetProjects($regionId: ID, $first: Int, $page: Int) {
    projects(region_id: $regionId, first: $first, page: $page) {
      data {
        id
        name
        description
        address
        latitude
        longitude
        main_image
        views_count
        region {
          id
          name
          country { id name code }
        }
        developers { id name logo phone }
        created_at
        updated_at
      }
      paginatorInfo { total count currentPage lastPage }
    }
  }
`;

export const GET_PROJECTS_SIMPLE = `
  query GetProjectsSimple($first: Int, $page: Int) {
    projects(first: $first, page: $page) {
      data {
        id
        name
        description
        address
        main_image
        views_count
        region { id name country { name } }
        developers { id name logo phone }
        created_at
      }
      paginatorInfo { total count currentPage lastPage }
    }
  }
`;

export const GET_PROJECT = `
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      address
      latitude
      longitude
      main_image
      views_count
      region { id name country { id name code } }
      developers { id name logo email phone website }
      units {
        id name description type price area bedrooms bathrooms main_image is_available
        images { id image_path order }
        developers { id name logo }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_REGIONS = `
  query GetRegions($countryId: ID, $isFeatured: Boolean) {
    regions(country_id: $countryId, is_featured: $isFeatured) {
      id
      name
      is_featured
      country { id name code }
      projects { id name main_image views_count }
      created_at
      updated_at
    }
  }
`;

export const GET_REGION = `
  query GetRegion($id: ID!) {
    region(id: $id) {
      id
      name
      is_featured
      country { id name code }
      projects {
        id name description main_image address views_count
        developers { id name logo }
        units { id }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_DEVELOPERS = `
  query GetDevelopers {
    developers {
      id name description logo website email phone
      projects { id name main_image }
      units { id name type price }
      created_at updated_at
    }
  }
`;

export const GET_DEVELOPER = `
  query GetDeveloper($id: ID!) {
    developer(id: $id) {
      id name description logo website email phone
      projects {
        id name description main_image address
        region { id name country { id name } }
        units { id name type price }
      }
      units {
        id name type price area bedrooms bathrooms main_image is_available
        project { id name }
      }
      created_at updated_at
    }
  }
`;

export const GET_UNITS = `
  query GetUnits(
    $type: String
    $isAvailable: Boolean
    $isFeatured: Boolean
    $isRentable: Boolean
    $projectId: ID
    $developerId: ID
    $first: Int
    $page: Int
  ) {
    units(
      type: $type
      is_available: $isAvailable
      is_featured: $isFeatured
      is_rentable: $isRentable
      project_id: $projectId
      developer_id: $developerId
      first: $first
      page: $page
    ) {
      data {
        id name description type price area bedrooms bathrooms main_image is_available is_featured views_count
        project {
          id name description address latitude longitude main_image views_count
          region { id name country { id name code } }
          developers { id name logo phone email website }
          units { id }
        }
        developers { id name logo email phone }
        images { id image_path order }
        created_at updated_at
      }
      paginatorInfo { total count currentPage lastPage }
    }
  }
`;

export const GET_UNIT = `
  query GetUnit($id: ID!) {
    unit(id: $id) {
      id name description type price area bedrooms bathrooms main_image is_available views_count
      project {
        id name description address latitude longitude main_image views_count
        region { id name country { id name code } }
        developers { id name logo email phone website }
      }
      developers { id name logo email phone website }
      images { id image_path order }
      attributeValues { id value attribute { id name slug type } }
      created_at updated_at
    }
  }
`;

export const GET_UNITS_BY_PROJECT = `
  query GetUnitsByProject($project_id: ID!, $first: Int, $page: Int) {
    units(project_id: $project_id, first: $first, page: $page) {
      data {
        id
        name
        price
        is_available
        main_image
        is_featured
        images {
          image_path
        }
      }
      paginatorInfo { total count currentPage lastPage }
    }
  }
`;

export const GET_MOST_BROWSED_PROJECTS = `
  query MostBrowsedProjects($first: Int, $regionId: ID) {
    mostBrowsedProjects(first: $first, region_id: $regionId) {
      id
      name
      description
      address
      latitude
      longitude
      main_image
      views_count
      region {
        id
        name
        country { id name code }
      }
      developers { id name logo phone }
      units { id }
      created_at
      updated_at
    }
  }
`;

export const GET_MOST_BROWSED_UNITS = `
  query MostBrowsedUnits($first: Int, $projectId: ID) {
    mostBrowsedUnits(first: $first, project_id: $projectId) {
      id
      name
      type
      price
      area
      bedrooms
      bathrooms
      main_image
      views_count
      is_available
      project {
        id
        name
        main_image
        region { id name }
      }
      developers { id name logo }
    }
  }
`;

export const GET_COUNTRIES = `
  query GetCountries {
    countries {
      id
      name
      code
    }
  }
`;

export const GET_SETTINGS_BY_GROUP = `
  query GetSettingsByGroup($group: String!) {
    settings(group: $group) {
      id
      group
      key
      value
      image
      link
    }
  }
`;

export const GET_SETTING = `
  query GetSetting($group: String!, $key: String!) {
    getSetting(group: $group, key: $key) {
      id
      group
      key
      value
      image
      link
    }
  }
`;

export const SUBMIT_UNIT_INQUIRY = `
  mutation SubmitUnitInquiry($unitId: ID!, $developerId: ID, $name: String!, $email: String!, $phone: String, $message: String) {
    submitUnitInquiry(unit_id: $unitId, developer_id: $developerId, name: $name, email: $email, phone: $phone, message: $message) {
      id unit_id developer_id name email phone message status created_at updated_at
    }
  }
`;
