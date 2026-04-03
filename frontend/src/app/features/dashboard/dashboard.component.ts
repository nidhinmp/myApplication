import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="header">
        <h1>Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ user?.username }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Today's Sales</h3>
          <p class="stat-value">{{ todaySales | currency }}</p>
        </div>
        <div class="stat-card">
          <h3>Orders</h3>
          <p class="stat-value">{{ todayOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>Products</h3>
          <p class="stat-value">{{ totalProducts }}</p>
        </div>
        <div class="stat-card">
          <h3>Low Stock Items</h3>
          <p class="stat-value warning">{{ lowStockCount }}</p>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-card" routerLink="/pos">
            <i class="pi pi-shopping-cart"></i>
            <span>New Sale</span>
          </button>
          <button class="action-card" routerLink="/products">
            <i class="pi pi-box"></i>
            <span>Products</span>
          </button>
          <button class="action-card" routerLink="/orders">
            <i class="pi pi-list"></i>
            <span>Orders</span>
          </button>
          <button class="action-card" routerLink="/reports">
            <i class="pi pi-chart-bar"></i>
            <span>Reports</span>
          </button>
          <button class="action-card" routerLink="/settings">
            <i class="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </div>
      </div>
      
      <div class="recent-orders">
        <h2>Recent Orders</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.customerName || 'Walk-in' }}</td>
              <td>{{ order.total | currency }}</td>
              <td>
                <span class="status-badge" [class]="order.status.toLowerCase()">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ order.orderDate | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .btn-logout {
      padding: 0.5rem 1rem;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .stat-card h3 {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }
    
    .stat-value.warning {
      color: #ff9800;
    }
    
    .quick-actions {
      margin-bottom: 2rem;
    }
    
    .actions-grid {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .action-card {
      background: white;
      border: none;
      padding: 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }
    
    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .action-card i {
      font-size: 24px;
      color: #2196F3;
    }
    
    .recent-orders {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-badge.pending { background: #fff3e0; color: #ff9800; }
    .status-badge.completed { background: #e8f5e9; color: #4caf50; }
    .status-badge.cancelled { background: #ffebee; color: #f44336; }
  `]
})
export class DashboardComponent implements OnInit {
  user: any;
  todaySales = 0;
  todayOrders = 0;
  totalProducts = 0;
  lowStockCount = 0;
  recentOrders: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    // Load dashboard data
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Mock data - in real app, call API
    this.todaySales = 2540.50;
    this.todayOrders = 42;
    this.totalProducts = 156;
    this.lowStockCount = 5;
    this.recentOrders = [
      { orderNumber: 'ORD-001', customerName: 'John Doe', total: 125.50, status: 'COMPLETED', orderDate: new Date() },
      { orderNumber: 'ORD-002', customerName: null, total: 45.00, status: 'PENDING', orderDate: new Date() },
      { orderNumber: 'ORD-003', customerName: 'Jane Smith', total: 230.00, status: 'COMPLETED', orderDate: new Date() }
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}