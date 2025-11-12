import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// Enable mock API by default in development (set to 'false' to use real API)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API requests to the Apollo API
      '/api/proxy': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        rewrite: () => '/api/proxy',
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
        },
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'apollo-api-proxy',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api/proxy', async (req: IncomingMessage, res: ServerResponse) => {
          try {
            // Convert Express request to fetch Request
            const url = new URL(req.url || '', `http://${req.headers.host}`);
            const headers = new Headers();
            
            // Copy headers from Express request
            Object.entries(req.headers).forEach(([key, value]) => {
              if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
            });
            
            // Get request body
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const body = Buffer.concat(chunks).toString();
            
            // Create fetch Request
            const fetchRequest = new Request(url.toString(), {
              method: req.method,
              headers,
              body: body || undefined,
            });
            
            let response;
            
            // Use mock API in development
            if (mode === 'development') {
              const { handleProxyRequest } = await import('./src/api/proxy.cjs');

              response = await handleProxyRequest(fetchRequest);
            } else {
              console.log('Using real Apollo API');
              const { handleProxyRequest } = await import('./src/api/proxy.cjs');
              response = await handleProxyRequest(fetchRequest);
            }
            
            // Set status code
            res.statusCode = response.status;
            
            // Set headers
            response.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            
            // Send response body
            const responseBody = await response.text();
            res.end(responseBody);
          } catch (error) {
            console.error('Error handling proxy request:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Internal server error', 
              message: error instanceof Error ? error.message : 'Unknown error'
            }));
          }
        });
      }
    }
  ].filter(Boolean),
  define: {
    // Make environment variables available to the client
    '__APP_ENV__': JSON.stringify({
      MODE: mode
    })
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
