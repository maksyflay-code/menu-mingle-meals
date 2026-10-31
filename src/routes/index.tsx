import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import logo from "@/assets/black_burguer_bbq_logo.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MENU, RESTAURANT, brl, buildOrderMessage, cartSubtotal, waLink,
  type CartLine, type Customer,
} from "@/lib/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${RESTAURANT.name} — Cardápio e pedidos pelo WhatsApp` },
      { name: "description", content: `Escolha seu lanche no cardápio do ${RESTAURANT.name} e envie o pedido pelo WhatsApp.` },
      { property: "og:title", content: `${RESTAURANT.name} — Cardápio` },
      { property: "og:description", content: "Escolha seu lanche e peça pelo WhatsApp." },
    ],
  }),
  component: Index,
});

const empty: Customer = { name: "", phone: "", address: "", neighborhood: "", payment: "Pix", notes: "" };

function Index() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<Customer>(empty);

  const lines: CartLine[] = useMemo(
    () => MENU.filter((i) => cart[i.id]).map((item) => ({ item, qty: cart[item.id]! })),
    [cart],
  );
  const subtotal = cartSubtotal(lines);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const categories = [...new Set(MENU.map((i) => i.category))];

  const change = (id: string, d: number) =>
    setCart((p) => {
      const q = Math.max(0, (p[id] ?? 0) + d);
      const n = { ...p, [id]: q };
      if (!q) delete n[id];
      return n;
    });

  const valid = c.name && c.phone.replace(/\D/g, "").length >= 10 && c.address && c.neighborhood && count > 0;

  const send = () => {
    const orderId = String(Date.now()).slice(-6);
    const msg = buildOrderMessage(orderId, lines, c, window.location.origin);
    window.open(waLink(RESTAURANT.whatsapp, msg), "_blank");
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="flex flex-col items-center px-5 pb-8 pt-12 text-center">
        <img src={logo.url} alt={RESTAURANT.name} width={1024} height={1024} className="w-64 md:w-80" />
        <h1 className="sr-only">{RESTAURANT.name}</h1>
        <p className="text-on-dark opacity-90">Escolha seu lanche e peça pelo WhatsApp</p>
      </header>

      <main className="mx-auto max-w-3xl px-5">
        {categories.map((cat) => (
          <section key={cat} className="mt-8">
            <h2 className="font-display mb-3 text-3xl text-primary">{cat}</h2>
            <div className="grid gap-3">
              {MENU.filter((i) => i.category === cat).map((i) => (
                <div key={i.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold">{i.name}</h3>
                    <p className="text-sm text-muted-foreground">{i.description}</p>
                    <p className="mt-1 font-bold text-primary">{brl(i.price)}</p>
                  </div>
                  {cart[i.id] ? (
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => change(i.id, -1)} aria-label="Remover"><Minus /></Button>
                      <span className="w-5 text-center font-bold">{cart[i.id]}</span>
                      <Button size="icon" onClick={() => change(i.id, 1)} aria-label="Adicionar"><Plus /></Button>
                    </div>
                  ) : (
                    <Button onClick={() => change(i.id, 1)}><Plus /> Adicionar</Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 border-t bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <Button size="lg" className="w-full text-base" onClick={() => setOpen(true)}>
              <ShoppingBag /> Ver pedido ({count}) · {brl(subtotal)}
            </Button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 md:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-5 md:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl">Seu pedido</h2>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Fechar"><X /></Button>
            </div>
            <ul className="space-y-1 text-sm">
              {lines.map((l) => (
                <li key={l.item.id} className="flex justify-between">
                  <span>{l.qty}x {l.item.name}</span><span>{brl(l.item.price * l.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between text-muted-foreground"><span>Entrega</span><span>{brl(RESTAURANT.deliveryFee)}</span></li>
              <li className="flex justify-between pt-1 font-bold"><span>Total</span><span>{brl(subtotal + RESTAURANT.deliveryFee)}</span></li>
            </ul>

            <div className="mt-5 grid gap-3">
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
          </div>
        </div>
      )}
    </div>
  );
}
