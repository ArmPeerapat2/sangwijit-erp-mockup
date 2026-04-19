# IA — Integration & API Module Spec

**Version:** 1.0  
**Phase:** P2 + P3  
**Module Code:** IA  
**Last Updated:** 2026-04-12

---

## Overview

The Integration & API module provides visibility into all API calls between the Portal and BC. Since the Portal uses a single BC Service Account and all data flows through APIs, this module is critical for monitoring system health and debugging issues.

**Key Purpose:**
- Portal is UI layer only; all data comes from BC REST API
- Single BC Service Account used (no per-user BC licenses)
- IA module = admin visibility tool for API health, errors, and sync status

**Access Control:** IA module visible ONLY to System Admin role. Hidden from all other roles.

---

## Menu Structure & Module Specifications

### IA-Q: API Monitor Dashboard

**Module Brief:**  
Real-time overview of API performance, sync health, and error rates. Single-page dashboard with auto-refresh.

**Dashboard Widgets:**

1. **API Performance Metrics (Top Section)**
   ```
   ┌─────────────────────────────────────────┐
   │ Total API Calls Today:     12,453        │
   │ Success Rate:              98.7%         │
   │ Average Response Time:     145 ms        │
   │ Error Count:               160 (1.3%)    │
   │ Last BC Sync:              2 min ago     │
   │ BC API Health:             🟢 GREEN      │
   └─────────────────────────────────────────┘
   ```

2. **Module Sync Status (Table)**
   ```
   Module      Last Sync    Status    Records  Next Sync  Errors
   ────────────────────────────────────────────────────────────
   MD-1        2026-04-12   ✓ OK      9,843    14:30      0
                14:15:32
   MD-2        2026-04-12   ✓ OK      5,221    14:25      0
                14:12:05
   MD-3        2026-04-12   ✓ OK      1,987    14:20      0
                14:10:18
   MD-4        2026-04-12   ✓ OK      456      14:35      0
                14:18:42
   PM-1        2026-04-12   ⚠ WARN    234      14:15      3
                14:08:33                               (old)
   SO          2026-04-12   ✓ OK      87       14:32      0
                14:14:20
   PO          2026-04-12   ✓ OK      42       14:28      0
                14:11:15
   AR/AP       2026-04-12   ✓ OK      156      14:25      1
                14:09:50
   GL          2026-04-12   ✓ OK      2,341    14:30      0
                14:16:11
   ```

3. **API Call Volume (Line Chart)**
   - X-axis: Time (past 24 hours)
   - Y-axis: # of calls
   - Green area = successful, Red area = failed
   - Trend line showing peak times

4. **Error Rate Trend (Line Chart)**
   - X-axis: Time (past 7 days)
   - Y-axis: % error rate
   - Target line at 2% (red zone = >2%)

5. **Top 5 Slowest Endpoints (Bar Chart)**
   - Endpoint name
   - Avg response time (ms)
   - # of calls today
   - Status (OK, Warning, Critical)

6. **Quick Actions**
   - Refresh Now button (force sync)
   - Run Health Check button
   - Download Daily Report (PDF)
   - Settings button (auto-refresh interval)

**Auto-Refresh:**
- Default: Every 30 seconds
- Configurable: 10s / 30s / 60s / 5 min / Manual

**Color Coding:**
- 🟢 GREEN: All good (response time <200ms, error rate <1%)
- 🟡 YELLOW: Caution (response time 200-500ms, error rate 1-2%)
- 🔴 RED: Critical (response time >500ms, error rate >2%)

**BC API Health Indicator:**
- Pings BC every 60 seconds
- Checks Auth token validity
- Returns: GREEN (responsive) / RED (timeout or error)
- Shows last successful connection time

---

### IA-1: BC Sync Monitor (ติดตามการ Sync BC)

**Module Brief:**  
Table view of all module sync schedules and results. Allows manual sync trigger per module.

**Key Screen:**

