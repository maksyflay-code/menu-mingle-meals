import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { MENU, RESTAURANT, brl, buildOrderMessage, cartSubtotal, waLink, type Customer } from "@/lib/menu";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: `Seu pedido — ${RESTAURANT.name}` },
      { name: "description", content: "Confira os itens do seu pedido e envie pelo WhatsApp." },
      { property: "og:title", content: `Seu pedido — ${RESTAURANT.name}` },
      { property: "og:description", content: "Confira os itens do seu pedido e envie pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Carrinho,
});

const empty: Customer = { name: "", phone: "", address: "", neighborhood: "", payment: "Pix", notes: "" };

function Carrinho() {
  const { cart, change, clear } = useCart();
  const [c, setC] = useState<Customer>(empty);
  const navigate = useNavigate();

  const lines = useMemo(
    () => MENU.flatMap((item) => {
      const qty = cart[item.id];
      return qty ? [{ item, qty }] : [];
    }),
    [cart],
  );
  const subtotal = cartSubtotal(lines);
  const total = subtotal + RESTAURANT.deliveryFee;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const valid = c.name && c.phone.replace(/\D/g, "").length >= 10 && c.address && c.neighborhood && count > 0;

  const send = () => {
    const orderId = String(Date.now()).slice(-6);
    const msg = buildOrderMessage(orderId, lines, c, window.location.origin);
    window.open(waLink(RESTAURANT.whatsapp, msg), "_blank");
    clear();
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background px-5 pb-28 pt-8">
      <div className="mx-auto max-w-lg">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
          <Link to="/">&larr; Continuar escolhendo</Link>
        </Button>
        <h1 className="font-display mb-5 flex items-center gap-2 text-3xl text-primary">
          <ShoppingBag className="size-7" /> Seu pedido
        </h1>

        {lines.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">Seu carrinho está vazio.</p>
            <Button asChild className="mt-4">
              <Link to="/">Ver cardápio</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="grid gap-3">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  {l.item.image && (
                    <img src={l.item.image} alt="" width={1024} height={1024} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{l.item.name}</p>
                    <p className="text-sm text-muted-foreground">{brl(l.item.price)} cada</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => change(l.item.id, -1)} aria-label={`Remover um ${l.item.name}`}><Minus /></Button>
                    <span className="w-5 text-center font-bold">{l.qty}</span>
                    <Button size="icon" className="h-9 w-9" onClick={() => change(l.item.id, 1)} aria-label={`Adicionar um ${l.item.name}`}><Plus /></Button>
                  </div>
                  <span className="w-20 shrink-0 text-right font-bold text-primary">{brl(l.item.price * l.qty)}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => change(l.item.id, -l.qty)}
                    aria-label={`Excluir ${l.item.name} do pedido`}
                  ><Trash2 /></Button>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({count} {count === 1 ? "item" : "itens"})</span><span>{brl(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Entrega</span><span>{brl(RESTAURANT.deliveryFee)}</span></div>
              <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span className="text-primary">{brl(total)}</span></div>
            </div>

            <h2 className="font-display mt-6 text-xl">Dados para entrega</h2>
            <div className="mt-3 grid gap-3">
              <Input placeholder="Seu nome" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
              <Input placeholder="WhatsApp com DDD" inputMode="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
              <Input placeholder="Endereço e número" value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} />
              <Input placeholder="Bairro" value={c.neighborhood} onChange={(e) => setC({ ...c, neighborhood: e.target.value })} />
              <div className="flex gap-2">
                {["Pix", "Dinheiro", "Cartão"].map((p) => (
                  <Button key={p} type="button" variant={c.payment === p ? "default" : "outline"} className="flex-1" onClick={() => setC({ ...c, payment: p })}>{p}</Button>
                ))}
              </div>
              <Input placeholder="Observações (opcional)" value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} />
            </div>

            <Button size="lg" disabled={!valid} onClick={send} className="mt-5 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90">
              Enviar pedido pelo WhatsApp
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Ao enviar, o WhatsApp abre com o pedido pronto — basta apertar enviar.</p>
          </>
        )}
      </div>
    </div>
  );
}
