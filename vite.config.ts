// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const debugPrerender = {
  name: "debug-prerender-requests",
  configurePreviewServer(server: any) {
    server.middlewares.use((req: any, res: any, next: () => void) => {
      console.log("[dbg] request:", req.method, req.url);
      res.on("finish", () => console.log("[dbg]   ->", res.statusCode, res.getHeader("location") ?? ""));
      next();
    });
  },
};

export default defineConfig({
  vite: { plugins: [debugPrerender] },
  tanstackStart: {
    // Both pages are public and browser-only after hydration. Export HTML for
    // shared hosts while preserving the normal Lovable Worker deployment.
    pages: [{ path: "/" }, { path: "/entrega" }],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
