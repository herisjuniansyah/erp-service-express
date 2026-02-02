import { Invoice } from "../entities/Invoice.js";

export class InvoiceUseCase {
  // Karena invoice dihitung dari data order, kita buat fungsi eksekusinya
  async generateInvoice(order: any) {
    if (!order || !order.items) throw new Error("Data order tidak valid");
    
    // Menggunakan logic dari Entity Invoice
    return Invoice.createFromOrder(order.id, order.items);
  }
}