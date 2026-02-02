import { Product } from "../entities/Product.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { v4 as uuidv4 } from 'uuid'; // Gunakan uuidv4

export class ProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  async executeCreate(name: string, price: number, stock: number) {
    const id = uuidv4(); // Memanggil fungsi uuidv4()
    const product = new Product(id, name, price, stock);
    
    // Ganti .save menjadi .create sesuai interface kita
    await this.productRepo.create(product); 
    return product;
  }

  async executeUpdate(id: string, data: { name?: string, price?: number, stock?: number }) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");

    // Update hanya jika ada data baru yang dikirim
    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    if (data.stock !== undefined) product.stock = data.stock;

    await this.productRepo.update(product);
    return product;
  }

  async executeUpdateStock(id: string, amount: number) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");
    
    // Gunakan fungsi yang ada di entity Product.ts
    if (amount > 0) {
      product.addStock(amount);
    } else {
      product.reduceStock(Math.abs(amount));
    }
    
    await this.productRepo.update(product);
    return product;
  }

  async executeFindAll() {
    return await this.productRepo.findAll();
  }

  async executeDelete(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");
    
    await this.productRepo.delete(id);
    return { message: `Produk ${product.name} berhasil dihapus` };
  }

}