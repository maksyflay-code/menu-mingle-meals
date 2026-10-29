import { createFileRoute } from "@tanstack/react-router";
import { Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESTAURANT, buildOutForDeliveryMessage, waLink } from "@/lib/menu";

type Search = { p?: string; n?: string; t?: string };

export const Route = createFileRoute("/entrega")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    p: s.p ? String(s.p) : undefined,
    n: s.n ? String(s.n) : undefined,
    t: s.t ? String(s.t) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Avisar saída para entrega — ${RESTAURANT.name}` },
      { name: "description", content: "Avise o cliente pelo WhatsApp que o pedido saiu para entrega." },
      { property: "og:title", content: "Avisar saída para entrega" },
      { property: "og:description", content: "Envie o aviso de saída para entrega ao cliente." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Entrega,
});

function Entrega() {
  const { p, n, t } = Route.useSearch();
  const ok = p && n && t;
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
        <Bike className="mx-auto size-12 text-primary" />
        <h1 className="font-display mt-3 text-4xl">Saiu para entrega</h1>
        {ok ? (
          <>
            <p className="mt-2 text-muted-foreground">Pedido #{p} · {n}</p>
            <Button asChild size="lg" className="mt-6 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90">
              <a href={waLink(t!, buildOutForDeliveryMessage(p!, n!))}>Avisar cliente no WhatsApp</a>
            </Button>
          </>
        ) : (
          <p className="mt-2 text-muted-foreground">Link incompleto. Use o link que veio na mensagem do pedido.</p>
        )}
      </div>
    </div>
  );
}
