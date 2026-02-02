// src/repositories/IProductRepository.ts
import { Product } from "../entities/Product.js";

export interface IProductRepository {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
}