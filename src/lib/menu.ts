// Configuração do restaurante — troque pelos dados reais.
export const RESTAURANT = {
  name: "Black Burguer BBQ",
  // Número do WhatsApp do restaurante: DDI + DDD + número, só dígitos.
  whatsapp: "5574991269621",
  deliveryFee: 4,
};

import xBacon from "@/assets/x_bacon.jpg.asset.json";
import xBurguezeira from "@/assets/x_burguezeira.png.asset.json";
import xCalabresa from "@/assets/x_calabresa.png.asset.json";
import xEggDuplo from "@/assets/x_egg_duplo.jpg.asset.json";
import xOnion from "@/assets/x_onion_crocante.jpg.asset.json";
import xSaladao from "@/assets/x_saladao.jpg.asset.json";
import xTudao from "@/assets/x_tudao.jpg.asset.json";

export type MenuItem = { id: string; name: string; description: string; price: number; category: string; image?: string };

const ART = "Hambúrgueres Artesanais";

export const MENU: MenuItem[] = [
  { id: "x-bacon", name: "X-Bacon", description: "Pão brioche, hambúrguer artesanal de costela 150g, ketchup, fatias de bacon, queijo cheddar, catupiry, picles, alface, tomate e molho artesanal baconese", price: 26.9, category: ART, image: xBacon.url },
  { id: "x-burguezeira", name: "X-Burguezeira", description: "Pão brioche, hambúrguer artesanal de costela 150g, queijo mussarela e maionese verde artesanal", price: 17.9, category: ART, image: xBurguezeira.url },
  { id: "x-calabresa", name: "X-Calabresa", description: "Pão com gergilim, hambúrguer artesanal de costela 150g, ketchup, calabresa, queijo mussarela, molho cheddar, picles, alface, tomate e maionese verde artesanal", price: 22.9, category: ART, image: xCalabresa.url },
  { id: "x-egg-duplo", name: "X-Egg Duplo", description: "Pão com gergilim, hambúrguer artesanal de costela 150g, barbecue, queijo mussarela, dois ovos, alface, tomate e maionese verde artesanal", price: 21.9, category: ART, image: xEggDuplo.url },
  { id: "x-onion", name: "X-Onion Crocante", description: "Pão brioche, hambúrguer artesanal de costela 150g, molho cheddar, barbecue, queijo cheddar, anéis de cebola, cebola caramelizada e fatias de bacon", price: 33.9, category: ART, image: xOnion.url },
  { id: "x-saladao", name: "X-Saladão", description: "Pão brioche, hambúrguer artesanal de costela 150g, ketchup, queijo cheddar, catupiry, picles, alface, tomate, cebola roxa e maionese verde artesanal", price: 19.9, category: ART, image: xSaladao.url },
  { id: "x-tudao", name: "X-Tudão", description: "Pão com gergilim, hambúrguer artesanal de costela 150g, ketchup, calabresa acebolada caramelizada, fatias de bacon, queijo mussarela, ovo, alface, tomate, catupiry e maionese verde artesanal", price: 35.9, category: ART, image: xTudao.url },
  { id: "batata", name: "Batata Frita", description: "Porção média crocante", price: 10, category: "Acompanhamentos" },
  { id: "refri-lata", name: "Refrigerante Lata", description: "350ml", price: 6, category: "Bebidas" },
  { id: "suco", name: "Suco Natural", description: "500ml — laranja, maracujá ou acerola", price: 8, category: "Bebidas" },
];

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export type CartLine = { item: MenuItem; qty: number };
export type Customer = { name: string; phone: string; address: string; neighborhood: string; payment: string; notes: string };

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((s, l) => s + l.item.price * l.qty, 0);
}

export function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

/** Normaliza telefone brasileiro para formato wa.me (55 + DDD + número). */
export function toWaPhone(phone: string) {
  const d = onlyDigits(phone);
  return d.startsWith("55") && d.length >= 12 ? d : `55${d}`;
}

export function buildOrderMessage(orderId: string, lines: CartLine[], c: Customer, origin: string) {
  const subtotal = cartSubtotal(lines);
  const total = subtotal + RESTAURANT.deliveryFee;
  const items = lines.map((l) => `${l.qty}x ${l.item.name} (${brl(l.item.price * l.qty)})`).join("\n");
  const notifyLink = `${origin}/entrega?p=${orderId}&n=${encodeURIComponent(c.name)}&t=${toWaPhone(c.phone)}`;
  return [
    `✅ *NOVO PEDIDO #${orderId}*`,
    "",
    "▶️ *Itens*",
    items,
    "",
    `Subtotal: ${brl(subtotal)}`,
    `Entrega: ${brl(RESTAURANT.deliveryFee)}`,
    `*TOTAL: ${brl(total)}*`,
    "",
    "▶️ *Dados para entrega*",
    `Nome: ${c.name}`,
    `Telefone: ${c.phone}`,
    `Endereço: ${c.address}`,
    `Bairro: ${c.neighborhood}`,
    `Pagamento: ${c.payment}`,
    c.notes ? `Obs: ${c.notes}` : "",
    "",
    `🛵 Restaurante: toque para avisar que saiu para entrega:`,
    notifyLink,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}

export function buildOutForDeliveryMessage(orderId: string, name: string) {
  return `🛵 Olá ${name}! Seu pedido #${orderId} do ${RESTAURANT.name} *saiu para entrega* e já está a caminho. Bom apetite!`;
}

export const waLink = (phone: string, text: string) => `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
