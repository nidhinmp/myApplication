import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl: string;
  storeName: string;
}

interface BusinessSettings {
  businessType: string;
  currency: string;
  taxRate: number;
  language: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="header">
        <h1>Settings</h1>
      </div>
      
      <div class="settings-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'general'"
          (click)="activeTab = 'general'"
        >General</button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'theme'"
          (click)="activeTab = 'theme'"
        >Theme & Customization</button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'business'"
          (click)="activeTab = 'business'"
        >Business Settings</button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'users'"
          (click)="activeTab = 'users'"
        >User Management</button>
      </div>
      
      <!-- General Settings -->
      <div class="settings-content" *ngIf="activeTab === 'general'">
        <div class="setting-group">
          <h3>Store Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Store Name</label>
              <input type="text" [(ngModel)]="storeName">
            </div>
            <div class="form-group">
              <label>Store Email</label>
              <input type="email" [(ngModel)]="storeEmail">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="storePhone">
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" [(ngModel)]="storeAddress">
            </div>
          </div>
        </div>
        
        <button class="btn-save" (click)="saveSettings()">Save Changes</button>
      </div>
      
      <!-- Theme Settings -->
      <div class="settings-content" *ngIf="activeTab === 'theme'">
        <div class="setting-group">
          <h3>Theme Customization</h3>
          <p class="hint">Customize the look and feel of your POS system</p>
          
