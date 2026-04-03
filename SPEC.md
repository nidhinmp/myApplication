# Universal POS (Point of Sale) System - Specification Document

## 1. Project Overview

**Project Name:** UniversalPOS  
**Project Type:** Full-stack Web Application (Spring Boot + Angular)  
**Core Functionality:** A highly customizable Point of Sale system for malls, restaurants, retail stores, and various business types.  
**Target Users:** 
- Mall administrators and store owners
- Restaurant managers and staff
- Retail shop operators
- Inventory managers
- Cashiers and checkout staff

---

## 2. Technology Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** PostgreSQL (production) / H2 (development)
- **Security:** Spring Security with JWT
- **API:** RESTful APIs
- **Build Tool:** Maven

### Frontend
- **Framework:** Angular 17+
- **UI Library:** Angular Material or PrimeNG
- **State Management:** NgRx or Services with BehaviorSubject
- **HTTP Client:** Angular HttpClient
- **Build Tool:** Angular CLI

---

## 3. Core Features

### 3.1 Multi-Business Type Support
- **Restaurant Mode:** Table management, order tracking, kitchen display, menu categories
- **Retail/Mall Mode:** Product catalog, barcode scanning, inventory tracking
- **Custom Mode:** Configurable layouts and workflows

### 3.2 Authentication & Authorization
- User roles: Admin, Manager, Cashier, Kitchen Staff, Inventory Manager
- Role-based access control (RBAC)
- Multi-store/branch support
- Activity logging and audit trail

### 3.3 Product/Menu Management
- Categories and sub-categories
- Product variants (size, color, etc.)
- Pricing tiers and promotions
- Barcode support
- Image upload for products
- Composite/套餐 items

### 3.4 Sales/POS Screen
- Quick product selection (grid/list view)
- Search and filter
- Customer selection
- Discount application (percentage/fixed)
- Multiple payment methods
- Split payments
- Receipt generation (print/email)
- Order hold and recall

### 3.5 Order Management
- Real-time order status tracking
- Order modification
- Order history
- Kitchen display system (KDS) integration
- Table management (for restaurants)

### 3.6 Inventory Management
- Stock levels and alerts
- Stock transfers between branches
- Low stock notifications
- Inventory reports
- Batch/serial number tracking

### 3.7 Reports & Analytics
- Sales reports (daily, weekly, monthly)
- Product performance
- Staff performance
- Profit margins
- Export to Excel/PDF

### 3.8 Customer Management
- Customer profiles
- Loyalty points
- Purchase history
- Credit management

### 3.9 Settings & Customization (HIGHLY CUSTOMIZABLE)
- **Theme Customization:** Colors, logos, fonts
- **UI Layout:** Drag-and-drop dashboard widgets
- **Workflows:** Configure business processes
- **Tax Configuration:** Multiple tax rates
- **Currency Support:** Multi-currency
- **Language:** Multi-language support
- **Print Templates:** Custom receipt designs

---

## 4. Architecture

### 4.1 Backend Structure
```
src/main/java/com/universalpos/
├── config/          # Configuration classes
├── controller/      # REST Controllers
├── service/         # Business logic
├── repository/      # Data access (JPA)
├── model/          # Domain entities
├── dto/            # Data Transfer Objects
├── security/       # Security configuration
└── exception/      # Exception handling
```

### 4.2 Frontend Structure
```
src/
├── app/
│   ├── core/           # Singleton services, guards
│   ├── shared/         # Shared components, pipes
│   ├── features/       # Feature modules
│   │   ├── auth/
│   │   ├── pos/
│   │   ├── inventory/
│   │   ├── reports/
│   │   └── settings/
│   └── layout/         # Layout components
├── assets/             # Static assets
└── environments/       # Environment configs
```

---

## 5. Database Schema (Core Entities)

### Users & Authentication
- `User` - id, username, email, password, role, store_id
- `Role` - id, name, permissions
- `Store` - id, name, address, settings (JSON)

### Products/Menu
- `Category` - id, name, parent_id, store_id
- `Product` - id, name, description, price, category_id, image_url
- `ProductVariant` - id, product_id, name, sku, price, attributes
- `Modifier` - id, product_id, name, price (for restaurant modifiers)

### Orders & Sales
- `Order` - id, order_number, store_id, user_id, customer_id, status, total, created_at
- `OrderItem` - id, order_id, product_id, variant_id, quantity, price, modifiers
- `Payment` - id, order_id, method, amount, transaction_id

### Inventory
- `InventoryItem` - id, product_id, store_id, quantity, reorder_level
- `StockTransaction` - id, item_id, type, quantity, reference

### Customers
- `Customer` - id, name, email, phone, loyalty_points, credit_limit

---

## 6. API Endpoints (REST)

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/refresh`

### Products
- GET/POST `/api/products`
- GET/PUT/DELETE `/api/products/{id}`
- GET `/api/categories`

### Orders
- GET/POST `/api/orders`
- GET/PUT `/api/orders/{id}`
- POST `/api/orders/{id}/payments`
- GET `/api/orders/{id}/receipt`

### Inventory
- GET/POST `/api/inventory`
- PUT `/api/inventory/{productId}`

### Reports
- GET `/api/reports/sales`
- GET `/api/reports/inventory`
- GET `/api/reports/employees`

### Settings
- GET/PUT `/api/settings/store`
- GET/PUT `/api/settings/theme`
- GET/PUT `/api/settings/taxes`

---

## 7. UI/UX Requirements

### 7.1 POS Screen (Primary)
- Large touch-friendly buttons
- Quick category navigation
- Real-time cart display
- One-click payment options
- Split screen support (order + kitchen view)

### 7.2 Dashboard
- Today's sales summary
- Top products chart
- Low stock alerts
- Recent orders list

### 7.3 Responsive Design
- Desktop (admin, reports)
- Tablet (POS, inventory)
- Mobile (manager view)

### 7.4 Theme System
- Light/Dark mode
- Primary/Accent color customization
- Logo placement
- Font selection

---

## 8. Security Requirements

- JWT-based authentication
- Password hashing (BCrypt)
- Role-based authorization
- HTTPS only (production)
- Input validation and sanitization
- Rate limiting on login
- Audit logging

---

## 9. Development Phases

### Phase 1: Foundation
- Project setup
- Authentication system
- Basic user management

### Phase 2: Core POS
- Product management
- Order processing
- Payment handling

### Phase 3: Advanced Features
- Inventory management
- Reports & analytics
- Customer management

### Phase 4: Customization
- Theme system
- Settings panel
- Localization

---

## 10. Acceptance Criteria

1. ✅ User can log in with different roles
2. ✅ Products can be added, edited, deleted
3. ✅ Orders can be created and processed
4. ✅ Payments work with multiple methods
5. ✅ Reports generate correctly
6. ✅ Theme can be customized
7. ✅ Settings can be modified per store
8. ✅ System supports multiple business types
9. ✅ API is well-documented
10. ✅ Application is responsive

---

*This specification serves as a living document and will be updated as requirements evolve.*