| Module | Entity | Last Sync Time | Records Synced | Status | Next Sync | Sync Duration | Trigger Manual Sync |
|--------|--------|----------------|----------------|--------|-----------|----------------|-------------------|
| MD-1 | Items (27) | 2026-04-12 14:15:32 | 9,843 | ✓ OK | 14:30 | 3.2 sec | [Sync Now] |
| MD-2 | Customers (18) | 2026-04-12 14:12:05 | 5,221 | ✓ OK | 14:25 | 2.8 sec | [Sync Now] |
| MD-3 | Vendors (23) | 2026-04-12 14:10:18 | 1,987 | ✓ OK | 14:20 | 1.9 sec | [Sync Now] |
| MD-4 | Employees | 2026-04-12 14:18:42 | 456 | ✓ OK | 14:35 | 0.8 sec | [Sync Now] |
| MD-5 | Locations (14) | 2026-04-12 14:16:11 | 142 | ✓ OK | 14:45 | 0.6 sec | [Sync Now] |
| PM-1 | Sales Prices (7002) | 2026-04-12 14:08:33 | 234 | ⚠ WARN | 14:15 | 4.1 sec | [Sync Now] |
| PM-2 | Promotions | 2026-04-12 13:45:00 | 18 | ✓ OK | 14:45 | 0.9 sec | [Sync Now] |
| SO | Sales Orders (36) | 2026-04-12 14:14:20 | 87 | ✓ OK | 14:32 | 1.5 sec | [Sync Now] |
| PO | Purchase Orders (39) | 2026-04-12 14:11:15 | 42 | ✓ OK | 14:28 | 1.2 sec | [Sync Now] |
| AR/AP | Invoices | 2026-04-12 14:09:50 | 156 | ✓ OK | 14:25 | 2.1 sec | [Sync Now] |
| GL | GL Entries (17) | 2026-04-12 14:16:11 | 2,341 | ✓ OK | 14:30 | 6.7 sec | [Sync Now] |

**Columns:**
- **Module:** Portal module code (MD-1, PM-1, etc.)
- **Entity:** BC table name + # of fields synced
- **Last Sync Time:** ISO 8601 timestamp of last successful sync
- **Records Synced:** Count of records retrieved in last sync
- **Status:** ✓ OK / ⚠ WARN (old) / 🔴 ERROR / ⏳ IN PROGRESS
- **Next Sync:** Scheduled time for next automatic sync (cron-based)
- **Sync Duration:** Milliseconds taken for last sync (excludes network latency)
- **Trigger Manual Sync:** Button to force immediate sync

**Filters:**
- Date Range (From/To)
- Module dropdown (All / MD / PM / SO / PO / AR / GL)
- Status dropdown (All / OK / Warning / Error)

**Detailed View (Click on row):**
```
Module: MD-1 (Item Master)
Last Sync: 2026-04-12 14:15:32
Duration: 3.2 sec
Records: 9,843 items
BC Endpoint: GET /api/companies/{id}/items?$top=1000
Query Parameters:
  - $filter=active eq true
  - $orderby=modifiedDateTime desc
  - $skip=0
Last Error: None
Sync Logs (last 5):
  2026-04-12 14:15:32: OK (9,843 records)
  2026-04-12 14:00:32: OK (9,843 records)
  2026-04-12 13:45:30: OK (9,843 records)
  2026-04-12 13:30:32: OK (9,843 records)
  2026-04-12 13:15:31: OK (9,843 records)
```

**Sync Schedule Configuration:**
| Module | Sync Frequency | Time Window |
|--------|----------------|-------------|
| MD-1 | Every 15 min | Business hours 8 AM - 6 PM |
| MD-2 | Every 15 min | Business hours |
| MD-3 | Every 15 min | Business hours |
| MD-4 | Every 30 min | Business hours |
| MD-5 | Every 30 min | Business hours |
| PM-1 | Every 15 min | Business hours |
| PM-2 | Every 15 min | Business hours |
| SO | Every 5 min | 24/7 (transaction data) |
| PO | Every 5 min | 24/7 |
| AR/AP | Every 10 min | Business hours |
| GL | Every 30 min | Business hours |

**Access Control:**
- View: System Admin only
- Trigger Manual Sync: System Admin only
- Edit Sync Schedule: System Admin only (CF-3 authorization)

**BC API Calls:**
```
GET /api/companies/{id}/syncStatus?module={moduleCode}
GET /api/companies/{id}/syncStatus/history?module={moduleCode}&days=7
POST /api/companies/{id}/syncTrigger?module={moduleCode}
GET /api/companies/{id}/syncSchedule
PATCH /api/companies/{id}/syncSchedule/{moduleCode}
```

