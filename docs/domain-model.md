# Domain Model (Initial)

## Core entities
- User
- Role
- Permission
- Product
- Supplier
- Customer
- Warehouse
- StockLedger
- PurchaseOrder
- SalesOrder

## Relationship notes
- A `User` can have many `Role` records.
- A `Role` can map to many `Permission` records.
- `Product` stock is tracked by `StockLedger` entries per `Warehouse`.
- `PurchaseOrder` increases stock after receiving.
- `SalesOrder` decreases stock after fulfillment.
