// GraphQL Queries

export const GET_PROJECTS = `
  query GetProjects($regionId: ID) {
    projects(region_id: $regionId) {
      data {
        id
        name
        description
        address
        latitude
        longitude
        main_image
        region {
          id
          name
          country {
            id
            name
            code
          }
        }
        developers {
          id
          name
          logo
        }
        units {
          id
          name
          type
          price
          area
          bedrooms
          bathrooms
          main_image
          is_available
        }
        created_at
        updated_at
      }
      paginatorInfo {
        total
        count
        currentPage
        lastPage
      }
    }
  }
`;

// Simplified query for homepage projects display
export const GET_PROJECTS_SIMPLE = `
  query GetProjects {
    projects {
      data {
        id
        name
        description
        address
        main_image
        region {
          id
          name
          country {
            name
          }
        }
        developers {
          id
          name
          logo
        }
        created_at
      }
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
      region {
        id
        name
        country {
          id
          name
          code
        }
      }
      developers {
        id
        name
        logo
        email
        phone
        website
      }
      units {
        id
        name
        description
        type
        price
        area
        bedrooms
        bathrooms
        main_image
        is_available
        images {
          id
          image_path
          order
        }
        developers {
          id
          name
          logo
        }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_REGIONS = `
  query GetRegions($countryId: ID) {
    regions(country_id: $countryId) {
      id
      name
      country {
        id
        name
        code
      }
      projects {
        id
        name
        main_image
      }
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
      country {
        id
        name
        code
      }
      projects {
        id
        name
        description
        main_image
        address
        developers {
          id
          name
          logo
        }
        units {
          id
        }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_DEVELOPERS = `
  query GetDevelopers {
    developers {
      id
      name
      description
      logo
      website
      email
      phone
      projects {
        id
        name
        main_image
      }
      units {
        id
        name
        type
        price
      }
      created_at
      updated_at
    }
  }
`;

export const GET_DEVELOPER = `
  query GetDeveloper($id: ID!) {
    developer(id: $id) {
      id
      name
      description
      logo
      website
      email
      phone
      projects {
        id
        name
        description
        main_image
        address
        region {
          id
          name
          country {
            id
            name
          }
        }
        units {
          id
          name
          type
          price
        }
      }
      units {
        id
        name
        type
        price
        area
        bedrooms
        bathrooms
        main_image
        is_available
        project {
          id
          name
        }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_UNITS = `
  query GetUnits($type: String, $isAvailable: Boolean, $projectId: ID, $developerId: ID) {
    units(
      type: $type
      is_available: $isAvailable
      project_id: $projectId
      developer_id: $developerId
    ) {
      data {
        id
        name
        description
        type
        price
        area
        bedrooms
        bathrooms
        main_image
        is_available
        project {
          id
          name
          address
          latitude
          longitude
          main_image
          region {
            id
            name
            country {
              id
              name
            }
          }
        }
        developers {
          id
          name
          logo
          email
          phone
        }
        images {
          id
          image_path
          order
        }
        created_at
        updated_at
      }
      paginatorInfo {
        total
        count
        currentPage
        lastPage
      }
    }
  }
`;

export const GET_UNIT = `
  query GetUnit($id: ID!) {
    unit(id: $id) {
      id
      name
      description
      type
      price
      area
      bedrooms
      bathrooms
      main_image
      is_available
      project {
        id
        name
        description
        address
        latitude
        longitude
        main_image
        region {
          id
          name
          country {
            id
            name
            code
          }
        }
        developers {
          id
          name
          logo
          email
          phone
          website
        }
      }
      developers {
        id
        name
        logo
        email
        phone
        website
      }
      images {
        id
        image_path
        order
      }
      attributeValues {
        id
        value
        attribute {
          id
          name
          slug
          type
        }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_UNITS_BY_PROJECT = `
  query GetUnitsByProject($project_id: ID!) {
    units(project_id: $project_id) {
      data {
        id
        name
        price
        is_available
      }
      paginatorInfo {
        total
        count
      }
    }
  }
`;

export const SUBMIT_UNIT_INQUIRY = `
  mutation SubmitUnitInquiry(
    $unitId: ID!
    $developerId: ID
    $name: String!
    $email: String!
    $phone: String
    $message: String
  ) {
    submitUnitInquiry(
      unit_id: $unitId
      developer_id: $developerId
      name: $name
      email: $email
      phone: $phone
      message: $message
    ) {
      id
      unit_id
      developer_id
      name
      email
      phone
      message
      status
      created_at
      updated_at
    }
  }
`;
