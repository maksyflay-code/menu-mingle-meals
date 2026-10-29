// Configuração do restaurante — troque pelos dados reais.
export const RESTAURANT = {
  name: "Rei do Sanduíche",
  // Número do WhatsApp do restaurante: DDI + DDD + número, só dígitos.
  whatsapp: "5571999999999",
  deliveryFee: 5,
};

export type MenuItem = { id: string; name: string; description: string; price: number; category: string };

export const MENU: MenuItem[] = [
  { id: "x-burguer", name: "X-Burguer", description: "Pão, hambúrguer, queijo e molho da casa", price: 12, category: "Lanches" },
  { id: "x-bacon", name: "X-Bacon", description: "Hambúrguer, queijo, bacon crocante e salada", price: 15, category: "Lanches" },
  { id: "franbacon", name: "Franbacon", description: "Frango, bacon, queijo e salada", price: 14, category: "Lanches" },
  { id: "x-tudo", name: "X-Tudo", description: "Hambúrguer, ovo, presunto, queijo, bacon, salada e milho", price: 20, category: "Lanches" },
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
