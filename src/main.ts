import express from 'express';
import { SQLiteProductRepository } from './repositories/SQLiteProductRepository.js';
import { ProductUseCase } from './usecases/ProductUseCase.js';
import { OrderUseCase } from './usecases/OrderUseCase.js'; // Tambahkan import ini
import { ProductController } from './controllers/ProductController.js';
import { InvoiceUseCase } from './usecases/InvoiceUseCase.js';

const app = express();
app.use(express.json());

// 1. Inisialisasi Database & Repository
const productRepo = new SQLiteProductRepository();

// 2. Inisialisasi Use Case
const productUseCase = new ProductUseCase(productRepo);
const orderUseCase = new OrderUseCase(productRepo); 
const invoiceUseCase = new InvoiceUseCase();

// 3. Inisialisasi Controller (Hanya satu kali saja)
const productController = new ProductController(productUseCase, orderUseCase, invoiceUseCase);

// 4. Routing API
app.post('/products', (req, res) => productController.addProduct(req, res));
app.patch('/products/:id/stock', (req, res) => productController.adjustStock(req, res));
app.get('/products', (req, res) => productController.getAllProducts(req, res));
app.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));
app.put('/products/:id', (req, res) => productController.updateProduct(req, res));
app.post('/orders', (req, res) => productController.checkout(req, res));
app.post('/orders/cancel', (req, res) => productController.cancelOrder(req, res));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 ERP Service running on http://localhost:${PORT}`);
});