**Business Rules:**
- Sync triggered automatically per schedule; cannot be disabled but can be manually overridden
- If sync > 5 min duration, alert admin (possible BC performance issue)
- If sync fails 3 consecutive times, escalate alert to System Admin email
- Records synced count helps detect incomplete fetches
- Sync logs retained 30 days for audit trail

---

### IA-2: Error Log & Retry (Error Log & Retry)

**Module Brief:**  
Complete error log of all failed API calls with automatic and manual retry capability.

**Error Log Table:**

| Date | Time | Module | Endpoint | Method | HTTP Status | Error Message | Auto-Retry Count | Retry Button | View Stack Trace |
|------|------|--------|----------|--------|------------|---------------|-----------------|--------------|-----------------|
| 2026-04-12 | 13:47:23 | PM-1 | /api/companies/{id}/salesPriceLists | POST | 400 | Invalid field: DiscountPercentage must be 0-100 | 0 | [Retry] | [View] |
| 2026-04-12 | 13:22:18 | SO | /api/companies/{id}/salesOrders/{id}/post | POST | 401 | Authorization token expired | 3 | [Retry] | [View] |
| 2026-04-12 | 12:55:10 | MD-2 | /api/companies/{id}/customers | GET | 503 | BC service unavailable | 3 | [Retry] | [View] |
| 2026-04-12 | 12:30:45 | AR | /api/companies/{id}/invoices/{id} | PATCH | 409 | Document already posted; cannot modify | 0 | [Retry] | [View] |
| 2026-04-11 | 18:15:33 | GL | /api/companies/{id}/generalLedgerEntries | POST | 500 | Internal server error; check BC logs | 5 | [Retry] | [View] |

**Columns:**
- **Date / Time:** ISO 8601 timestamp of error occurrence
- **Module:** Portal module attempting operation (MD-1, PM-1, SO, etc.)
- **Endpoint:** BC REST API endpoint that failed
- **Method:** HTTP method (GET, POST, PATCH, DELETE)
- **HTTP Status:** 4xx (client error) / 5xx (server error) / Timeout
- **Error Message:** Human-readable error text from BC API response
- **Auto-Retry Count:** System auto-retried N times (max 3)
- **Retry Button:** Manual retry attempt (resets auto-retry count)
- **View Stack Trace:** Expand to see full request/response details

**Detailed Error View (Click row):**
```
Error ID: ERR-2026-04-12-13-47-23-001
Date: 2026-04-12 13:47:23 UTC
Severity: Medium (API 400 error; user action required)
Module: PM-1 (Price List)
Operation: Create new sales price list
User: admin@sangwijit.co
Client IP: 203.150.100.50
Request:
  POST /api/companies/{companyId}/salesPriceLists
  Content-Type: application/json
  {
    "code": "PL-RETAIL-001",
    "description": "Retail Price List",
    "itemNo": "ITEM-001",
    "price": 1500.00,
    "discountPercentage": 150    <-- ERROR: must be 0-100
  }
Response:
  HTTP 400 Bad Request
  {
    "error": {
      "code": "INVALID_FIELD",
      "message": "Invalid field: DiscountPercentage must be between 0 and 100",
      "details": "Field 'discountPercentage' value 150 exceeds maximum of 100"
    }
  }
Status: REQUIRES_MANUAL_FIX
Action: User must correct discountPercentage to 0-100 range and retry
Retry Count: 0/3 (manual retry available)
Last Retry: Never
```

**Automatic Retry Policy:**
```
On Error:
  If HTTP 5xx (Server Error):
    Retry 1 after 5 sec
    Retry 2 after 15 sec
    Retry 3 after 60 sec
  If Timeout (>30 sec no response):
    Retry 1 after 10 sec
    Retry 2 after 30 sec
    Retry 3 after 120 sec
  If HTTP 4xx (Client Error):
    No auto-retry (requires user fix)
  If HTTP 401 (Auth expired):
    Refresh token and retry 1
    If still fails, escalate alert
```

**Filters:**
- Date range (From/To)
- Module dropdown (All / MD / PM / SO / PO / AR / GL / etc.)
- HTTP Status dropdown (All / 4xx / 5xx / Timeout)
- Severity dropdown (All / Critical / High / Medium / Low)
- User dropdown (filter by who triggered the error)
- Resolved status (All / Unresolved / Resolved / Ignored)

