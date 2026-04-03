import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <div class="header">
        <h1>Products</h1>
        <button class="btn-add" (click)="showAddModal = true">+ Add Product</button>
      </div>
      
      <div class="filters">
        <input 
          type="text" 
          placeholder="Search products..." 
          [(ngModel)]="searchTerm"
          (input)="filterProducts()"
        >
        <select [(ngModel)]="categoryFilter" (change)="filterProducts()">
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Drinks">Drinks</option>
          <option value="Desserts">Desserts</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of filteredProducts">
            <td>
              <div class="product-img">
                <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
                <span *ngIf="!product.imageUrl">📦</span>
              </div>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.categoryName || '-' }}</td>
            <td>{{ product.price | currency }}</td>
            <td>
              <span [class.low-stock]="product.stockQuantity <= product.reorderLevel">
                {{ product.stockQuantity }}
              </span>
            </td>
            <td>
              <span class="status-badge" [class.active]="product.active">
                {{ product.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button class="btn-edit" (click)="editProduct(product)">Edit</button>
              <button class="btn-delete" (click)="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="filteredProducts.length === 0" class="empty-state">
        <p>No products found</p>
      </div>
    </div>
  `,
  styles: [`
    .products-page { padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-add { padding: 0.75rem 1.5rem; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .filters input, .filters select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .filters input { width: 250px; }
    .product-img { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px; }
    .product-img img { max-width: 100%; max-height: 100%; }
    .low-stock { color: #f44336; font-weight: bold; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 12px; background: #f5f5f5; }
    .status-badge.active { background: #e8f5e9; color: #4caf50; }
    .btn-edit, .btn-delete { padding: 0.25rem 0.5rem; margin-right: 0.5rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #2196F3; color: white; }
    .btn-delete { background: #f44336; color: white; }
    .empty-state { text-align: center; padding: 3rem; color: #999; }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  categoryFilter = '';
  showAddModal = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Mock data
    this.products = [
      { id: 1, name: 'Burger', description: 'Delicious burger', price: 12.99, sku: 'BG001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 50, reorderLevel: 10, trackInventory: true, variants: [], modifiers: [] },
      { id: 2, name: 'Pizza', description: 'Fresh pizza', price: 15.99, sku: 'PZ001', barcode: '', imageUrl: '', categoryId: 2, categoryName: 'Food', storeId: 1, active: true, stockQuantity: 30, reorderLevel: 5, trackInventory: true, variants: [], modifiers: [] },
      { id: 3, name: 'Cola', description: 'Cold drink', price: 2.99, sku: 'CL001', barcode: '', imageUrl: '', categoryId: 3, categoryName: 'Drinks', storeId: 1, active: true, stockQuantity: 100, reorderLevel: 20, trackInventory: true, variants: [], modifiers: [] },
      { id: 4, name: 'Coffee', description: 'Hot coffee', price: 3.99, sku: 'CF001', barcode: '', imageUrl: '', categoryId: 3, categoryName: 'Drinks', storeId: 1, active: true, stockQuantity: 8, reorderLevel: 15, trackInventory: true, variants: [], modifiers: [] },
      { id: 5, name: 'Ice Cream', description: 'Vanilla ice cream', price: 5.99, sku: 'IC001', barcode: '', imageUrl: '', categoryId: 4, categoryName: 'Desserts', storeId: 1, active: true, stockQuantity: 40, reorderLevel: 10, trackInventory: true, variants: [], modifiers: [] }
    ];
    this.filteredProducts = this.products;
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchSearch = !this.searchTerm || p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = !this.categoryFilter || p.categoryName === this.categoryFilter;
      return matchSearch && matchCategory;
    });
  }

  editProduct(product: Product): void {
    console.log('Edit product', product);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== id);
      this.filterProducts();
    }
  }
}