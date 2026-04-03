import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="header">
        <h1>Orders</h1>
      </div>
      <div class="orders-grid">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <h3>{{ order.orderNumber }}</h3>
            <span class="status" [class]="order.status.toLowerCase()">{{ order.status }}</span>
          </div>
          <div class="order-body">
            <p><strong>Customer:</strong> {{ order.customer || 'Walk-in' }}</p>
            <p><strong>Total:</strong> {{ order.total | currency }}</p>
            <p><strong>Date:</strong> {{ order.date | date:'short' }}</p>
          </div>
          <div class="order-actions">
            <button class="btn-view">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .order-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 12px; }
    .status.pending { background: #fff3e0; color: #ff9800; }
    .status.completed { background: #e8f5e9; color: #4caf50; }
    .status.cancelled { background: #ffebee; color: #f44336; }
    .order-body p { margin: 0.25rem 0; color: #666; }
    .order-actions { margin-top: 1rem; }
    .btn-view { padding: 0.5rem 1rem; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class OrdersComponent {
  orders = [
    { orderNumber: 'ORD-001', customer: 'John Doe', total: 125.50, status: 'COMPLETED', date: new Date() },
    { orderNumber: 'ORD-002', customer: null, total: 45.00, status: 'PENDING', date: new Date() },
    { orderNumber: 'ORD-003', customer: 'Jane Smith', total: 230.00, status: 'COMPLETED', date: new Date() },
    { orderNumber: 'ORD-004', customer: 'Bob Wilson', total: 89.99, status: 'CANCELLED', date: new Date() }
  ];
}