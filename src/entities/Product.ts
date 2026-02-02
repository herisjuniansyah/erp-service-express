// src/entities/Product.ts

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
    public stock: number
  ) {
    // Validasi dasar saat objek dibuat
    if (price < 0) throw new Error("Harga tidak boleh negatif");
    if (stock < 0) throw new Error("Stok awal tidak boleh negatif");
  }

  // Logika Bisnis: Menambah stok (misal: saat restock)
  public addStock(quantity: number): void {
    if (quantity <= 0) throw new Error("Jumlah penambahan harus lebih dari 0");
    this.stock += quantity;
  }

  // Logika Bisnis: Mengurangi stok (misal: saat terjual)
  public reduceStock(quantity: number): void {
    if (quantity <= 0) throw new Error("Jumlah pengurangan harus lebih dari 0");
    if (this.stock < quantity) throw new Error("Stok tidak mencukupi");
    this.stock -= quantity;
  }
}