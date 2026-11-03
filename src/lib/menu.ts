// Configuração real do restaurante.
export const RESTAURANT = {
  name: "Black Burguer BBQ",
  // Número do WhatsApp do restaurante: DDI + DDD + número, só dígitos.
  whatsapp: "5574991269621",
  deliveryFee: 4,
  hours: "Todos os dias, das 18h às 00h",
};

import parrillaPhoto from "@/assets/parrilla-ilustrativo.jpg";
import duploPhoto from "@/assets/duplo-ilustrativo.jpg";
import chickenPhoto from "@/assets/chicken-ilustrativo.jpg";
import tropicanaPhoto from "@/assets/tropicana-ilustrativo.jpg";
import duploTropicanaPhoto from "@/assets/duplo-tropicana-ilustrativo.jpg";

export type MenuItem = { id: string; name: string; description: string; price: number; category: string; image?: string };

export const MENU: MenuItem[] = [
  // Hambúrgueres Artesanais
  { id: "parrilla-black", name: "PARRILLA - BLACK", description: "Pão Brioche, Blend 100g, Queijo Mussarela, Tomate, Alface Americano e Molho da casa", price: 17.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-gorgonzola", name: "PARRILLA - GORGONZOLA", description: "Pão Brioche, Blend 140g, Bacon, Queijo Gorgonzola, Rúcula, Cebola Roxa e Molho da casa", price: 31.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-chicken", name: "PARRILLA - CHICKEN", description: "Pão Brioche, Blend Frango 140g, Queijo Mussarela, Tomate, Alface Americano e Molho de ervas", price: 25.9, category: "Hambúrgueres Artesanais", image: chickenPhoto },
  { id: "parrilla-bacon", name: "PARRILLA - BACON", description: "Pão Brioche, Blend 140g, Queijo Cheddar, Bacon, Molho BBQ e Cebola caramelizada", price: 27.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-catupiry", name: "PARRILLA - CATUPIRY", description: "Pão Brioche, Blend 140g, Catupiry, Bacon, Molho BBQ e Cebola caramelizada", price: 26.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-cheddar", name: "PARRILLA - CHEDDAR", description: "Pão Brioche, Blend 140g, Cheddar Cremoso, Bacon, Molho BBQ e Cebola caramelizada", price: 28.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-salad", name: "PARRILLA - SALAD", description: "Pão de Gergelim, Blend 140g, Bacon, Alface Americana, Tomate, Cebola Roxa, Picles e Molho da casa", price: 22.9, category: "Hambúrgueres Artesanais", image: parrillaPhoto },
  { id: "parrilla-tropicana", name: "PARRILLA - TROPICANA", description: "Pão c/ Gergelim, Blend 140g, Queijo Cheddar, Queijo Coalho c/ Mel, Bacon, Abacaxi c/ mel, Rúcula, Molho Especial", price: 34.9, category: "Hambúrgueres Artesanais", image: tropicanaPhoto },
  // Duplos ficam junto com os hambúrgueres, a pedido do cliente (sem categoria própria).
  { id: "duplo-gorgonzola", name: "DUPLO - GORGONZOLA", description: "Pão Brioche, 2 Blend 140g, 2 Bacon, Queijo Gorgonzola, Rúcula, Cebola Roxa e Molho da casa", price: 38.9, category: "Hambúrgueres Artesanais", image: duploPhoto },
  { id: "duplo-chicken", name: "DUPLO - CHICKEN", description: "Pão Brioche, 2 Blend Frango 140g, 2 Queijo Mussarela, Tomate, Alface Americano e Molho de ervas", price: 31.9, category: "Hambúrgueres Artesanais", image: chickenPhoto },
  { id: "duplo-bacon", name: "DUPLO - BACON", description: "Pão Brioche, 2 Blend 140g, 2 Queijo Cheddar, Bacon, Molho BBQ e Cebola caramelizada", price: 34.9, category: "Hambúrgueres Artesanais", image: duploPhoto },
  { id: "duplo-catupiry", name: "DUPLO - CATUPIRY", description: "Pão Brioche, 2 Blend 140g, Catupiry, Bacon, Molho BBQ e Cebola Caramelizada", price: 33.9, category: "Hambúrgueres Artesanais", image: duploPhoto },
  { id: "duplo-cheddar", name: "DUPLO - CHEDDAR", description: "Pão Brioche, 2 Blend 140g, 2 Cheddar Cremoso, 2 Bacon, Molho BBQ e Cebola caramelizada", price: 35.9, category: "Hambúrgueres Artesanais", image: duploPhoto },
  { id: "duplo-salad", name: "DUPLO - SALAD", description: "Pão de Gergelim, 2 Blend 140g, 2 Bacon, Alface Americana, Tomate, Cebola Roxa, Picles e Molho da casa", price: 29.9, category: "Hambúrgueres Artesanais", image: duploPhoto },
  { id: "duplo-tropicana", name: "DUPLO - TROPICANA", description: "Pão c/ Gergelim, 2 Blend 140g, 2 Queijo Cheddar, Queijo Coalho c/ Mel, 2 Bacon, Abacaxi c/ mel, Rúcula, Molho Especial", price: 42.9, category: "Hambúrgueres Artesanais", image: duploTropicanaPhoto },
  // Bebidas (itens sugeridos, aguardando confirmação do cliente)
  { id: "beb-cola", name: "Coca-Cola Lata 350ml", description: "Lata gelada 350ml", price: 6, category: "Bebidas" },
  { id: "beb-cola-zero", name: "Coca-Cola Zero Lata 350ml", description: "Lata gelada 350ml", price: 6, category: "Bebidas" },
  { id: "beb-guarana", name: "Guaraná Antarctica Lata 350ml", description: "Lata gelada 350ml", price: 6, category: "Bebidas" },
  { id: "beb-agua", name: "Água Mineral 500ml", description: "Garrafa 500ml sem gás", price: 4, category: "Bebidas" },
  { id: "beb-agua-gas", name: "Água Mineral com Gás 500ml", description: "Garrafa 500ml com gás", price: 5, category: "Bebidas" },
  // Sobremesas (itens sugeridos, aguardando confirmação do cliente)
  { id: "sob-petit", name: "Petit Gateau", description: "Bolo quente de chocolate com recheio cremoso e sorvete de creme", price: 16.9, category: "Sobremesas" },
  { id: "sob-brownie", name: "Brownie com Nutella", description: "Brownie de chocolate quente com Nutella e sorvete", price: 12.9, category: "Sobremesas" },
  { id: "sob-milkshake", name: "Milkshake 500ml", description: "Chocolate, morango ou Ovomaltine, com chantilly", price: 18.9, category: "Sobremesas" },
  // Molhos (itens sugeridos, aguardando confirmação do cliente)
  { id: "mol-casa", name: "Molho da Casa (porção)", description: "Porção extra do molho da casa", price: 3, category: "Molhos" },
  { id: "mol-barbecue", name: "Molho Barbecue (porção)", description: "Porção de molho barbecue", price: 3, category: "Molhos" },
  { id: "mol-cheddar", name: "Molho Cheddar (porção)", description: "Porção de molho cheddar cremoso", price: 4, category: "Molhos" },
  { id: "mol-maionese", name: "Maionese da Casa (porção)", description: "Porção de maionese da casa", price: 3, category: "Molhos" },
];

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Funcionamento: todos os dias, das 18h à meia-noite.
 * 18:00–23:59 = aberto; 00:00–17:59 = fechado.
 */
export function isOpenNow(d = new Date()) {
  const h = d.getHours();
  return h >= 18;

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
