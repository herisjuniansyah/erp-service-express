# ERP Service Express (Clean Architecture)

Sistem ERP sederhana untuk manajemen produk, pesanan (order), dan invoice otomatis. Proyek ini dibangun menggunakan **Node.js**, **TypeScript**, dan **SQLite** dengan menerapkan prinsip *Clean Architecture*.

Struktur Folder
- `src/entities`: Logika bisnis inti (Product, Order, Invoice).
- `src/usecases`: Alur kerja aplikasi (ProductUseCase, OrderUseCase).
- `src/repositories`: Implementasi akses data ke SQLite.
- `src/controllers`: Menangani request HTTP (Express).
- `src/main.ts`: Entry point aplikasi dan Composition Root.

Dependency Utama
- **Express**: Web framework.
- **Better-SQLite3**: Database engine yang cepat dan ringan.
- **TypeScript**: Superset JavaScript untuk pengetikan statis.
- **Nodemon / TS-Node**: Alat bantu pengembangan.

Cara Menjalankan Aplikasi

1. **Clone Repository**:
   ```bash
   git clone [https://github.com/herisjuniansyah/erp-service-express.git](https://github.com/herisjuniansyah/erp-service-express.git)
   cd erp-service-express

Install Dependency:

Bash
npm install
Jalankan Mode Pengembangan:

Bash
npm run dev
Server akan berjalan di http://localhost:3000.

Cara Mengetes Fitur (Postman)
1. Cek Produk & Stok
GET /products

Ambil salah satu id produk untuk proses transaksi.

2. Konfirmasi Pesanan (Stok Berkurang)
POST /orders

Kirim JSON berisi orderData dengan daftar items. Stok produk otomatis berkurang dan invoice tercetak di konsol.

3. Batalkan Pesanan (Stok Kembali)
POST /orders/cancel

Kirim JSON berisi data order yang ingin dibatalkan.

Hasil: Stok produk yang dibatalkan akan otomatis bertambah kembali ke database.

Dikembangkan oleh Heris Juniansyah
