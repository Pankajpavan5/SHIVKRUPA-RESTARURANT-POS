// Data shapes — the ground truth for Quick POS.
//
// Everything the app knows lives inside a single `state` object,
// persisted to localStorage under the key `quickpos_v5`.
//
// Write these BEFORE adding features. If the real state drifts, update
// this file first, then bump the LS_KEY (`quickpos_v5` → `v6`) and add
// a migration block in the load-time IIFE.

/**
 * @typedef {Object} ShopInfo
 * @property {string} name              // Display name, shown in header + drawer
 * @property {string} phone             // Free text, e.g. "+91 9876543210"
 * @property {number} taxPct            // GST/tax percent applied to (subtotal − discount)
 * @property {string} countryCode       // Digits only, e.g. "91"; prepended to WhatsApp/SMS numbers
 */

/**
 * @typedef {Object} ReceiptSettings
 * @property {string}  businessName
 * @property {boolean} showBusinessName
 * @property {string}  businessPhone
 * @property {boolean} showBusinessPhone
 * @property {string}  businessAddress
 * @property {boolean} showBusinessAddress
 * @property {string}  taxTitle          // e.g. "GSTIN"
 * @property {string}  taxNumber         // e.g. "WDSD1233H"
 * @property {boolean} showTax
 * @property {string}  website
 * @property {boolean} showWebsite
 * @property {string}  receiptTitle      // e.g. "Invoice"
 * @property {string}  logo              // base64 data URL, ≤240px JPEG
 * @property {boolean} showLogo          // Beta — some thermal printers garble it
 * @property {boolean} showRate
 * @property {boolean} showMRP
 * @property {boolean} showTotalSaved    // MRP − final; hidden if ≤0
 * @property {string}  cashierName
 * @property {boolean} showCashier
 * @property {boolean} showCustomerPhone
 * @property {boolean} showCustomerAddress
 * @property {string}  thankYouNote
 * @property {boolean} showItemCount
 * @property {boolean} showChangeReturn
 * @property {boolean} showPaymentDetails
 * @property {boolean} showPoweredBy
 * @property {'added'|'name'} orderItemsBy
 * @property {string}  messageTemplate   // supports #TOTAL, #BILL, #SHOP placeholders
 * @property {'wa'|'wab'} whatsappApp    // wa.me vs api.whatsapp.com
 */

/**
 * @typedef {Object} Category
 * @property {string} id                 // 'c' + timestamp
 * @property {string} name               // Referenced by MenuItem.cat (by NAME, not id — legacy)
 * @property {string} image              // base64 data URL or ''
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} id                 // 'm' + timestamp
 * @property {string} name
 * @property {number} price              // Selling price, ₹
 * @property {number} mrp                // 0 if not applicable; used with showMRP/showTotalSaved
 * @property {string} cat                // Category NAME (matches Category.name)
 * @property {string} image              // base64 data URL or ''
 */

/**
 * @typedef {Object} OrderLine
 * @property {string} id                 // same as MenuItem.id
 * @property {string} name               // snapshot at add-time
 * @property {number} price              // snapshot at add-time (bills survive menu edits)
 * @property {number} mrp                // snapshot at add-time
 * @property {number} qty                // ≥1; when it hits 0, line is removed
 */

/**
 * @typedef {Object} Discount
 * @property {'flat'|'percent'} type
 * @property {number} value              // ₹ for flat, % for percent
 */

/**
 * @typedef {Object} Table
 * @property {string} id                 // 't' + n or timestamp
 * @property {string} name               // e.g. "Table 3", user-editable
 * @property {OrderLine[]} order         // empty = free
 * @property {Discount} discount
 * @property {string|null} customerId    // → Customer.id, or null
 */

/**
 * @typedef {Object} Customer
 * @property {string} id                 // 'cu' + timestamp
 * @property {string} name
 * @property {string} phone              // digits only, no country code
 * @property {number} totalSpent         // ₹, auto-incremented on closeTable
 * @property {number} visitCount         // auto-incremented on closeTable
 * @property {number|null} lastVisit     // Date.now() timestamp, null if never
 * @property {number} createdAt
 */

