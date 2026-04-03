import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductVariant, ProductModifier } from '../../core/services/product.service';

interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  modifiers: ProductModifier[];
  notes: string;
  total: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pos-container">
      <!-- Products Panel -->
      <div class="pos-products">
        <div class="pos-header">
          <h2>New Sale</h2>
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search products..." 
              [(ngModel)]="searchTerm"
              (input)="filterProducts()"
            >
          </div>
        </div>
        
        <div class="category-tabs">
          <button 
            *ngFor="let cat of categories" 
            class="category-tab"
            [class.active]="selectedCategory === cat.id"
            (click)="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
        
        <div class="product-grid">
          <div 
            *ngFor="let product of filteredProducts" 
            class="product-card"
            (click)="addToCart(product)"
          >
            <div class="product-image">
              <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
              <div *ngIf="!product.imageUrl" class="no-image">📦</div>
            </div>
            <div class="product-info">
              <h4>{{ product.name }}</h4>
              <p class="price">{{ product.price | currency }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cart Panel -->
      <div class="pos-cart">
        <div class="cart-header">
          <h3>Current Order</h3>
          <button class="btn-clear" (click)="clearCart()">Clear</button>
        </div>
        
        <div class="cart-items">
          <div *ngFor="let item of cart; let i = index" class="cart-item">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <span *ngIf="item.variant" class="variant">{{ item.variant.name }}</span>
              <p class="item-price">{{ item.total | currency }}</p>
            </div>
            <div class="item-actions">
              <button class="qty-btn" (click)="decreaseQty(i)">-</button>
              <span class="qty">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="increaseQty(i)">+</button>
              <button class="btn-remove" (click)="removeFromCart(i)">×</button>
            </div>
          </div>
          
          <div *ngIf="cart.length === 0" class="empty-cart">
            <p>Cart is empty</p>
            <p class="hint">Click products to add them</p>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ subtotal | currency }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (10%)</span>
            <span>{{ tax | currency }}</span>
          </div>
          <div class="summary-row discount" *ngIf="discount > 0">
            <span>Discount</span>
            <span>-{{ discount | currency }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ total | currency }}</span>
          </div>
        </div>
        
        <div class="cart-actions">
          <div class="discount-input">
            <input 
              type="number" 
              placeholder="Discount %" 
              [(ngModel)]="discountPercent"
              (change)="applyDiscount()"
            >
          </div>
          <button class="btn-hold">Hold Order</button>
          <button class="btn-pay" (click)="processPayment()">
            Pay {{ total | currency }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pos-container {
      display: flex;
      height: calc(100vh - 64px);
    }
    
    .pos-products {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .pos-header {
      padding: 1rem;
      background: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .search-box input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 250px;
    }
    
    .category-tabs {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background: white;
      overflow-x: auto;
    }
    
    .category-tab {
      padding: 0.5rem 1rem;
      border: none;
      background: #f5f5f5;
      border-radius: 20px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    
    .category-tab.active {
      background: #2196F3;
      color: white;
    }
    
    .product-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
      padding: 1rem;
      overflow-y: auto;
      align-content: start;
    }
    
    .product-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }
    
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .product-image {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    
    .product-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .no-image {
      font-size: 40px;
    }
    
    .product-info h4 {
      margin: 0 0 0.25rem;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .price {
      color: #2196F3;
      font-weight: bold;
      margin: 0;
    }
    
    .pos-cart {
      width: 380px;
      background: white;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #e0e0e0;
    }
    
    .cart-header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .btn-clear {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .item-info h4 {
      margin: 0 0 0.25rem;
      font-size: 14px;
    }
    
    .variant {
      font-size: 12px;
      color: #666;
    }
    
    .item-price {
      color: #2196F3;
      font-weight: bold;
      margin: 0;
    }
    
    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .qty-btn {
      width: 24px;
      height: 24px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .qty {
      min-width: 20px;
      text-align: center;
    }
    
    .btn-remove {
      background: none;
      border: none;
      color: #f44336;
      cursor: pointer;
      font-size: 18px;
    }
    
    .empty-cart {
      text-align: center;
      padding: 3rem;
      color: #999;
    }
    
    .hint {
      font-size: 12px;
    }
    
    .cart-summary {
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      background: #f9f9f9;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .summary-row.discount span:last-child {
      color: #4caf50;
    }
    
    .summary-row.total {
      font-size: 18px;
      font-weight: bold;
      border-top: 1px solid #ddd;
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .cart-actions {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .discount-input input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .btn-hold {
      padding: 0.75rem;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-pay {
      padding: 1rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
    }
    
    .btn-pay:hover {
      background: #43a047;
    }
  `]
})
export class PosComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: { id: number; name: string }[] = [];
  selectedCategory: number | null = null;
  searchTerm = '';
  
  cart: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  discount = 0;
  discountPercent = 0;
  total = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.categories = [
      { id: 1, name: 'All' },
      { id: 2, name: 'Food' },
      { id: 3, name: 'Drinks' },
      { id: 4, name: 'Desserts' }
    ];
  }

  loadProducts(): void {
    // Mock products for demo
    this.products = [
      { id: 1, name: 'Burger', description: 'Delicious burger', price: 12.99, sku: 'BG001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 50, reorderLevel: 10, trackInventory: true, variants: [], modifiers: [] },
      { id: 2, name: 'Pizza', description: 'Fresh pizza', price: 15.99, sku: 'PZ001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 30, reorderLevel: 5, trackInventory: true, variants: [], modifiers: [] },
      { id: 3, name: 'Cola', description: 'Cold drink', price: 2.99, sku: 'CL001', barcode: '', imageUrl: '', categoryId: 3, categoryName: 'Drinks', storeId: 1, active: true, stockQuantity: 100, reorderLevel: 20, trackInventory: true, variants: [], modifiers: [] },
      { id: 4, name: 'Coffee', description: 'Hot coffee', price: 3.99, sku: 'CF001', barcode: '', imageUrl: '', categoryId: 3, categoryName: 'Drinks', storeId: 1, active: true, stockQuantity: 80, reorderLevel: 15, trackInventory: true, variants: [], modifiers: [] },
      { id: 5, name: 'Ice Cream', description: 'Vanilla ice cream', price: 5.99, sku: 'IC001', barcode: '', imageUrl: '', categoryId: 4, categoryName: 'Desserts', storeId: 1, active: true, stockQuantity: 40, reorderLevel: 10, trackInventory: true, variants: [], modifiers: [] },
      { id: 6, name: 'Fries', description: 'Crispy fries', price: 4.99, sku: 'FR001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 60, reorderLevel: 15, trackInventory: true, variants: [], modifiers: [] },
      { id: 7, name: 'Salad', description: 'Fresh salad', price: 8.99, sku: 'SL001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 25, reorderLevel: 5, trackInventory: true, variants: [], modifiers: [] },
      { id: 8, name: 'Water', description: 'Bottled water', price: 1.99, sku: 'WT001', barcode: '', imageUrl: '', categoryId: 3, categoryName: 'Drinks', storeId: 1, active: true, stockQuantity: 200, reorderLevel: 50, trackInventory: true, variants: [], modifiers: [] }
    ];
    this.filteredProducts = this.products;
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    if (categoryId === 1) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    }
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => 
      item.product.id === product.id && !item.variant
    );
    
    if (existingItem) {
      existingItem.quantity++;
      existingItem.total = existingItem.quantity * (existingItem.variant?.price || product.price);
    } else {
      this.cart.push({
        product,
        quantity: 1,
        modifiers: [],
        notes: '',
        total: product.price
      });
    }
    this.calculateTotal();
  }

  increaseQty(index: number): void {
    this.cart[index].quantity++;
    this.cart[index].total = this.cart[index].quantity * 
      (this.cart[index].variant?.price || this.cart[index].product.price);
    this.calculateTotal();
  }

  decreaseQty(index: number): void {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
      this.cart[index].total = this.cart[index].quantity * 
        (this.cart[index].variant?.price || this.cart[index].product.price);
      this.calculateTotal();
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cart = [];
    this.calculateTotal();
  }

  applyDiscount(): void {
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
    this.discount = this.discountPercent > 0 ? 
      this.subtotal * (this.discountPercent / 100) : 0;
    this.tax = (this.subtotal - this.discount) * 0.10;
    this.total = this.subtotal - this.discount + this.tax;
  }

  processPayment(): void {
    if (this.cart.length === 0) return;
    alert(`Payment of ${this.total.toFixed(2)} processed successfully!`);
    this.clearCart();
  }
}