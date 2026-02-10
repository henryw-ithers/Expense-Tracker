# User Stories
This document defines and tracks the core user stories for v1.

## Transactions

### Add an expense transaction
As a user,
I want to add an expense transaction, 
so that I can track money being spent.

**Acceptance Criteria:**
- Amount must be greater than 0
- Category is required
- Date defaults to today
- Transaction is persisted
- Transaction type is EXPENSE

---

### Add an income transaction
As a user,
I want to add an income transaction,
so that I can track money coming in.

**Acceptance Criteria:**
- Amount must be greater than 0
- Category is required
- Date defaults to today
- Transaction is persisted
- Transaction type is INCOME

---

### View transaction list
As a user,
I want to view my transactions,
so that I can review my financial activity.

**Acceptance Criteria:**
- Transactions are ordered by date descending
- Each transaction shows amount, date, category, and type
- Deleted transactions are not shown

---

### Edit a transaction
As a user,
I want to edit a transaction,
so that I can correct mistakes.

**Acceptance Criteria:**
- Amount, date, category, and description can be updated
- Amount remains greater than 0
- Changes are persisted
- Transaction ID does not change

---

### Delete a transaction
As a user,
I want to delete a transaction,
so that incorrect entries don't affect totals.

**Acceptance Criteria**
- Transaction can be deleted by ID
- Deleted transactions are no longer returned
- Summaries reflect deletion

---

## Categories

### Create a category
As a user,
I want to create a category,
so that I can organize transactions.

**Acceptance Criteria**
- Category name is required
- Category name is unique
- Category is persisted

---

## Summaries

### View summary
As a user,
I want to view a summary,
so that I understand income and expenses over a period of time.

**Acceptance Criteria:**
- Exact week, month, and year can be selected
- Total income is calculated correctly
- Total expense is calculated correctly
- Net total is income minus expense
- Includes categories

---