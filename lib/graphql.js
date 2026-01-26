// GraphQL client configuration
// Use Next.js API route as proxy to avoid CORS issues
const GRAPHQL_ENDPOINT = typeof window !== 'undefined' 
  ? '/api/graphql'  // Client-side: use local API route
  : (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://keeper.in-brackets.online/graphql'); // Server-side: direct connection

// Extract operation name from query string
function getOperationName(query) {
  const match = query.match(/(query|mutation)\s+(\w+)/);
  return match ? match[2] : 'Unknown';
}

// Extract operation type from query string
function getOperationType(query) {
  const match = query.match(/(query|mutation)\s+/);
  return match ? match[1].toUpperCase() : 'UNKNOWN';
}

export async function graphqlRequest(query, variables = {}) {
  const operationName = getOperationName(query);
  const operationType = getOperationType(query);
  
  // Start console group for this request
  console.group(`🔵 ${operationType}: ${operationName}`);
  console.log('📍 Endpoint:', GRAPHQL_ENDPOINT);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Log query
  console.group('📝 GRAPHQL QUERY / MUTATION');
  console.log(query);
  console.groupEnd();
  
  // Log variables
  console.group('📦 VARIABLES');
  console.log(JSON.stringify(variables, null, 2));
  console.groupEnd();
  
  try {
    const requestBody = {
      query,
      variables,
    };
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Log response status
    console.group('📡 RESPONSE STATUS');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`OK: ${response.ok}`);
    console.groupEnd();

    if (!response.ok) {
      const errorText = await response.text();
      console.group('❌ ERROR');
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      console.error('Response:', errorText);
      console.groupEnd();
      console.groupEnd(); // Close main group
      return null;
    }

    const result = await response.json();

    if (result.errors) {
      console.group('❌ GRAPHQL ERRORS');
      console.error('Errors:', result.errors);
      result.errors.forEach((error, index) => {
        console.error(`Error ${index + 1}:`, {
          message: error.message,
          extensions: error.extensions,
          locations: error.locations,
          path: error.path,
        });
      });
      console.groupEnd();
      
      // Still log data if present (partial results)
      if (result.data) {
        console.group('⚠️ PARTIAL DATA (with errors)');
        console.log(JSON.stringify(result.data, null, 2));
        console.groupEnd();
      }
      
      console.groupEnd(); // Close main group
      return null;
    }

    // Success - log full response
    console.group('✅ RESPONSE DATA');
    console.log(JSON.stringify(result.data, null, 2));
    console.groupEnd();
    
    console.groupEnd(); // Close main group
    return result.data;
  } catch (error) {
    console.group('❌ NETWORK ERROR');
    if (error) {
      console.error('Error Type:', error.constructor?.name || typeof error);
      console.error('Error Message:', error.message || String(error));
      if (error.stack) {
        console.error('Error Stack:', error.stack);
      }
    } else {
      console.error('Unknown error occurred');
    }
    console.groupEnd();
    console.groupEnd(); // Close main group
    return null;
  }
}
