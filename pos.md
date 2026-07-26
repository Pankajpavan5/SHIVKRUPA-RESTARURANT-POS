# SHIVKRUPA RESTAURANT POS - System Documentation

> **Version:** Quick POS v5  
> **Storage:** LocalStorage (key: `quickpos_v5`)  
> **Technology:** Single HTML file (Vanilla JS, CSS)  
> **Theme Color:** `#3d5afe` (Blue)

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [State Structure](#state-structure)
3. [User Interface Layout](#user-interface-layout)
4. [Core Workflows](#core-workflows)
5. [Features & Modules](#features--modules)
6. [Data Models](#data-models)
7. [Key Functions](#key-functions)
8. [Configuration & Settings](#configuration--settings)
9. [Print & Export](#print--export)
10. [Integration Points](#integration-points)

---

## 🏗️ Architecture Overview

### Single-File Architecture
- **index.html** contains all HTML, CSS, and JavaScript
- No external dependencies or build process required
- Data persisted via `localStorage` using JSON serialization
- Responsive mobile-first design with touch-friendly UI

### State Management
```javascript
const LS_KEY = 'quickpos_v5';
let state = load() || { /* default state */ };
function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function load() { return JSON.parse(localStorage.getItem(LS_KEY)); }
```

### Migration System
Auto-runs on load to handle schema changes:
- Category format migration (string → object)
- Missing field initialization
- Receipt settings sync with shop settings

---

## 📦 State Structure

```javascript
state = {
  shop: {
    name: string,        // "My Cafe"
    phone: string,       // Contact number
    taxPct: number,      // Tax percentage (default: 5)
    countryCode: string  // Country code for SMS/WhatsApp (default: "91")
  },
  
  receiptSettings: {
    businessName: string, showBusinessName: boolean,
    businessPhone: string, showBusinessPhone: boolean,
    businessAddress: string, showBusinessAddress: boolean,
    taxTitle: string, taxNumber: string, showTax: boolean,
    website: string, showWebsite: boolean,
    receiptTitle: string,
    logo: string (base64), showLogo: boolean,
    showRate: boolean, showMRP: boolean, showTotalSaved: boolean,
    cashierName: string, showCashier: boolean,
    showCustomerPhone: boolean,
    customerAddress: string, showCustomerAddress: boolean,
    thankYouNote: string,
    showItemCount: boolean, showChangeReturn: boolean,
    showPaymentDetails: boolean, showPoweredBy: boolean,
    orderItemsBy: 'added' | 'name',
    messageTemplate: string,
    whatsappApp: 'wa' | 'wab'
  },
  
  categories: [
    { id: string, name: string, image: string (base64) }
  ],
  
  tables: [
    { 
      id: string,
      name: string,
      order: [OrderItem],
      discount: { type: 'flat' | 'percent', value: number },
      customerId: string | null
    }
  ],
  
  menu: [
    { id: string, name: string, price: number, cat: string, image: string, mrp: number }
  ],
  
  activeTable: string | null,
  lastBillNo: number,
  
  bills: [Bill],
  expenses: [Expense],
  customers: [Customer],
  staff: [Staff],
  attendance: { [dateKey: string]: { [staffId: string]: 'P' | 'A' | 'H' } }
}
```

---

## 🖥️ User Interface Layout

### Navigation Structure
```
┌─────────────────────────────────────┐
│  HEADER                             │
│  [☰] [Shop Name ▾] [👤+] [🌙] [📞] │
│  [🔍 Search...           ] [📷]    │
├─────────────────────────────────────┤
│                                     │
│  MAIN CONTENT AREA                  │
│  (Page-specific content)            │
│                                     │
├─────────────────────────────────────┤
│  [📊] [🧾] [🏪] [⋯]                │
│  Reports Today Counter More          │
└─────────────────────────────────────┘
```

### Pages (Sections)

| Page ID | Description | Route |
|---------|-------------|-------|
| `page-counter` | Home - New orders, open tables, expenses | Default |
| `page-reports` | KPI dashboard, sales chart, top items | Bottom nav |
| `page-today` | Transaction log with filtering | Bottom nav |
| `page-more` | Settings hub with grouped options | Bottom nav |

### Modal Pages (Full-screen overlays)

| Modal ID | Description |
|----------|-------------|
| `mp-shop` | Shop details editor |
| `mp-receipt` | Receipt customization |
| `mp-items` | Menu items & categories manager |
| `mp-tblEdit` | Table management |
| `mp-att` | Staff attendance calendar |
| `mp-staff` | Staff roster manager |
| `mp-tables` | Table picker for new order |
| `mp-order` | Order entry (menu view / bill view) |
| `mp-kot` | Kitchen Order Ticket preview/print |

### Pop-up Modals

| Modal ID | Description |
|----------|-------------|
| `#sendModal` | Send bill via WhatsApp/SMS |
| `#historyModal` | View past bill details |
| `#expenseModal` | Add expense entry |
| `#customerModal` | Customer picker/adder |
| `#attDayModal` | Mark daily attendance |

### Drawer (Side menu)
- Opens from hamburger menu (☰)
- Contains navigation to all sections
- Shows shop name and phone

---

## 🔄 Core Workflows

### 1. New Order Flow

```
[Counter] → Click "NEW ORDER" → [Table Picker] → Select Table
                                              ↓
                                         [Order Page]
                                         - Add Customer (optional)
                                         - Search/Select Menu Items
                                         - Adjust quantities
                                         - Apply discounts
                                              ↓
                                    [View Bill] (toggle)
                                         - Review totals
                                         - Print receipt
                                         - Send WhatsApp/SMS
                                              ↓
                                    [Close Table (Paid)]
                                              ↓
                                    Bill saved to history
```

**Key Functions:**
- `startNewOrder()` → Opens table picker
- `openOrder(tableId)` → Opens order page
- `addItemToOrder(item)` → Adds item to active table
- `closeTable()` → Finalizes sale, saves bill

### 2. Quick Search Flow

```
[Header Search] → Type query → Live filtered results
                                   ↓
                            Click item
                                   ↓
                    If no active table → Start new order
                    Else → Add to order, open order page
```

### 3. Bill Calculation

```javascript
function calcTotals(order, discount, taxPct) {
  subtotal = order.reduce((s,o) => s + o.price * o.qty, 0)
  mrpTotal = order.reduce((s,o) => s + max(o.mrp, o.price) * o.qty, 0)
  
  discAmt = discount.type === 'percent' 
    ? subtotal * discount.value / 100 
    : discount.value
  
  taxable = subtotal - discAmt
  tax = taxable * taxPct / 100
  total = taxable + tax
  saved = mrpTotal - total (if > 0)
  
  return { subtotal, mrpTotal, discAmt, tax, total, saved, itemCount }
}
```

### 4. Attendance Tracking

```
[More] → [Staff Attendance] → Calendar View
                                       ↓
                              Select Date (past/today only)
                                       ↓
                              [Attendance Modal]
                              - Mark Present/Half/Absent per staff
                                       ↓
                              Save to state.attendance[dateKey]
```

### 5. Customer Management

```
[Customer Icon in Header] → [Customer Modal]
                                   ↓
              ┌────────────────────┼────────────────────┐
              ↓                    ↓                    ↓
        Search/View          Add New Customer      Select Existing
              ↓                    ↓                    ↓
        Click to edit         Enter name, phone    Attach to current
        or delete             Validate & save      order (custPickerMode)
```

---

## 🛠️ Features & Modules

### 1. Menu Management

**Categories:**
- Default: Beverages, Snacks, Main Course, Desserts
- Custom categories with optional image
- Rename cascades to all menu items
- Delete reassigns items to first category

**Menu Items:**
- Fields: id, name, price, category, image (base64), mrp
- Inline editing with live save
- Image upload with auto-resize (max 240px)
- Bulk delete with confirmation

**Default Menu Items:**
| Item | Price | Category |
|------|-------|----------|
| Masala Chai | ₹20 | Beverages |
| Coffee | ₹40 | Beverages |
| Cold Coffee | ₹100 | Beverages |
| Lassi | ₹60 | Beverages |
| Veg Sandwich | ₹80 | Snacks |
| Cheese Sandwich | ₹110 | Snacks |
| French Fries | ₹90 | Snacks |
| Paneer Roll | ₹120 | Main Course |

### 2. Table Management

- Default: 8 tables (Table 1-8)
- Visual status: Free vs Occupied (highlighted)
- Occupied shows: item count, total amount
- Real-time sync with orders

**Table Object:**
```javascript
{
  id: 't1',
  name: 'Table 1',
  order: [],      // Current order items
  discount: { type: 'flat', value: 0 },
  customerId: null
}
```

### 3. Customer Management

**Customer Object:**
```javascript
{
  id: 'cu1234567890',
  name: string,
  phone: string,
  totalSpent: number,
  visitCount: number,
  lastVisit: timestamp,
  createdAt: timestamp
}
```

**Features:**
- Search by name or phone
- View spending history
- Attach to order for bill
- Edit or delete (auto-detaches from tables)

### 4. Staff & Attendance

**Staff Object:**
```javascript
{
  id: 'st1234567890',
  name: string,
  role: string,    // e.g., "Waiter", "Cook"
  wage: number     // Daily wage
}
```

**Attendance Status:**
| Code | Meaning | Wage Calculation |
|------|---------|-----------------|
| `P` | Present | Full daily wage |
| `H` | Half Day | ½ daily wage |
| `A` | Absent | ₹0 |

**Calendar View:**
- Color-coded: Green (all present), Yellow (mixed), Red (all absent)
- Month navigation with future date lock
- Day detail modal for per-staff marking

### 5. Expense Tracking

**Expense Object:**
```javascript
{
  id: 'e1234567890',
  ts: timestamp,
  note: string,
  amt: number,
  cat: 'Raw Materials' | 'Salary' | 'Rent' | 'Utilities' | 'Other'
}
```

### 6. Reports & Analytics

**KPI Dashboard:**
- Revenue (total sales)
- Expenses (operations + wages)
- Net Profit (Revenue - Expenses)
- Customer Count (unique)
- Average Bill Value

**Sales Chart:**
- SVG-based bar chart
- Dynamic days: 7 (today/week), 30 (month/all)
- Shows daily revenue
- Today's bar highlighted in green

**Top Selling Items:**
- Ranked by revenue
- Shows quantity sold and revenue

### 7. Bill History

- Filterable by period (Today, Week, Month, All)
- Search by bill number, table, customer name
- Color-coded: Sales (blue), Expenses (red)
- Resend bill via WhatsApp/SMS

### 8. Receipt Customization

**Business Info:**
- Business name, phone, address
- Tax title (GSTIN) and number
- Website
- Receipt title

**Display Options:**
- Show/hide logo (base64 image)
- Show/hide: rate, MRP, total saved, cashier name
- Customer phone and address
- Item count, change return, payment details
- "Powered by Quick POS" footer

**Message Template:**
- Placeholders: `#TOTAL`, `#BILL`, `#SHOP`
- Prepended to receipt text in messages

### 9. Dark Mode

- Toggle via header icon or drawer
- Persisted in `localStorage`
- Full color scheme inversion
- Chart colors adapt automatically

---

## 📊 Data Models

### Bill (Invoice)

```javascript
{
  billNo: number,        // Auto-incremented
  ts: timestamp,        // Creation time
  tableName: string,
  items: [{
    id: string,
    name: string,
    price: number,
    mrp: number,
    qty: number
  }],
  discount: { type: 'flat' | 'percent', value: number },
  taxPct: number,
  subtotal: number,
  mrpTotal: number,
  discAmt: number,
  tax: number,
  total: number,
  saved: number,
  itemCount: number,
  customer: { id, name, phone } | null
}
```

### Order Item (In-Progress)

```javascript
{
  id: string,     // References menu item
  name: string,
  price: number,
  mrp: number,
  qty: number
}
```

### Attendance Record

```javascript
// state.attendance is a nested object:
{
  '2024-01-15': {           // dateKey: 'yyyy-mm-dd'
    'st123': 'P',           // staffId: status
    'st456': 'H',
    'st789': 'A'
  },
  '2024-01-16': {
    'st123': 'P'
  }
}
```

---

## 🔧 Key Functions

### Navigation
| Function | Description |
|----------|-------------|
| `goto(page)` | Switch main page, update nav highlight, refresh content |
| `openDrawer()` | Show side drawer |
| `closeDrawer()` | Hide side drawer |
| `closeModalPage(id)` | Close full-screen modal |

### Order Management
| Function | Description |
|----------|-------------|
| `startNewOrder()` | Open table picker |
| `openOrder(tableId)` | Open order for specific table |
| `addItemToOrder(item)` | Add item to active table order |
| `changeQty(itemId, delta)` | Increment/decrement item quantity |
| `closeTable()` | Finalize sale, save bill, clear table |

### Billing
| Function | Description |
|----------|-------------|
| `calcTotals(order, discount, taxPct)` | Calculate all bill amounts |
| `renderBillInside()` | Render bill view with totals |
| `setDiscountType(type)` | Switch flat/percent discount |
| `setDiscountValue(amount)` | Update discount amount |

### Menu & Catalog
| Function | Description |
|----------|-------------|
| `renderCatTabs()` | Render category filter tabs |
| `renderMenuList()` | Render filtered menu items |
| `renderMenuEditor()` | Render menu editor in settings |
| `addMenuItem()` | Add new blank menu item |
| `removeMenuItem(index)` | Delete menu item |

### Customers
| Function | Description |
|----------|-------------|
| `openCustomerPicker(attachMode)` | Open customer modal |
| `renderCustomerList()` | Render filtered customer list |
| `selectCustomer(id)` | Attach or manage customer |
| `addCustomerFromModal()` | Create new customer |

### Attendance
| Function | Description |
|----------|-------------|
| `renderAttendance()` | Render calendar view |
| `openAttDay(dateKey)` | Open day attendance modal |
| `markAtt(dateKey, staffId, status)` | Mark attendance for staff |
| `calculateWagesForPeriod(cutoff)` | Sum wages for date range |

### Reports
| Function | Description |
|----------|-------------|
| `renderReport()` | Generate KPI dashboard |
| `renderSalesChart(days)` | Generate SVG sales chart |
| `renderTodayLog()` | Render transaction history |

### Communication
| Function | Description |
|----------|-------------|
| `openSendModal(mode)` | Open send bill modal |
| `sendWhatsApp()` | Open WhatsApp with bill text |
| `sendSMS()` | Open SMS app with bill text |
| `buildBillText(source)` | Format bill as text |
| `buildTemplateMessage(source)` | Format with message template |

### Data Management
| Function | Description |
|----------|-------------|
| `save()` | Persist state to localStorage |
| `load()` | Load state from localStorage |
| `exportData()` | Download JSON backup |
| `importData(event)` | Restore from JSON file |
| `resetAll()` | Clear all data |

### Utilities
| Function | Description |
|----------|-------------|
| `resizeImage(file, maxSize)` | Resize and compress image to base64 |
| `handleImageUpload(e, cb)` | Handle file input, resize, callback |
| `dateKey(y, m, d)` | Format date as 'yyyy-mm-dd' |

---

## ⚙️ Configuration & Settings

### Shop Settings
```javascript
// Fields
shop.name        // Display name
shop.phone       // Contact number
shop.taxPct      // Tax percentage (e.g., 5 for 5%)
shop.countryCode // For WhatsApp/SMS (e.g., "91")
```

### Receipt Settings (ReceiptOptions)

**Business Info Section:**
- `businessName`, `showBusinessName`
- `businessPhone`, `showBusinessPhone`
- `businessAddress`, `showBusinessAddress`
- `taxTitle` (default: "GSTIN"), `taxNumber`, `showTax`
- `website`, `showWebsite`
- `receiptTitle` (default: "Invoice")

**Logo Section:**
- `logo` (base64 encoded)
- `showLogo` (with warning about printer compatibility)

**Display Options:**
- `showRate` - Show per-item rate in receipt
- `showMRP` - Show MRP (for comparison)
- `showTotalSaved` - Show savings vs MRP
- `showCashier`, `cashierName`
- `showCustomerPhone`
- `showCustomerAddress`
- `showItemCount`
- `showChangeReturn`
- `showPaymentDetails`
- `showPoweredBy`

**Message Options:**
- `orderItemsBy` - 'added' | 'name'
- `thankYouNote` - Custom message
- `messageTemplate` - With placeholders `#TOTAL`, `#BILL`, `#SHOP`
- `whatsappApp` - 'wa' | 'wab'

---

## 🖨️ Print & Export

### Receipt Printing
- Triggered by `window.print()` in bill view
- CSS `@media print` hides navigation and action buttons
- Dark mode styles inverted for printing

### KOT (Kitchen Order Ticket)
```javascript
// KOT Structure
{
  tableName: string,
  date: string,
  time: string,
  orderNumber: lastBillNo + 1,
  items: [{ name, qty }],
  totalItems: number,
  copyType: "Kitchen Copy"
}
// KOT hides: prices, customer info
// Can send to WhatsApp or copy to clipboard
```

### Data Export/Import
```javascript
// Export format: JSON file
// Filename: quickpos-backup-YYYY-MM-DD.json

// Import: FileReader → JSON.parse → state reassignment
// Triggers: location.reload()
```

---

## 🔗 Integration Points

### WhatsApp Integration
```javascript
// Regular WhatsApp
const url = `https://wa.me/${num}?text=${text}`;

// WhatsApp Business
const url = `https://api.whatsapp.com/send?phone=${num}&text=${text}`;
```

### SMS Integration
```javascript
// Uses SMS URI scheme
window.location.href = `sms:${num}?body=${text}`;
```

### Barcode Scanner
```javascript
// Requires camera + HTTPS
onclick="alert('Barcode scanner needs camera + HTTPS.')"
```

---

## 🎨 Styling

### Color Palette
| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary | `#3d5afe` (Blue) | `#60a5fa` |
| Success | `#00c853` (Green) | `#4ade80` |
| Danger | `#ef4444` (Red) | `#f87171` |
| Warning | `#ffc107` (Amber) | `#f59e0b` |
| Background | `#e9ecef` | `#0f172a` |
| Cards | `#ffffff` | `#1e293b` |

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- No external font dependencies

### Responsive Design
- Mobile-first approach
- Grid layouts with `auto-fill` and `minmax`
- Touch-friendly tap targets (min 44px)
- Safe area insets for notched devices

---

## 🔒 Data Limits

| Data Type | Limit |
|-----------|-------|
| Bills stored | 500 (oldest trimmed) |
| Image size | Max 240px dimension |
| Image format | JPEG at 75% quality |
| Search results | 8 items max |
| Chart days | 7 or 30 |

---

## 🚀 Usage Instructions

### For AI Agents

1. **Understanding State:** Read `state` object to understand current POS data
2. **Modifying Menu:** Use `state.menu.push()` or array methods
3. **Adding Tables:** Use `state.tables.push()` with proper structure
4. **Recording Sales:** Use `state.bills.unshift()` to add new bills
5. **Customer Updates:** Modify `state.customers` array
6. **Attendance:** Update `state.attendance[dateKey][staffId]`
7. **Always call `save()`** after modifying state
8. **For bill totals:** Use `calcTotals()` instead of manual calculation

### Common Operations

**Add a new menu item:**
```javascript
state.menu.push({
  id: 'm' + Date.now(),
  name: 'New Item',
  price: 100,
  cat: 'Main Course',
  image: '',
  mrp: 0
});
save();
```

**Create a new bill:**
```javascript
state.lastBillNo++;
state.bills.unshift({
  billNo: state.lastBillNo,
  ts: Date.now(),
  tableName: 'Table 1',
  items: [...],
  // ... other fields from calcTotals()
});
save();
```

**Mark attendance:**
```javascript
const dateKey = '2024-01-15';
if (!state.attendance[dateKey]) state.attendance[dateKey] = {};
state.attendance[dateKey]['staff-123'] = 'P'; // Present
// or 'H' for half-day, 'A' for absent
save();
```

---

## 📝 Notes

- All monetary values stored as numbers (not strings)
- Timestamps in milliseconds (Unix epoch)
- Dates formatted as `yyyy-mm-dd` strings
- Images stored as base64 data URLs
- No network requests (fully offline capable)
- Single user, single device (no sync)

---

*Document generated for AI comprehension and code modification guidance.*
