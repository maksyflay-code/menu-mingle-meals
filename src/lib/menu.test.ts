import { describe, expect, it } from "vitest";
import { MENU, buildOrderMessage, cartSubtotal, toWaPhone, RESTAURANT } from "./menu";

const c = { name: "Ana", phone: "(71) 98888-7777", address: "Rua A, 1", neighborhood: "Centro", payment: "Pix", notes: "" };
const black = MENU.find((item) => item.id === "parrilla-black");
const gorgonzola = MENU.find((item) => item.id === "parrilla-gorgonzola");
if (!black || !gorgonzola) throw new Error("Lanches reais obrigatórios ausentes");

describe("cardápio real", () => {
  it("contém somente os 13 lanches reais", () => {
    expect(MENU).toHaveLength(13);
    expect(MENU.every((item) => item.id.startsWith("parrilla-") || item.id.startsWith("duplo-"))).toBe(true);
  });
  it.each([
    ["parrilla-black", 17.9], ["parrilla-gorgonzola", 31.9],
    ["parrilla-chicken", 25.9], ["parrilla-bacon", 27.9],
    ["parrilla-catupiry", 26.9], ["parrilla-cheddar", 28.9],
    ["parrilla-salad", 22.9], ["duplo-gorgonzola", 38.9],
    ["duplo-chicken", 31.9], ["duplo-bacon", 34.9],
    ["duplo-catupiry", 33.9], ["duplo-cheddar", 35.9],
    ["duplo-salad", 29.9],
  ])("%s tem o preço real de R$ %s", (id, price) => {
    expect(MENU.find((item) => item.id === id)?.price).toBe(price);
  });
});

describe("pedido", () => {
  it("soma subtotal", () => {
    expect(cartSubtotal([{ item: black, qty: 2 }, { item: gorgonzola, qty: 1 }])).toBeCloseTo(17.9 * 2 + 31.9);
  });
  it("total inclui taxa de entrega de R$ 4", () => {
    expect(RESTAURANT.deliveryFee).toBe(4);
    const msg = buildOrderMessage("100", [{ item: black, qty: 1 }], c, "https://x.app");
    expect(msg).toContain("21,90");
  });
  it("link de saída para entrega usa telefone do cliente", () => {
    expect(toWaPhone(c.phone)).toBe("5571988887777");
    expect(buildOrderMessage("100", [{ item: black, qty: 1 }], c, "https://x.app")).toContain("/entrega?p=100&n=Ana&t=5571988887777");
  });
});
