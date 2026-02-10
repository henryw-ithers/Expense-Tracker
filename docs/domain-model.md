# Domain Model

## Scope
- Single user 
- Track income and expense transactions
- Categorize transactions
- Provide monthly summaries

---

## Entities

### Transaction
**Purpose:** Tracks the movement of some amount of money.

**Fields**
- `id`: UUID 
- `type`: `Income | Expense`
- `amount`: BigDecimal
- `date`: LocalDate
- `description`: String (optional)
- `categoryID`: UUID
- `createdAt`: Instant
- `updatedAt`: Instant

---

## Relationships 
- A `category` can have many `transaction`s
- A `transaction` belongs to exactly one `category (v1)

---
## Invariants
- `amount > 0`
- `type` is required
- `date` is required
- `categoryID` is required
- `category.name` is unique

---
## Derived Values 
- Income over some time period = sum(amount) where type=INCOME and date is selected time period
- Expense over some time period = sum(amount) where type=Expense and date is selected time period
- Net = income - expense
- Category breakdown = sum(amount) grouped by category for some time period

---
## Decisions
- Amount stored as positive; `type` indicates direction
- Deleting categories is blocked if any transaction references them