import { Product } from "./Product.js";

// HARUS ADA 'export' agar bisa di-import di file lain
export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly qty: number,
    public readonly price: number
  ) {}
}

export class Order {
  // Properti status harus di luar fungsi
  public status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED' = 'DRAFT';

  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly items: OrderItem[] // Gunakan tipe OrderItem di sini
  ) {}

  // Pastikan fungsi confirm ada di sini (bukan di dalam constructor/fungsi lain)
  public confirm(products: Product[]) {
    if (this.status !== 'DRAFT') throw new Error("Hanya draft yang bisa dikonfirmasi");

    for (const item of this.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Produk ${item.productId} tidak ditemukan`);
      
      product.reduceStock(item.qty);
    }
    this.status = 'CONFIRMED';
  }

  public cancel(products: Product[]) {
    if (this.status !== 'CONFIRMED') {
      throw new Error("Hanya order CONFIRMED yang bisa dibatalkan");
    }

    for (const item of this.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.addStock(item.qty);
      }
    }
    this.status = 'CANCELLED';
  }
}