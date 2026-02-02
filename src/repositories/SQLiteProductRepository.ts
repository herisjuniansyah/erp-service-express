import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Product } from "../entities/Product.js";
import { IProductRepository } from "./IProductRepository.js";

export class SQLiteProductRepository implements IProductRepository {
  private dbPromise: Promise<Database>;

  constructor() {
    // Membuka koneksi database file erp.db
    this.dbPromise = open({
      filename: './erp.db',
      driver: sqlite3.Database
    });
    this.init();
  }

  private async init() {
    const db = await this.dbPromise;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        stock INTEGER
      );
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        date TEXT,
        status TEXT
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        product_id TEXT,
        qty INTEGER,
        price REAL,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      );
    `);
  }

  async create(p: Product): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      'INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)',
      [p.id, p.name, p.price, p.stock]
    );
  }

  async update(p: Product): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
      [p.name, p.price, p.stock, p.id]
    );
  }

  async findById(id: string): Promise<Product | null> {
    const db = await this.dbPromise;
    const row = await db.get('SELECT * FROM products WHERE id = ?', id);
    if (!row) return null;
    return new Product(row.id, row.name, row.price, row.stock);
  }

  async findAll(): Promise<Product[]> {
    const db = await this.dbPromise;
    const rows = await db.all('SELECT * FROM products');
    return rows.map(row => new Product(row.id, row.name, row.price, row.stock));
  }

  async delete(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.run('DELETE FROM products WHERE id = ?', id);
  }
}