**Batch Actions:**
- [Retry Selected] — Manually retry multiple errors at once
- [Mark as Resolved] — Hide resolved errors from main list
- [Export to CSV] — Download error log for analysis
- [Clear Before Date] — Delete old error logs (retention policy)

**Alert Escalation:**
- 1 error: Log only; no alert
- 3+ errors in 1 hour from same endpoint: Email System Admin
- 10+ errors in 1 hour: SMS alert + email (critical)
- Auth token errors (401): Immediate alert (token refresh may fail)
- All 5xx errors: Auto-alert after 3 failed retries

**Data Retention:**
- Error logs: 90 days (PDPA compliance; includes PII)
- After 90 days: Auto-archive to encrypted storage for audit trail
- Archive retention: 5 years (tax/legal requirement)

**Access Control:**
- View: System Admin only
- Retry: System Admin only
- Resolve/Ignore: System Admin only
- Export: System Admin only (CSV contains error details)

**BC API Calls:**
```
GET /api/companies/{id}/errorLog?$filter=date ge {dateFrom} and date le {dateTo}
GET /api/companies/{id}/errorLog/{id}
POST /api/companies/{id}/errorLog/{id}/retry
PATCH /api/companies/{id}/errorLog/{id}/mark?status=Resolved
GET /api/companies/{id}/errorLog/stats?module={moduleCode}&days=7
DELETE /api/companies/{id}/errorLog?dateBefore={date}
```

**Business Rules:**
- 4xx errors (client errors) indicate user/data issue; no auto-retry
- 5xx errors (BC server errors) trigger auto-retry up to 3 times
- Timeout errors (>30 sec) also auto-retry (network/load issue)
- Auth token errors (401): System auto-refreshes token and retries
- If auth token refresh fails: Lock module access + alert admin (security issue)
- Manual retry resets count to 0/3; new auto-retry sequence begins
- All retries logged; audit trail shows who triggered + result
- Error message sanitized to hide sensitive data (passwords, API keys)

---

### IA-3: Webhook Config (Webhook Configuration)

**Module Brief:**  
Configure BC→Portal webhooks for real-time event notifications (document posted, approved, etc.).

**Key Settings:**

