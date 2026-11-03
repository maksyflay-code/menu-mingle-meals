import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bbq-cart";

function sanitize(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [id, qty] of Object.entries(value as Record<string, unknown>)) {
    if (typeof qty === "number" && Number.isInteger(qty) && qty > 0) out[id] = qty;
  }
  return out;
}

/** Carrinho salvo no navegador: o cliente não perde os itens ao atualizar a página. */
export function useCart() {
  const [cart, setCart] = useState<Record<string, number>>({});

  // Restaura o carrinho salvo depois da montagem (o HTML estático precisa
  // renderizar vazio para não divergir do SSR/prerender).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(sanitize(JSON.parse(raw)));
    } catch {
      // Carrinho corrompido ou storage bloqueado: começa vazio.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage indisponível: o carrinho funciona apenas nesta visita.
    }
  }, [cart]);

  const change = useCallback((id: string, d: number) => {
    setCart((prev) => {
      const qty = Math.max(0, (prev[id] ?? 0) + d);
      const next = { ...prev };
      if (!qty) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const clear = useCallback(() => setCart({}), []);

  return { cart, change, clear };
}
