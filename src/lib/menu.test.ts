import { describe, expect, it } from "vitest";
import { MENU, buildOrderMessage, cartSubtotal, toWaPhone, RESTAURANT } from "./menu";

const c = { name: "Ana", phone: "(71) 98888-7777", address: "Rua A, 1", neighborhood: "Centro", payment: "Pix", notes: "" };

describe("pedido", () => {
  it("soma subtotal", () => {
    expect(cartSubtotal([{ item: MENU[0]!, qty: 2 }, { item: MENU[1]!, qty: 1 }])).toBe(12 * 2 + 15);
  });
  it("total inclui taxa de entrega", () => {
    const msg = buildOrderMessage("100", [{ item: MENU[0]!, qty: 1 }], c, "https://x.app");
    expect(msg).toContain((12 + RESTAURANT.deliveryFee).toFixed(2).replace(".", ","));
  });
  it("link de saída para entrega usa telefone do cliente", () => {
    expect(toWaPhone(c.phone)).toBe("5571988887777");
    expect(buildOrderMessage("100", [{ item: MENU[0]!, qty: 1 }], c, "https://x.app")).toContain("/entrega?p=100&n=Ana&t=5571988887777");
  });
});
