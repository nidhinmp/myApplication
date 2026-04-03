import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  imageUrl: string;
  categoryId: number | null;
  categoryName: string | null;
  storeId: number | null;
  active: boolean;
  stockQuantity: number;
  reorderLevel: number;
  trackInventory: boolean;
  variants: ProductVariant[];
  modifiers: ProductModifier[];
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  attributes: string;
  price: number;
  stockQuantity: number;
}

export interface ProductModifier {
  id: number;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  imageUrl: string;
  categoryId: number | null;
  storeId: number | null;
  active: boolean;
  stockQuantity: number;
  reorderLevel: number;
  trackInventory: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}