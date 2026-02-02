export class Invoice {
  public readonly taxRate: number = 0.1; // Pajak 10%

  constructor(
    public readonly orderId: string,
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly total: number
  ) {}

  // Statik method untuk membuat invoice dari data Order
  static createFromOrder(orderId: string, items: { qty: number, price: number }[]): Invoice {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * 0.1; // Aturan tax 10%
    const total = subtotal + tax;

    return new Invoice(orderId, subtotal, tax, total);
  }
}