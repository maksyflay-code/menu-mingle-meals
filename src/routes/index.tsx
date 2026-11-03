import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import doodle from "@/assets/bbq-doodle-fundo.jpg";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const empty: Customer = { name: "", phone: "", address: "", neighborhood: "", payment: "Pix", notes: "" };

const CATEGORY_EMOJI: Record<string, string> = {
  "Hambúrguer artesanal": "🍔",
  Bebidas: "🥤",
  Sobremesas: "🍰",
  Molhos: "🥫",
};

const sectionId = (cat: string) =>
  "cat-" + cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Index() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<{ src: string; name: string } | null>(null);
  const [c, setC] = useState<Customer>(empty);

  const lines: CartLine[] = useMemo(
    () => MENU.flatMap((item) => {
      const qty = cart[item.id];
      return qty ? [{ item, qty }] : [];
    }),
    [cart],
  );
  const subtotal = cartSubtotal(lines);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const categories = [...new Set(MENU.map((i) => i.category))];
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(categories[0] ?? "");
  const chipsRef = useRef<HTMLDivElement>(null);
  const q = query.trim().toLowerCase();
  const visible = q ? MENU.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(q)) : MENU;

  const goTo = (cat: string) => {
    setActive(cat);
    document.getElementById(sectionId(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Destaca a categoria visível enquanto o cliente rola a página.
  useEffect(() => {
    const onScroll = () => {
      let current = "";
      document.querySelectorAll<HTMLElement>("section[data-cat]").forEach((s) => {
        if (s.getBoundingClientRect().top < 180) current = s.dataset["cat"] ?? "";
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    chipsRef.current?.querySelector<HTMLElement>(`[data-chip="${sectionId(active)}"]`)?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active]);

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
    <div className="relative min-h-screen bg-background pb-28">
      {/* Fundo decorativo apenas nas laterais, do topo ao rodapé */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block" style={{ width: "max(calc((100% - 48rem) / 2), 0px)", backgroundImage: `url(${doodle})`, backgroundSize: "480px", backgroundPosition: "right center" }} />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block" style={{ width: "max(calc((100% - 48rem) / 2), 0px)", backgroundImage: `url(${doodle})`, backgroundSize: "480px", backgroundPosition: "left center" }} />
      <header className="flex flex-col items-center bg-background px-5 pb-8 pt-12 text-center">
        <img src={logo.url} alt={RESTAURANT.name} width={1024} height={1024} className="w-64 mix-blend-lighten md:w-80" />
        <h1 className="sr-only">{RESTAURANT.name}</h1>
        <p className="text-on-dark opacity-90">Escolha seu lanche e peça pelo WhatsApp</p>
        <p className="mt-3 rounded-full border border-primary/40 bg-background/80 px-4 py-1 text-sm font-semibold text-primary">🕕 Aberto todos os dias, das 18h às 00h</p>
        <p className="mt-2 text-xs text-muted-foreground">Fotos meramente ilustrativas</p>
      </header>

      <nav className="sticky top-0 z-40 border-b border-border bg-background py-3" aria-label="Categorias">
        <div className="mx-auto max-w-3xl px-5">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Busque por um produto" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" aria-label="Buscar produto" />
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="hidden h-9 w-9 shrink-0 sm:inline-flex" aria-label="Categorias anteriores" onClick={() => chipsRef.current?.scrollBy({ left: -200, behavior: "smooth" })}><ChevronLeft /></Button>
            <div ref={chipsRef} className="flex flex-1 gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <Button key={cat} data-chip={sectionId(cat)} size="sm" variant={active === cat ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => goTo(cat)}>
                  <span aria-hidden>{CATEGORY_EMOJI[cat] ?? "🍽️"}</span> {cat}
                </Button>
              ))}
            </div>
            <Button size="icon" variant="outline" className="hidden h-9 w-9 shrink-0 sm:inline-flex" aria-label="Próximas categorias" onClick={() => chipsRef.current?.scrollBy({ left: 200, behavior: "smooth" })}><ChevronRight /></Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl bg-background px-5">
        {visible.length === 0 && <p className="mt-10 text-center text-muted-foreground">Nenhum produto encontrado.</p>}
        {categories.filter((cat) => visible.some((i) => i.category === cat)).map((cat) => (
          <section key={cat} id={sectionId(cat)} data-cat={cat} className="mt-8 scroll-mt-36">
            <h2 className="font-display mb-3 text-2xl text-primary sm:text-3xl">{CATEGORY_EMOJI[cat] ?? ""} {cat}</h2>
            <div className="grid gap-3">
              {visible.filter((i) => i.category === cat).map((i) => (
                <div key={i.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex sm:gap-4">
                  {i.image && (
                    <Button type="button" variant="ghost" onClick={() => { if (i.image) setPhoto({ src: i.image, name: i.name }); }} aria-label={`Ver foto de ${i.name}`} className="col-start-1 row-start-1 h-20 w-20 shrink-0 overflow-hidden rounded-lg p-0 sm:order-none">
                      <img src={i.image} alt={`Foto ilustrativa de ${i.name}`} loading="lazy" width={1024} height={1024} className="h-20 w-20 rounded-lg object-cover" />
                    </Button>
                  )}
                  <div className="contents sm:block sm:min-w-0 sm:flex-1">
                    <h3 className={`${i.image ? "col-start-2" : "col-span-2"} row-start-1 min-w-0 break-words text-lg font-semibold sm:text-base`}>{i.name}</h3>
                    <p className="col-span-2 row-start-2 min-w-0 text-sm leading-relaxed text-muted-foreground sm:leading-normal">{i.description}</p>
                    <p className="col-start-1 row-start-3 font-bold text-primary sm:mt-1">{brl(i.price)}</p>
                  </div>
                  {cart[i.id] ? (
                    <div className="col-start-2 row-start-3 flex shrink-0 items-center justify-end gap-2">
                      <Button size="icon" variant="outline" className="h-10 w-10 sm:h-9 sm:w-9" onClick={() => change(i.id, -1)} aria-label="Remover"><Minus /></Button>
                      <span className="w-5 text-center font-bold">{cart[i.id]}</span>
                      <Button size="icon" className="h-10 w-10 sm:h-9 sm:w-9" onClick={() => change(i.id, 1)} aria-label="Adicionar"><Plus /></Button>
                    </div>
                  ) : (
                    <Button className="col-start-2 row-start-3 h-10 justify-self-end shrink-0 sm:h-9" onClick={() => change(i.id, 1)}><Plus /> Adicionar</Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="mx-auto max-w-3xl bg-background px-5 pb-6 pt-2 text-center text-sm text-muted-foreground">
        <p>
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/maksyflay/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Maksyflay Souza
          </a>
        </p>
      </footer>


      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 border-t bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <Button size="lg" className="w-full text-base" onClick={() => setOpen(true)}>
              <ShoppingBag /> Ver pedido ({count}) · {brl(subtotal)}
            </Button>
          </div>
        </div>
      )}

      {photo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4" onClick={() => setPhoto(null)}>
          <Button size="icon" variant="ghost" className="absolute right-4 top-4" aria-label="Fechar foto"><X /></Button>
          <img src={photo.src} alt={photo.name} className="max-h-[85vh] max-w-full rounded-xl object-contain" />
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
