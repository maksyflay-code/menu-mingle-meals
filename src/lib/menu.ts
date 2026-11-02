// Configuração real do restaurante.
export const RESTAURANT = {
  name: "Black Burguer BBQ",
  // Número do WhatsApp do restaurante: DDI + DDD + número, só dígitos.
  whatsapp: "5574991269621",
  deliveryFee: 4,
};

import parrillaPhoto from "@/assets/parrilla-ilustrativo.jpg";
import duploPhoto from "@/assets/duplo-ilustrativo.jpg";
import chickenPhoto from "@/assets/chicken-ilustrativo.jpg";

export type MenuItem = { id: string; name: string; description: string; price: number; category: string; image?: string };

export const MENU: MenuItem[] = [
  { id: "parrilla-black", name: "PARRILLA - BLACK", description: "Pão Brioche, Bland 100g, Queijo Mussarela, Tomate, Alface Americano e Molho da casa", price: 17.9, category: "Parrilla", image: parrillaPhoto },
  { id: "parrilla-gorgonzola", name: "PARRILLA - GORGONZOLA", description: "Pão Brioche, Bland 140g, Bacon, Queijo Gorgonzola, Rúcula, Cebola Roxa e Molho da casa", price: 31.9, category: "Parrilla", image: parrillaPhoto },
  { id: "parrilla-chicken", name: "PARRILLA - CHICKEN", description: "Pão Brioche, Bland Frango 140g, Queijo Mussarela, Tomate, Alface Americano e Molho de ervas", price: 25.9, category: "Parrilla", image: chickenPhoto },
  { id: "parrilla-bacon", name: "PARRILLA - BACON", description: "Pão Brioche, Bland 140g, Queijo Cheddar, Bacon, Molho BBQ e Cebola caramelizada", price: 27.9, category: "Parrilla", image: parrillaPhoto },
  { id: "parrilla-catupiry", name: "PARRILLA - CATUPIRY", description: "Pão Brioche, Bland 140g, Catupiry, Bacon, Molho BBQ e Cebola caramelizada", price: 26.9, category: "Parrilla", image: parrillaPhoto },
  { id: "parrilla-cheddar", name: "PARRILLA - CHEDDAR", description: "Pão Brioche, Bland 140g, Cheddar Cremoso, Molho BBQ e Cebola caramelizada", price: 28.9, category: "Parrilla", image: parrillaPhoto },
  { id: "parrilla-salad", name: "PARRILLA - SALAD", description: "Pão de Gergelin, Bland 140g, Bacon, Alface Americana, Tomate, Cebola Roxa, Picles e Molho da casa", price: 22.9, category: "Parrilla", image: parrillaPhoto },
  { id: "duplo-gorgonzola", name: "DUPLO - GORGONZOLA", description: "Pão Brioche, 2 Bland 140g, 2 Bacon, Queijo Gorgonzola, Rúcula, Cebola Roxa e Molho da casa", price: 38.9, category: "Duplo", image: duploPhoto },
  { id: "duplo-chicken", name: "DUPLO - CHICKEN", description: "Pão Brioche, 2 Bland Frango 140g, 2 Queijo Mussarela, Tomate, Alface Americano e Molho de ervas", price: 31.9, category: "Duplo", image: chickenPhoto },
  { id: "duplo-bacon", name: "DUPLO - BACON", description: "Pão Brioche, 2 Bland 140g, 2 Queijo Cheddar, Bacon, Molho BBQ e Cebola caramelizada", price: 34.9, category: "Duplo", image: duploPhoto },
  { id: "duplo-catupiry", name: "DUPLO - CATUPIRY", description: "Pão Brioche, 2 Bland 140g, Catupiry, Bacon, Molho BBQ e Cebola Caramelizada", price: 33.9, category: "Duplo", image: duploPhoto },
  { id: "duplo-cheddar", name: "DUPLO - CHEDDAR", description: "Pão Brioche, 2 Bland 140g, 2 Cheddar Cremoso, Molho BBQ e Cebola caramelizada", price: 35.9, category: "Duplo", image: duploPhoto },
  { id: "duplo-salad", name: "DUPLO - SALAD", description: "Pão de Gergelim, 2 Bland 140g, 2 Bacon, Alface Americana, Tomate, Cebola Roxa, Picles e Molho da casa", price: 29.9, category: "Duplo", image: duploPhoto },
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