          <div class="color-section">
            <h4>Color Scheme</h4>
            <div class="color-row">
              <div class="color-input">
                <label>Primary Color</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="theme.primaryColor">
                  <span>{{ theme.primaryColor }}</span>
                </div>
              </div>
              <div class="color-input">
                <label>Accent Color</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="theme.accentColor">
                  <span>{{ theme.accentColor }}</span>
                </div>
              </div>
            </div>
            <div class="color-row">
              <div class="color-input">
                <label>Background Color</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="theme.backgroundColor">
                  <span>{{ theme.backgroundColor }}</span>
                </div>
              </div>
              <div class="color-input">
                <label>Text Color</label>
                <div class="color-picker">
                  <input type="color" [(ngModel)]="theme.textColor">
                  <span>{{ theme.textColor }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="typography-section">
            <h4>Typography</h4>
            <div class="form-group">
              <label>Font Family</label>
              <select [(ngModel)]="theme.fontFamily">
                <option value="system-ui">System Default</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Segoe UI', sans-serif">Segoe UI</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
              </select>
            </div>
          </div>
          
          <div class="logo-section">
            <h4>Branding</h4>
            <div class="form-group">
              <label>Logo URL</label>
              <input type="text" [(ngModel)]="theme.logoUrl" placeholder="https://example.com/logo.png">
            </div>
            <div class="logo-preview" *ngIf="theme.logoUrl">
              <img [src]="theme.logoUrl" alt="Logo Preview">
            </div>
          </div>
        </div>
        
        <div class="preview-section">
          <h4>Live Preview</h4>
          <div class="theme-preview" [style]="getPreviewStyle()">
            <div class="preview-header">Header</div>
            <div class="preview-content">
              <button class="preview-btn">Button</button>
              <div class="preview-card">Card</div>
            </div>
          </div>
        </div>
        
        <button class="btn-save" (click)="saveTheme()">Save Theme</button>
      </div>
      
      <!-- Business Settings -->
      <div class="settings-content" *ngIf="activeTab === 'business'">
        <div class="setting-group">
          <h3>Business Configuration</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label>Business Type</label>
              <select [(ngModel)]="businessSettings.businessType">
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail Store</option>
                <option value="mall">Mall/Kiosk</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div class="form-group">
              <label>Currency</label>
              <select [(ngModel)]="businessSettings.currency">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Tax Rate (%)</label>
              <input type="number" [(ngModel)]="businessSettings.taxRate" min="0" max="100" step="0.1">
            </div>
            <div class="form-group">
              <label>Language</label>
              <select [(ngModel)]="businessSettings.language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
          
          <div class="feature-toggles">
            <h4>Feature Toggles</h4>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="features.trackInventory">
              <span>Enable Inventory Tracking</span>
            </label>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="features.loyaltyProgram">
              <span>Enable Loyalty Program</span>
            </label>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="features.splitPayments">
              <span>Enable Split Payments</span>
            </label>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="features.tableManagement">
              <span>Enable Table Management (Restaurant)</span>
            </label>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="features.barcodeScanning">
              <span>Enable Barcode Scanning</span>
            </label>
          </div>
        </div>
        
        <button class="btn-save" (click)="saveBusinessSettings()">Save Business Settings</button>
      </div>
      
      <!-- User Management -->
      <div class="settings-content" *ngIf="activeTab === 'users'">
        <div class="setting-group">
          <h3>User Management</h3>
          <button class="btn-add-user">+ Add User</button>
          
          <table class="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <span class="status-badge" [class.active]="user.active">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit">Edit</button>
                  <button class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .settings-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid #e0e0e0; }
    .tab-btn { padding: 1rem 1.5rem; background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-btn:hover { color: #2196F3; }
    .tab-btn.active { color: #2196F3; border-bottom-color: #2196F3; }
    .settings-content { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .setting-group { margin-bottom: 2rem; }
    .setting-group h3 { margin: 0 0 1rem; color: #333; }
    .hint { color: #666; font-size: 14px; margin-bottom: 1.5rem; }
    .form-row { display: flex; gap: 1.5rem; margin-bottom: 1rem; }
    .form-group { flex: 1; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; }
    .color-section { margin-bottom: 1.5rem; }
    .color-section h4 { margin: 0 0 1rem; }
    .color-row { display: flex; gap: 2rem; margin-bottom: 1rem; }
    .color-input label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .color-picker { display: flex; align-items: center; gap: 0.5rem; }
    .color-picker input[type="color"] { width: 50px; height: 40px; border: none; cursor: pointer; }
    .typography-section { margin-bottom: 1.5rem; }
    .typography-section h4 { margin: 0 0 1rem; }
    .logo-section { margin-bottom: 1.5rem; }
    .logo-section h4 { margin: 0 0 1rem; }
    .logo-preview { margin-top: 1rem; }
    .logo-preview img { max-width: 200px; }
    .preview-section { margin: 2rem 0; }
    .preview-section h4 { margin: 0 0 1rem; }
    .theme-preview { padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd; }
    .preview-header { padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; color: white; text-align: center; }
    .preview-content { display: flex; gap: 1rem; }
    .preview-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .preview-card { padding: 1rem; border-radius: 4px; background: rgba(255,255,255,0.3); }
    .feature-toggles { margin-top: 1.5rem; }
    .feature-toggles h4 { margin: 0 0 1rem; }
    .toggle { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; cursor: pointer; }
    .toggle input { width: auto; }
    .btn-save { padding: 0.75rem 2rem; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-add-user { padding: 0.5rem 1rem; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 1rem; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 12px; background: #f5f5f5; }
    .status-badge.active { background: #e8f5e9; color: #4caf50; }
    .btn-edit, .btn-delete { padding: 0.25rem 0.5rem; margin-right: 0.5rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #2196F3; color: white; }
    .btn-delete { background: #f44336; color: white; }
  `]
})
export class SettingsComponent {
  activeTab = 'general';
  
  // General
  storeName = 'My Store';
  storeEmail = 'store@example.com';
  storePhone = '+1 234 567 8900';
  storeAddress = '123 Main Street';
  
  // Theme
  theme: ThemeConfig = {
    primaryColor: '#2196F3',
    accentColor: '#FF9800',
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    fontFamily: 'system-ui',
    logoUrl: '',
    storeName: 'My Store'
  };
  
  // Business
  businessSettings: BusinessSettings = {
    businessType: 'restaurant',
    currency: 'USD',
    taxRate: 10,
    language: 'en'
  };
  
  features = {
    trackInventory: true,
    loyaltyProgram: false,
    splitPayments: true,
    tableManagement: true,
    barcodeScanning: false
  };
  
  users = [
    { username: 'admin', email: 'admin@store.com', role: 'ADMIN', active: true },
    { username: 'manager', email: 'manager@store.com', role: 'MANAGER', active: true },
    { username: 'cashier1', email: 'cashier@store.com', role: 'CASHIER', active: true }
  ];
  
  getPreviewStyle(): string {
    return `
      --preview-primary: ${this.theme.primaryColor};
      --preview-accent: ${this.theme.accentColor};
      --preview-bg: ${this.theme.backgroundColor};
      --preview-text: ${this.theme.textColor};
    `;
  }
  
  saveSettings(): void {
    alert('Settings saved!');
  }
  
  saveTheme(): void {
    alert('Theme saved!');
    localStorage.setItem('pos_theme', JSON.stringify(this.theme));
  }
  
  saveBusinessSettings(): void {
    alert('Business settings saved!');
  }
}