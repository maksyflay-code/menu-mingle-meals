import { describe, expect, it } from "vitest";
import { MENU, buildOrderMessage, cartSubtotal, toWaPhone, RESTAURANT } from "./menu";

const c = { name: "Ana", phone: "(71) 98888-7777", address: "Rua A, 1", neighborhood: "Centro", payment: "Pix", notes: "" };
const black = MENU.find((item) => item.id === "parrilla-black");
const gorgonzola = MENU.find((item) => item.id === "parrilla-gorgonzola");
const coca = MENU.find((item) => item.id === "beb-cola");
const petit = MENU.find((item) => item.id === "sob-petit");
const cheddar = MENU.find((item) => item.id === "mol-cheddar");
if (!black || !gorgonzola || !coca || !petit || !cheddar) throw new Error("Itens obrigatórios ausentes");

describe("cardápio real", () => {
  it("tem 27 itens: 15 lanches + bebidas, sobremesas e molhos", () => {
    expect(MENU).toHaveLength(27);
  });
  it("contém somente os 15 lanches reais", () => {
    const burgers = MENU.filter((item) => item.id.startsWith("parrilla-") || item.id.startsWith("duplo-"));
    expect(burgers.map((item) => item.id)).toEqual([
      "parrilla-black", "parrilla-gorgonzola", "parrilla-chicken", "parrilla-bacon",
      "parrilla-catupiry", "parrilla-cheddar", "parrilla-salad", "parrilla-tropicana",
      "duplo-gorgonzola", "duplo-chicken", "duplo-bacon", "duplo-catupiry",
      "duplo-cheddar", "duplo-salad", "duplo-tropicana",
    ]);
  });
  it.each([
    ["parrilla-black", 17.9], ["parrilla-gorgonzola", 31.9],
    ["parrilla-chicken", 25.9], ["parrilla-bacon", 27.9],
    ["parrilla-catupiry", 26.9], ["parrilla-cheddar", 28.9],
    ["parrilla-salad", 22.9], ["duplo-gorgonzola", 38.9],
    ["duplo-chicken", 31.9], ["duplo-bacon", 34.9],
    ["duplo-catupiry", 33.9], ["duplo-cheddar", 35.9],
    ["duplo-salad", 29.9],
    ["parrilla-tropicana", 34.9], ["duplo-tropicana", 42.9],
  ])("%s tem o preço real de R$ %s", (id, price) => {
    expect(MENU.find((item) => item.id === id)?.price).toBe(price);
  });
});

describe("categorias e ingredientes", () => {
  it("usa as categorias pedidas, nesta ordem", () => {
    const categories = [...new Set(MENU.map((i) => i.category))];
    expect(categories).toEqual(["Hambúrgueres Artesanais", "Bebidas", "Sobremesas", "Molhos"]);
  });
  it("lanches duplos ficam junto com os hambúrgueres, sem categoria própria", () => {
    const duplos = MENU.filter((item) => item.id.startsWith("duplo-"));
    expect(duplos).toHaveLength(7);
    expect(duplos.every((item) => item.category === "Hambúrgueres Artesanais")).toBe(true);
  });
  it("escreve Blend, nunca Bland", () => {
    expect(MENU.some((i) => i.description.includes("Bland"))).toBe(false);
    expect(MENU.filter((i) => i.id.startsWith("parrilla-") || i.id.startsWith("duplo-")).every((i) => i.description.includes("Blend"))).toBe(true);
  });
  it("corrige Gergelim nos pães", () => {
    expect(MENU.some((i) => i.description.includes("Gergelin"))).toBe(false);
  });
  it("itens sugeridos têm os preços propostos", () => {
    expect(coca.price).toBe(6);
    expect(petit.price).toBe(16.9);
    expect(cheddar.price).toBe(4);
  });
  it("Parrilla Cheddar inclui bacon", () => {
    expect(MENU.find((item) => item.id === "parrilla-cheddar")?.description.split(", ")).toContain("Bacon");
  });
  it("Duplo Cheddar inclui 2 Bacon", () => {
    expect(MENU.find((item) => item.id === "duplo-cheddar")?.description.split(", ")).toContain("2 Bacon");
  });
  it.each([
    ["parrilla-tropicana", "Pão c/ Gergelim, Blend 140g, Queijo Cheddar, Queijo Coalho c/ Mel, Bacon, Abacaxi c/ mel, Rúcula, Molho Especial"],
    ["duplo-tropicana", "Pão c/ Gergelim, 2 Blend 140g, 2 Queijo Cheddar, Queijo Coalho c/ Mel, 2 Bacon, Abacaxi c/ mel, Rúcula, Molho Especial"],
  ])("%s tem os ingredientes informados", (id, ingredients) => {
    expect(MENU.find((item) => item.id === id)?.description).toBe(ingredients);
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
