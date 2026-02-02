import { Request, Response } from 'express';
import { ProductUseCase } from '../usecases/ProductUseCase.js';
import { OrderUseCase } from '../usecases/OrderUseCase.js';
import { InvoiceUseCase } from '../usecases/InvoiceUseCase.js';
import { Order } from "../entities/Order.js";

export class ProductController {
  constructor(
    private productUseCase: ProductUseCase,
    private orderUseCase: OrderUseCase,
    private invoiceUseCase: InvoiceUseCase
  ) {}

  async addProduct(req: Request, res: Response) {
    try {
      const { name, price, stock } = req.body;
      const product = await this.productUseCase.executeCreate(name, price, stock);
      
      // Kirim balik seluruh object product, bukan cuma id
      res.status(201).json({
        message: "Produk berhasil ditambahkan",
        data: product 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      // Paksa id menjadi string menggunakan 'as string'
      const id = req.params.id as string; 
      const { name, price, stock } = req.body;
      
      // Pastikan nilai price dan stock dikonversi ke Number jika ada
      const product = await this.productUseCase.executeUpdate(id, { 
        name, 
        price: price !== undefined ? Number(price) : undefined, 
        stock: stock !== undefined ? Number(stock) : undefined 
      });
      
      res.json({
        message: "Produk berhasil diperbarui",
        data: product
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async adjustStock(req: Request, res: Response) {
    try {
      // Ambil id dan paksa menjadi string (Type Casting)
      const id = req.params.id as string; 
      const { amount } = req.body;
      
      if (!id) throw new Error("ID harus diisi");
      
      const product = await this.productUseCase.executeUpdateStock(id, Number(amount));
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      // Controller memanggil UseCase, bukan mengerjakan sendiri
      const products = await this.productUseCase.executeFindAll();
      res.json({
        count: products.length,
        data: products
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await this.productUseCase.executeDelete(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async checkout(req: Request, res: Response) {
    try {
      const { items } = req.body; 
      const order = await this.orderUseCase.createOrder(items);
      
      // Generate Invoice otomatis
      const invoice = await this.invoiceUseCase.generateInvoice(order);
      
      res.status(201).json({
        message: "Order Berhasil dan Invoice telah diterbitkan",
        order,
        invoice 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const { orderData } = req.body; // Mengirim object order yang mau dibatalkan
      
      // Re-hydrate menjadi instance Order agar bisa panggil method .cancel()
      const order = new Order(orderData.id, new Date(orderData.date), orderData.items);
      order.status = 'CONFIRMED'; // Asumsikan status awal confirmed
      
      const cancelledOrder = await this.orderUseCase.executeCancel(order);
      
      res.json({
        message: "Order berhasil dibatalkan, stok telah dikembalikan",
        order: cancelledOrder
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}