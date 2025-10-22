import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      // FIX: Removed the `define` block as the application is a client-side only tool
      // and does not require any environment variables like API keys.
      
      // FIX: Removed the `resolve` configuration. The alias using `__dirname` was causing an error
      // in environments where `__dirname` is not available. The alias was also not used in the project,
      // so this block can be safely removed.
    };
});