function getOperationName(query) {
  const match = query.match(/(query|mutation)\s+(\w+)/);
  return match ? match[2] : 'Unknown';
}

function getOperationType(query) {
  const match = query.match(/(query|mutation)\s+/);
  return match ? match[1].toUpperCase() : 'UNKNOWN';
}

function formatGraphQLErrors(errors) {
  if (!errors?.length) return 'GraphQL request failed';
  return errors.map((e) => e.message).join('; ');
}

const HTTP_ERROR_BODY_MAX = 400;

/**
 * Override with `REACT_APP_GRAPHQL_ENDPOINT` in `.env` when needed.
 * Development default `/graphql` uses CRA `package.json` proxy (same-origin, no CORS).
 */
const DEFAULT_GRAPHQL_ENDPOINT_PRODUCTION = 'https://admin.yafel-properties.com/graphql';
const DEFAULT_GRAPHQL_ENDPOINT_DEVELOPMENT = '/graphql';

export function getGraphqlEndpoint() {
  const v = process.env.REACT_APP_GRAPHQL_ENDPOINT;
  if (typeof v === 'string' && v.trim() !== '') return v.trim();
  if (process.env.NODE_ENV === 'development') return DEFAULT_GRAPHQL_ENDPOINT_DEVELOPMENT;
  return DEFAULT_GRAPHQL_ENDPOINT_PRODUCTION;
}

export async function graphqlRequest(query, variables = {}) {
  const endpoint = getGraphqlEndpoint();

  const operationNameLabel = getOperationName(query);
  const operationType = getOperationType(query);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    console.error(`[GraphQL] Network ${operationType} ${operationNameLabel}`, error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    const snippet = text.slice(0, HTTP_ERROR_BODY_MAX);
    const msg = `Invalid JSON (${operationType} ${operationNameLabel}) HTTP ${response.status}: ${snippet}`;
    console.error(`[GraphQL] ${msg}`);
    throw new Error(msg);
  }

  if (!response.ok) {
    const snippet = text.slice(0, HTTP_ERROR_BODY_MAX);
    const msg = `HTTP ${response.status} ${response.statusText} (${operationType} ${operationNameLabel}): ${snippet}`;
    console.error(`[GraphQL] ${msg}`);
    throw new Error(msg);
  }

  if (result.errors?.length) {
    const detail = formatGraphQLErrors(result.errors);
    const msg = `${operationType} ${operationNameLabel}: ${detail}`;
    console.error(`[GraphQL] ${msg}`, result.errors);
    throw new Error(detail);
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[GraphQL] OK ${operationType} ${operationNameLabel}`, result.data);
  }

  return result.data ?? null;
}
