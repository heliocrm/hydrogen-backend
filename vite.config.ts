import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [hydrogen(), tsconfigPaths()],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  define: {
    __HYDROGEN_DEV__: false,
  },
});
