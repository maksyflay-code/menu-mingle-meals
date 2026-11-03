import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import doodle from "@/assets/bbq-doodle-fundo.jpg";
import logo from "@/assets/black_burguer_bbq_logo.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { MENU, RESTAURANT, brl, cartSubtotal, isOpenNow, type CartLine } from "@/lib/menu";

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

const CATEGORY_EMOJI: Record<string, string> = {
  "Hambúrgueres Artesanais": "🍔",
  Bebidas: "🥤",
  Sobremesas: "🍰",
  Molhos: "🥫",
};

const sectionId = (cat: string) =>
  "cat-" + cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Index() {
  const { cart, change } = useCart();
  const [photo, setPhoto] = useState<{ src: string; name: string } | null>(null);
  // Selo Aberto/Fechado só depois de montar: o HTML estático precisa renderizar igual ao SSR.
  const [openNow, setOpenNow] = useState<boolean | null>(null);

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

  // Atualiza o selo Aberto/Fechado a cada minuto.
  useEffect(() => {
    const update = () => setOpenNow(isOpenNow());
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-28">
      <header className="flex flex-col items-center bg-background px-5 pb-8 pt-12 text-center">
        <img src={logo.url} alt={RESTAURANT.name} width={1024} height={1024} className="w-64 mix-blend-lighten md:w-80" />
        <h1 className="sr-only">{RESTAURANT.name}</h1>
        <p className="text-on-dark opacity-90">Escolha seu lanche e peça pelo WhatsApp</p>
        {openNow === null ? (
          <p className="mt-3 rounded-full border border-primary/40 bg-background/80 px-4 py-1 text-sm font-semibold text-primary">🕕 Aberto todos os dias, das 18h às 00h</p>
        ) : openNow ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-background/80 px-4 py-1 text-sm font-semibold text-green-500">
            <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Aberto agora · 18h às 00h
          </p>
        ) : (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-background/80 px-4 py-1 text-sm font-semibold text-red-500">
            <span aria-hidden className="h-2 w-2 rounded-full bg-red-500" />
            Fechado · abre às 18h
          </p>
        )}
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

      <div className="relative flex w-full flex-1 flex-col">
        {/* Fundo decorativo apenas nas laterais do cardápio, do topo ao rodapé */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block" style={{ width: "max(calc((100% - 48rem) / 2), 0px)", backgroundImage: `url(${doodle})`, backgroundSize: "480px", backgroundPosition: "right center" }} />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block" style={{ width: "max(calc((100% - 48rem) / 2), 0px)", backgroundImage: `url(${doodle})`, backgroundSize: "480px", backgroundPosition: "left center" }} />
        <main className="relative z-10 mx-auto max-w-3xl bg-background px-5">
        {visible.length === 0 && <p className="mt-10 text-center text-muted-foreground">Nenhum produto encontrado.</p>}
        {categories.filter((cat) => visible.some((i) => i.category === cat)).map((cat) => (
          <section key={cat} id={sectionId(cat)} data-cat={cat} className="mt-8 scroll-mt-36">
            <h2 className="font-menu-title mb-3 text-xl leading-none text-primary sm:text-2xl">{CATEGORY_EMOJI[cat] ?? ""} {cat}</h2>
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
      </div>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <Button asChild size="lg" className="w-full text-base">
              <Link to="/carrinho">
                <ShoppingBag /> Ver pedido ({count}) · {brl(subtotal)}
              </Link>
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
    </div>
  );
}
