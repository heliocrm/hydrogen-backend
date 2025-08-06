import { json } from '@remix-run/node';

const CART_QUERY = `#graphql
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `#graphql
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_ADD_LINES_MUTATION = `#graphql
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GET /api/cart?cartId=123
export async function loader({ request, context }) {
  const { storefront } = context;
  const url = new URL(request.url);
  const cartId = url.searchParams.get('cartId');

  if (!cartId) {
    return json({ error: 'Cart ID required' }, { status: 400 });
  }

  try {
    const { cart } = await storefront.query(CART_QUERY, {
      variables: { cartId },
    });

    return json({
      success: true,
      data: cart
    });
  } catch (error) {
    return json({
      success: false,
      error: 'Failed to fetch cart',
      message: error.message
    }, { status: 500 });
  }
}

// POST /api/cart
export async function action({ request, context }) {
  const { storefront } = context;
  const data = await request.json();

  try {
    switch (data.action) {
      case 'create':
        const { cartCreate } = await storefront.query(CART_CREATE_MUTATION, {
          variables: {
            input: {
              lines: data.lines || []
            }
          }
        });
        
        return json({
          success: true,
          data: cartCreate.cart,
          errors: cartCreate.userErrors
        });

      case 'addLines':
        const { cartLinesAdd } = await storefront.query(CART_ADD_LINES_MUTATION, {
          variables: {
            cartId: data.cartId,
            lines: data.lines
          }
        });
        
        return json({
          success: true,
          data: cartLinesAdd.cart,
          errors: cartLinesAdd.userErrors
        });

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return json({
      success: false,
      error: 'Cart operation failed',
      message: error.message
    }, { status: 500 });
  }
} 