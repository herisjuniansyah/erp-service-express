import { Order, OrderItem } from "../entities/Order.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { Product } from "../entities/Product.js";
import { v4 as uuidv4 } from 'uuid';

export class OrderUseCase {
  constructor(private productRepo: IProductRepository) {}

  async createOrder(itemsInput: { product_id: string, qty: number }[]) {
    const items: OrderItem[] = [];
    const productsToUpdate: any[] = [];

    for (const input of itemsInput) {
      const product = await this.productRepo.findById(input.product_id);
      if (!product) throw new Error(`Produk ${input.product_id} tidak ada`);
      
      // Cek stok sebelum membuat order
      if (product.stock < input.qty) {
        throw new Error(`Stok tidak cukup untuk ${product.name}. Tersedia: ${product.stock}`);
      }

      // Snapshot harga saat transaksi
      items.push(new OrderItem(product.id, input.qty, product.price));
      
      // Simpan referensi produk untuk dikurangi stoknya nanti
      productsToUpdate.push(product);
    }

    const order = new Order(uuidv4(), new Date(), items);
    
    // Konfirmasi Order (Otomatis kurangi stok sesuai aturan)
    order.confirm(productsToUpdate);

    // Simpan perubahan stok produk ke database
    for (const p of productsToUpdate) {
      await this.productRepo.update(p);
    }

    // Catatan: Untuk kesederhanaan, kita kembalikan object order. 
    // Anda bisa menambah OrderRepository jika ingin menyimpan history order secara permanen.
    return order;
  }

  async executeCancel(order: Order) {
    const productsToUpdate: Product[] = [];

    for (const item of order.items) {
      const product = await this.productRepo.findById(item.productId);
      if (product) {
        productsToUpdate.push(product);
      }
    }

    // Jalankan logika pengembalian stok di entity
    order.cancel(productsToUpdate);

    // Simpan perubahan stok kembali ke database
    for (const p of productsToUpdate) {
      await this.productRepo.update(p);
    }

    return order;
  }
}