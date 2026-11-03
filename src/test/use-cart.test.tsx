import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useCart } from "@/hooks/use-cart";

it("mantém o carrinho salvo no navegador ao recarregar a página", () => {
  // Primeira visita: adiciona um item.
  const first = renderHook(() => useCart());
  act(() => first.result.current.change("parrilla-black", 2));
  expect(window.localStorage.getItem("bbq-cart")).toBe(JSON.stringify({ "parrilla-black": 2 }));

  // Recarga: uma nova montagem do hook lê o storage e restaura os itens.
  const second = renderHook(() => useCart());
  expect(second.result.current.cart).toEqual({ "parrilla-black": 2 });
});

it("ignora quantidades inválidas salvas no carrinho", () => {
  window.localStorage.setItem("bbq-cart", JSON.stringify({ "parrilla-black": 2, "beb-cola": 0, "mol-casa": -1, lixo: "3" }));
  const { result } = renderHook(() => useCart());
  expect(result.current.cart).toEqual({ "parrilla-black": 2 });
});
