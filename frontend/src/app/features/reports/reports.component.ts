import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-page">
      <div class="header">
        <h1>Reports & Analytics</h1>
      </div>
      
      <div class="report-types">
        <div class="report-card" (click)="selectedReport = 'sales'">
          <h3>Sales Report</h3>
          <p>View daily, weekly, monthly sales</p>
        </div>
        <div class="report-card" (click)="selectedReport = 'products'">
          <h3>Product Performance</h3>
          <p>Top selling products analysis</p>
        </div>
        <div class="report-card" (click)="selectedReport = 'inventory'">
          <h3>Inventory Report</h3>
          <p>Stock levels and movements</p>
        </div>
        <div class="report-card" (click)="selectedReport = 'employees'">
          <h3>Employee Performance</h3>
          <p>Staff sales and metrics</p>
        </div>
      </div>
      
      <div class="report-content" *ngIf="selectedReport">
        <div class="report-header">
          <h2>{{ getReportTitle() }}</h2>
          <div class="export-buttons">
            <button class="btn-export">Export PDF</button>
            <button class="btn-export">Export Excel</button>
          </div>
        </div>
        
        <div class="date-range">
          <input type="date" [(ngModel)]="startDate">
          <span>to</span>
          <input type="date" [(ngModel)]="endDate">
          <button class="btn-generate">Generate</button>
        </div>
        
        <div class="report-summary">
          <div class="summary-card">
            <h4>Total Sales</h4>
            <p class="value">$12,450.00</p>
          </div>
          <div class="summary-card">
            <h4>Orders</h4>
            <p class="value">156</p>
          </div>
          <div class="summary-card">
            <h4>Average Order</h4>
            <p class="value">$79.81</p>
          </div>
          <div class="summary-card">
            <h4>Profit</h4>
            <p class="value">$3,737.00</p>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Sales</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-01-01</td>
              <td>45</td>
              <td>$3,250.00</td>
              <td>$975.00</td>
            </tr>
            <tr>
              <td>2024-01-02</td>
              <td>52</td>
              <td>$3,890.00</td>
              <td>$1,167.00</td>
            </tr>
            <tr>
              <td>2024-01-03</td>
              <td>38</td>
              <td>$2,750.00</td>
              <td>$825.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .report-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .report-card { background: white; padding: 1.5rem; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.2s; }
    .report-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .report-card h3 { margin: 0 0 0.5rem; color: #2196F3; }
    .report-card p { margin: 0; color: #666; font-size: 14px; }
    .report-content { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .export-buttons { display: flex; gap: 0.5rem; }
    .btn-export { padding: 0.5rem 1rem; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .date-range { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .date-range input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .btn-generate { padding: 0.5rem 1rem; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .report-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .summary-card { background: #f5f5f5; padding: 1rem; border-radius: 8px; text-align: center; }
    .summary-card h4 { margin: 0 0 0.5rem; color: #666; font-size: 14px; }
    .summary-card .value { font-size: 24px; font-weight: bold; color: #333; margin: 0; }
  `]
})
export class ReportsComponent {
  selectedReport = '';
  startDate = '2024-01-01';
  endDate = '2024-01-07';

  getReportTitle(): string {
    const titles: { [key: string]: string } = {
      'sales': 'Sales Report',
      'products': 'Product Performance',
      'inventory': 'Inventory Report',
      'employees': 'Employee Performance'
    };
    return titles[this.selectedReport] || '';
  }
}