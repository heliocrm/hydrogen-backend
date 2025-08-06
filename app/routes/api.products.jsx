import { json } from '@remix-run/node';

const PRODUCTS_QUERY = `#graphql
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// This handles GET requests to /api/products
export async function loader({ request, context }) {
  const { storefront } = context;
  
  // Get query parameters for pagination, filtering, etc.
  const url = new URL(request.url);
  const first = parseInt(url.searchParams.get('first') || '20');
  const after = url.searchParams.get('after') || null;
  
  try {
    const { products } = await storefront.query(PRODUCTS_QUERY, {
      variables: { first, after },
    });

    // Return pure JSON - no HTML/UI
    return json({
      success: true,
      data: products,
      pagination: {
        hasNextPage: products.pageInfo.hasNextPage,
        endCursor: products.pageInfo.endCursor
      }
    });
    
  } catch (error) {
    return json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    }, { status: 500 });
  }
}

// Handle POST requests for creating/updating products (if needed)
export async function action({ request, context }) {
  const { storefront } = context;
  
  if (request.method === 'POST') {
    // Handle product creation/updates
    const data = await request.json();
    
    // Your business logic here
    
    return json({
      success: true,
      message: 'Product processed successfully'
    });
  }
  
  return json({ error: 'Method not allowed' }, { status: 405 });
} 