| Setting | Type | Mandatory | Notes |
|---------|------|-----------|-------|
| **Webhook Event** | | | |
| Event Code | Text(20) | ✓ | E.g., "DOC_POSTED", "APPROVAL_REQUIRED", "INVENTORY_LOW" |
| Event Description | Text(200) | ✓ | Human-readable description |
| Trigger Condition | Lookup | ✓ | Document Type + Status Change (e.g., SO posted, PO approved) |
| **Webhook Endpoint** | | | |
| Webhook URL | Text(500) | ✓ | Portal endpoint to receive webhook (e.g., https://sangwijit-portal.com/api/webhooks/document-posted) |
| HTTP Method | Choice | ✓ | POST (standard) / PUT (if updating) |
| Retry Policy | Choice | ✓ | 3-Retry / 5-Retry / No-Retry |
| Timeout (Seconds) | Number | ✓ | Max wait for response (e.g., 30 sec) |
| **Webhook Payload** | | | |
| Include Full Document | Boolean | ✓ | True = send entire document JSON; False = send metadata only |
| Include Audit Trail | Boolean | ✗ | True = include change history |
| Include GL Impact | Boolean | ✗ | True = include GL entries posted |
| Custom Fields | Multi-select | ✗ | Additional fields to include in payload |
| **Security** | | | |
| Authentication Type | Choice | ✓ | None / OAuth2 / API Key / Custom Header |
| OAuth2 Credentials | Text | ✗ | If OAuth2: client ID + secret (encrypted storage) |
| API Key | Text | ✗ | If API Key: key value (encrypted storage) |
| Custom Header Name | Text | ✗ | If Custom: header name (e.g., "X-Webhook-Signature") |
| Custom Header Value | Text | ✗ | Signature/token value |
| **Logging & Monitoring** | | | |
| Log All Webhook Calls | Boolean | ✓ | True = all calls logged in IA-2 (default) |
| Alert on Failure | Boolean | ✓ | True = email admin if webhook fails |
| **Activation** | | | |
| Active | Boolean | ✓ | True = webhook enabled; False = disabled |
| Effective From | Date | ✗ | Activation date |
| Effective To | Date | ✗ | Deactivation date (optional) |

**Webhook Events Supported:**

| Event Code | Document Type | Trigger | Payload includes |
|------------|---------------|---------|-----------------|
| DOC_POSTED | SO / PO / SI / PI | Document moved to Posted status | Document No., Amount, GL Entry #, Posting Date |
| APPROVAL_REQUIRED | SO / PO / SVCI | Document pending approval | Document No., Approver Role, Approval SLA deadline |
| APPROVAL_COMPLETED | SO / PO / SVCI | Approval chain finished (approved or rejected) | Document No., Approver Name, Decision (Approved/Rejected), Comments |
| DOCUMENT_CANCELLED | Any | Document status → Cancelled | Document No., Cancellation Reason, Cancelling User |
| INVENTORY_LOW | Item | Item stock falls below reorder point | Item No., Current Stock, Reorder Point, Warehouse Code |
| PRICE_CHANGED | Item / Price List | Item price or promotion changed | Item No., Old Price, New Price, Effective Date |
| CUSTOMER_BLOCKED | Customer | Customer status → Blocked | Customer No., Block Reason |
| VENDOR_RATING_CHANGED | Vendor | Vendor rating changed | Vendor No., Old Rating, New Rating |
| PAYMENT_RECEIVED | AR Invoice | Payment posted | Invoice No., Amount, Payment Date, Payment Method |
| PAYMENT_DUE | AP Invoice | Invoice due date approaching (1 day before) | Invoice No., Vendor No., Due Date, Amount |

**Example Webhook Payload (DOC_POSTED event):**
```json
{
  "webhookId": "WH-001",
  "eventCode": "DOC_POSTED",
  "timestamp": "2026-04-12T14:30:00Z",
  "documentType": "SalesOrder",
  "document": {
    "no": "SO-2026-04-00123",
    "customerNo": "CUST-001",
    "customerName": "ABC Retail Co.",
    "amount": 125000.00,
    "currency": "THB",
    "postingDate": "2026-04-12",
    "status": "Posted"
  },
  "glEntries": [
    {
      "entryNo": 5001,
      "accountNo": "4100",
      "amount": 125000.00,
      "type": "Credit"
    }
  ],
  "postedBy": "admin@sangwijit.co",
  "signature": "sha256=abcd1234..." (if authentication enabled)
}
```

**Webhook Test Feature:**
- [Send Test Webhook] button sends sample payload to configured URL
- Displays response status and response body
- Useful for testing Portal→External integration before activating

**Webhook Call Logs (IA-2 Integration):**
- Every webhook call logged in IA-2 Error Log
- Success: HTTP 200-299
- Failure: HTTP 4xx/5xx or timeout
- Logs retained 90 days

**Access Control:**
- View: System Admin only
- Create/Edit: System Admin only
- Test: System Admin only
- Credentials encrypted: OAuth2 secrets + API keys never exposed in UI

**BC API Calls:**
```
GET /api/companies/{id}/webhookConfigs
POST /api/companies/{id}/webhookConfigs
PATCH /api/companies/{id}/webhookConfigs/{id}
DELETE /api/companies/{id}/webhookConfigs/{id}
POST /api/companies/{id}/webhookConfigs/{id}/test (send test payload)
GET /api/companies/{id}/webhookLogs?webhookId={id}&days=7
POST /api/companies/{id}/subscribeWebhook (register Portal endpoint with BC)
```

**Business Rules:**
- Webhook URL must be HTTPS (security requirement)
- Timeout must be 15-60 seconds (avoid BC API timeout)
- Retry policy: 3-retry = backoff 5s/15s/60s; 5-retry = backoff 5s/10s/30s/60s/300s
- Auth credentials stored encrypted; never exposed in UI/logs
- Custom headers can include JWT for advanced authentication
- Webhook call must complete before document post finalized (blocking call)
- If webhook fails even after retries, document still posted but alert issued (non-blocking)
- Rate limit: Max 100 webhook configs per company (avoid BC API saturation)

---

### IA-4: Marketplace Connector (Shopee/Lazada API key config) — P3

**Module Brief:**  
Configure integration with e-commerce marketplaces (Shopee, Lazada) for order sync and inventory sync.

**Key Settings:**

| Setting | Type | Mandatory | Notes |
|---------|------|-----------|-------|
| **Marketplace Setup** | | | |
| Marketplace | Choice | ✓ | Shopee / Lazada / Tokopedia / etc. |
| Marketplace Shop ID | Text(50) | ✓ | Marketplace-provided shop identifier |
| API Key | Text(500) | ✓ | Marketplace API authentication key (encrypted) |
| API Secret | Text(500) | ✓ | Marketplace API secret (encrypted) |
| Access Token | Text(500) | ✓ | OAuth access token (auto-refreshed) |
| Token Expiry | DateTime | — | Auto-managed; refreshed before expiry |
| **Sync Configuration** | | | |
| Sync Orders | Boolean | ✓ | True = fetch orders from marketplace → create SO in BC |
| Order Sync Interval | Choice | ✓ | Real-time / Every 1 hour / Every 4 hours / Daily |
| Sync Inventory | Boolean | ✓ | True = sync item stock to marketplace |
| Inventory Sync Interval | Choice | ✓ | Real-time / Every 4 hours / Daily |
| Sync Promotion | Boolean | ✗ | True = marketplace promos linked to PM-2 |
| **Mapping Configuration** | | | |
| Item Code Mapping | Choice | ✓ | Use SKU / Use Internal Code / Use Barcode |
| Customer Mapping | Choice | ✓ | Create as new customer / Use existing customer group |
| Warehouse for Fulfillment | Lookup | ✓ | Which warehouse ships marketplace orders |
| Payment Gateway Account | Lookup | ✓ | AR account for marketplace payments |
| **Fulfillment Setup** | | | |
| Shipping Method | Choice | ✓ | Marketplace shipping / Third-party carrier |
| Auto-Generate Packing Slip | Boolean | ✓ | True = create delivery note automatically |
| Auto-Confirm Shipment | Boolean | ✓ | True = mark SO as shipped when GRN confirmed |
| Tracking Update | Boolean | ✓ | True = update marketplace with BC tracking #  |
| **Status Mapping** | | | |
| Marketplace Order Status | Lookup | ✓ | (Map to SO status) |
| BC Sales Order Status | Lookup | ✓ | Pending / Confirmed / Shipped / Delivered |
| **Currency & Pricing** | | | |
| Currency | Choice | ✓ | THB / USD / etc. (marketplace currency) |
| Price Sync Method | Choice | ✓ | Use standard price + margin / Use PM-1 price list / Manual |
| Cost Adjustment (%) | Decimal | ✗ | % markup from BC price to marketplace price |

**Sync Workflow:**

```
Marketplace (Shopee/Lazada)
        ↓ (Every 1 hour or real-time)
  Order Sync Job (IA-4)
        ↓
  Parse marketplace order
  Map items (barcode → Item Code)
  Map customer → Customer No.
  Calculate taxes per CF-1
        ↓
  Create Sales Order in BC
        ↓
  SO synced to Portal (MD sync)
        ↓
  Salesperson / WH Manager fulfills
        ↓
  GRN confirms shipment
        ↓
  Post SI (Sales Invoice)
        ↓
  Update marketplace: Shipped + Tracking #
```

**Inventory Sync (Outbound):**
```
WH Module: Stock Update
        ↓
  Update Item inventory in BC
        ↓
  Inventory Sync Job (IA-4, Every 4 hours)
        ↓
  Query item stock from BC
  Adjust for marketplace reserved qty
        ↓
  Update Marketplace: Available Qty
```

**Supported Marketplaces (Phase P3):**
- Shopee Thailand
- Lazada Thailand
- Tokopedia (future)
- Facebook Shop (future)

**Access Control:**
- View: System Admin, Sales Manager (read-only)
- Edit/Configure: System Admin only
- API Credentials: Encrypted; never displayed in plain text

**BC API Calls:**
```
GET /api/companies/{id}/marketplaceConfigs
POST /api/companies/{id}/marketplaceConfigs
PATCH /api/companies/{id}/marketplaceConfigs/{id}
GET /api/companies/{id}/marketplaceOrders?marketplace={code}&status=Pending
POST /api/companies/{id}/salesOrders/createFromMarketplace (create SO from marketplace order)
PATCH /api/companies/{id}/items/{id}/updateMarketplaceStock
GET /api/companies/{id}/marketplaceSync/status?marketplace={code}
```

**Business Rules:**
- API credentials encrypted using company's encryption key (security standard)
- Order sync creates SO in Draft status; requires Sales Manager review before posting
- Inventory sync accounts for reserved qty (orders awaiting shipment)
- Marketplace order → SO mapping 1:1 (one marketplace order = one SO)
- Item mapping via SKU lookup (marketplace SKU → BC Item Code)
- If item not found: SO created with "Unknown Item - Review Required" flag
- Pricing calculated: BC Standard Price + Cost Adjustment % = Marketplace Price
- Currency conversion if marketplace operates in different currency (uses BC exchange rate)
- Fulfillment: SO must be shipped via specified warehouse
- Sync jobs logged in IA-1 (BC Sync Monitor)
- Failed sync (e.g., item not found) alerts Sales Manager

---

### IA-5: BC Entity Explorer (BC Table Browser) — P3

**Module Brief:**  
Advanced tool for System Admin to browse and query any BC table, search fields, preview data.

**Key Features:**

1. **BC Entity Search**
   - Dropdown list of all BC tables (100+ tables)
   - Search box to filter table names
   - Quick access buttons: Items, Customers, Vendors, Orders, Invoices, GL

2. **Table Browser**
   - Display all fields in selected BC table
   - Preview first 100 rows (paginated)
   - Show field types: Text, Number, Date, Currency, Boolean, Lookup
   - Show key/indexed fields
   - Conditional formatting: Null values highlighted, errors flagged

3. **Advanced Query**
   ```
   Example: Query BC Items table
   Table: Item (27)
   Columns: Item No., Description, Cost Price, Active, UOM
   Filter: 
     WHERE (Active = True)
     AND (Cost Price > 0)
     AND (Category contains 'ELECTRIC')
   Sort By: Description ASC
   Limit: 1000
   [Execute Query]
   ```

4. **Data Export**
   - Export visible rows to CSV
   - Timestamp included
   - Sensitive data (PII, financial) flagged for audit

5. **Field Inspector**
   - Click field → show metadata
   - Data type, length, validation rules, relationship (if lookup)
   - Show which Portal modules use this field

6. **Search Data**
   - Global search: Find value across all tables
   - E.g., Search for "CUST-001" → finds in Customers, Sales Orders, Invoices

**Access Control:**
- View: System Admin only
- Query/Export: System Admin only
- Data protection: All queries logged for audit

**BC API Calls:**
```
GET /api/companies/{id}/metadata/tables
GET /api/companies/{id}/metadata/tables/{id}/fields
GET /api/companies/{id}/{tableName}?$top={limit}&$skip={offset}
GET /api/companies/{id}/{tableName}?$filter={filter}&$select={columns}&$orderby={sort}
POST /api/companies/{id}/dataExport?table={tableName}&format=csv
```

**Business Rules:**
- Query results limited to 1000 rows (avoid memory overload)
- Sensitive fields (passwords, API keys): Always hidden
- PII fields (Tax ID, Bank Account): Masked or hidden per PDPA
- Export logs captured (who, when, what data)
- Real-time query (live BC data, not cached)

---

## BC OAuth2 Service Account Strategy

**Single Service Account Model:**

```
Sangwijit ERP Portal (1 Portal instance)
        ↓
BC OAuth2: Client Credentials Flow
        ↓
Service Account: "Sangwijit Portal Service"
        ↓
Permissions: Read + Write all entities
        ↓
Licenses: 1 BC Service User License (cost-effective)
        ↓
Reason: Portal = UI layer; all users authenticate to Portal,
        not to BC directly. Portal uses service account for
        all BC API calls.
```

**Advantages:**
- Cost: 1 service user license vs. N user licenses
- Security: Portal controls access via RBAC (CF-3); BC doesn't manage individual users
- Performance: Service account can run background jobs (syncs, reports)

**Token Management:**
- Auth endpoint: https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
- Client ID: {bcServiceAppId}
- Client Secret: {bcServiceAppSecret} (encrypted in CF module)
- Scope: https://api.businesscentral.dynamics.com/.default
- Token lifetime: 60 minutes (standard)
- Token refresh: Auto-refreshed before expiry (background job)
- Token storage: Encrypted in Portal database; never exposed to browser

**Error Handling:**
```
If Token Refresh Fails (401 Unauthorized):
  → Alert System Admin (email + SMS)
  → Lock all Portal access
  → Require manual credential re-entry in CF-3
  → Restart Portal service to reload credentials
  
If BC API Rate Limit Exceeded (429 Too Many Requests):
  → Backoff: 5s, 15s, 60s, 300s (up to 3 retries)
  → If still fails: Queue request for later retry
  → Alert admin if sustained rate limit hit
  
If BC Service Unavailable (503):
  → Auto-retry 3 times (see IA-2 retry policy)
  → If still fails: Return error to user
  → Alert admin (BC maintenance check)
  
If Network Timeout (>30s no response):
  → Cancel request + retry 3 times
  → Log error in IA-2
  → User retries from Portal UI
```

---

## API Call Patterns & Best Practices

### Caching Strategy (Performance)

```
Frequently Read, Infrequently Changed (Cache 5-10 min):
  - Item Master (MD-1) → cache 10 min
  - Customer Master (MD-2) → cache 10 min
  - Price Lists (PM-1) → cache 5 min (prices change frequently)
  - Posting Groups (CF-4) → cache 60 min (rarely change)

Real-time Data (No Cache):
  - Sales Orders (SO) → fetch live
  - Purchase Orders (PO) → fetch live
  - Invoices (AR/AP) → fetch live
  - GL Entries → fetch live
  - Inventory (stock) → cache 2 min (WH updates frequently)

Calculation Results (Cache 5-30 min):
  - Promotion pricing (SC9) → cache 5 min (promos change infrequently)
  - Tax calculations (CF-1) → cache 60 min
  - Commission calculations (PM-4) → cache 1 min per employee
```

### Batch Operations

```
Create Multiple Items:
  DO: POST /api/companies/{id}/items (array of 10-20 items)
  DON'T: POST /api/companies/{id}/items (1 item per call)
  Benefit: Reduce API calls from 100 to 5-10

Update Customer Prices:
  DO: PATCH /api/companies/{id}/customers (batch with array)
  DON'T: Individual PATCH calls per customer
  
Sync Master Data:
  DO: GET /api/companies/{id}/items?$top=1000&$skip=0 (pagination)
  DON'T: GET without pagination (will timeout on 10K+ items)
```

### Rate Limiting Awareness

```
BC API Rate Limits (Per Service Account):
  - 600 requests per minute (10 req/sec avg)
  - 2000 requests per hour
  - Burst: up to 100 concurrent requests (then queue)

Portal Design to Respect Limits:
  - Batch requests (10-20 per call vs. 1 per call)
  - Cache frequently-accessed data
  - Stagger syncs (don't run all modules at once)
  - Alert if approaching limit (90% usage)
```

---

## Monitoring & Alerting

**Alert Rules:**
1. API success rate < 98% (trend last 4 hours)
2. Average response time > 500 ms (any endpoint)
3. Auth token refresh failures (401 errors)
4. Rate limit approaching (>90% of quota)
5. Sync job duration > 5 min (possible BC slowness)
6. 3+ consecutive sync failures for same module
7. Webhook delivery failures (after 3 retries)

**Alert Channels:**
- Email: System Admin, Finance Manager
- SMS: System Admin (critical only)
- In-App: Notification badge on IA-Q Dashboard
- Slack: If integrated (future phase)

---

## Data Retention & Compliance

**PDPA Compliance (Thai Personal Data Protection Act):**
- Error logs: 90 days (may contain user email, IP, action)
- Webhook logs: 90 days
- Sync logs: 30 days
- After retention period: Auto-archive encrypted, then delete after 5 years (tax requirement)

**Audit Trail:**
- All API calls logged: User, timestamp, endpoint, method, status
- Kept for 12 months for audit/compliance
- Queries on sensitive data (PII, financial) require additional audit review

---

## Implementation Notes

- **Phase P2:** IA-Q, IA-1, IA-2, IA-3 (core monitoring)
- **Phase P3:** IA-4 (Marketplace), IA-5 (Entity Explorer)
- **Initial Setup:** 2-3 days (configure webhooks, test syncs, train admin)
- **Monitoring:** Dedicated admin role (or shared with System Admin)
- **Alerting:** Configure email/SMS thresholds in IA-Q settings
- **Error Handling:** Implement graceful degradation (if sync fails, cache used)
- **Load Testing:** Verify API performance before production (5K+ items, 10K+ customers)

---

**End of IA Module Spec**