/**
 * @typedef {Object} Bill                // A closed (paid) bill. Immutable.
 * @property {number} billNo             // state.lastBillNo, monotonically increasing
 * @property {number} ts                 // Date.now() at close
 * @property {string} tableName          // snapshot; tables can be renamed later
 * @property {OrderLine[]} items         // full snapshot at close
 * @property {Discount} discount
 * @property {number} taxPct             // snapshot; tax rate can change later
 * @property {number} subtotal           // computed
 * @property {number} mrpTotal           // computed
 * @property {number} discAmt            // ₹ actually applied (capped at subtotal)
 * @property {number} tax                // ₹
 * @property {number} total              // ₹, the grand total
 * @property {number} saved              // ₹ (mrpTotal − total), ≥0
 * @property {number} itemCount          // sum of qty
 * @property {{id:string,name:string,phone:string}|null} customer   // snapshot
 */

/**
 * @typedef {Object} Expense
 * @property {string} id                 // 'e' + timestamp
 * @property {number} ts
 * @property {string} note               // free text, e.g. "Milk"
 * @property {number} amt                // ₹, positive
 * @property {'Raw Materials'|'Salary'|'Rent'|'Utilities'|'Other'} cat
 */

/**
 * @typedef {Object} Staff
 * @property {string} id                 // 'st' + timestamp
 * @property {string} name
 * @property {string} role               // free text, e.g. "Waiter"
 * @property {number} wage               // ₹ per day (full day = full wage, half = ½)
 */

/**
 * @typedef {'P'|'H'|'A'} AttStatus      // Present / Half / Absent
 *
 * Attendance is keyed by ISO date string (yyyy-mm-dd) → { [staffId]: AttStatus }.
 * Missing staffId means "not marked" (not the same as Absent).
 *
 * @typedef {Object.<string, Object.<string, AttStatus>>} AttendanceMap
 */

/**
 * @typedef {Object} AppState            // The root state, saved to localStorage
 * @property {ShopInfo} shop
 * @property {ReceiptSettings} receiptSettings
 * @property {Category[]} categories
 * @property {Table[]} tables
 * @property {MenuItem[]} menu
 * @property {string|null} activeTable   // Table.id currently focused, or null
 * @property {number} lastBillNo         // last bill # issued; next = +1
 * @property {Bill[]} bills              // newest first, capped at 500
 * @property {Expense[]} expenses        // newest first
 * @property {Customer[]} customers
 * @property {Staff[]} staff
 * @property {AttendanceMap} attendance
 */

// ---------------------------------------------------------------------
// Invariants — things that must always be true.
//
// - state.activeTable, if set, references a real state.tables[i].id
// - Table.order lines with qty ≤ 0 are removed, never persisted
// - Table.customerId, if set, references a real Customer.id
// - MenuItem.cat matches a Category.name (case-sensitive) — renaming a
//   category cascades to all items via renameCat()
// - Bill entries are immutable once written; edits to menu/tax/discount
//   after close never affect past bills (all values are snapshotted)
// - Customer.totalSpent / visitCount are derived from bills but stored
//   for O(1) reads; recompute if a bill is ever deleted
// - All images are base64 JPEG, resized to ≤240px longest edge, quality 0.75
// - localStorage total per shop stays well under 5MB — cap history at 500 bills
// - LS_KEY changes on breaking schema changes; add a migration in the IIFE
// ---------------------------------------------------------------------

// Enums (kept as string literals in code — document them here so the AI
// doesn't invent new ones).

// PeriodTab:      'today' | 'week' | 'month' | 'all'
// OrderView:      'menu'  | 'bill'
// SendMode:       'wa'    | 'sms'
// DiscountType:   'flat'  | 'percent'
// ExpenseCat:     'Raw Materials' | 'Salary' | 'Rent' | 'Utilities' | 'Other'
// AttStatus:      'P' | 'H' | 'A'
// WhatsAppApp:    'wa' | 'wab'
// OrderItemsBy:   'added' | 'name'
