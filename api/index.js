// API route for Hydrogen on Vercel
import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '../app/lib/context.js';

// Import the built Hydrogen app
import * as build from '../dist/server/index.js';

export default async function handler(request, response) {
  try {
    const appLoadContext = await createAppLoadContext(
      request,
      process.env,
      { waitUntil: () => {} }
    );

    const handleRequest = createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext: () => appLoadContext,
    });

    return handleRequest(request);
  } catch (error) {
    console.error('Error in Hydrogen handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 