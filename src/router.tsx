import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Serve /rota e /rota/ sem redirecionar: o prerender do build pede URLs
    // com barra final e o ambiente da Lovable não segue redirecionamentos.
    trailingSlash: "preserve",
  });

  return router;
};
