# Finance Dashboard UI

A modern finance dashboard built as an internship assignment with a clean SaaS-style interface. The app helps users monitor balances, analyze spending, manage transactions, and view monthly trends through interactive charts.

## Project Overview

This project focuses on practical front-end architecture and UX quality:

- Responsive dashboard experience across desktop and mobile.
- Role-aware interface (`admin` and `viewer`) with guarded actions.
- Persistent local state with filters, transactions, and preferences.
- Data visualization for balance trends and spending breakdown.

The visual language uses an indigo primary palette (`#6366f1`), emerald highlights for income, and rose highlights for expenses, with rounded cards, subtle borders, and motion-based transitions.

## Tech Stack

- Vite + React (JSX)
- Tailwind CSS v4 (`@import "tailwindcss"` + CSS variables in `@theme`)
- Zustand with `persist` middleware
- Recharts
- Framer Motion
- Lucide React

## Setup Instructions

```bash
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173` or the next free port).

## Feature List

- Dashboard page
- Transactions page
- Insights page
- Role-based UI (`admin` / `viewer`)
- Dark mode toggle
- CSV export for filtered transactions
- Local storage persistence (theme, role, transactions)

## What Makes This Submission Stand Out

- Financial Health Score:
	A composite metric that summarizes savings discipline, spending concentration, and month-to-month expense volatility.

- Actionable Recommendations:
	The Insights section now generates practical, prioritized suggestions (not just charts), helping users decide what to do next.

- Role-Sensitive UX:
	Clear viewer/admin behavior with visible role context in navigation, improving demo clarity for evaluators.

- Empty-State and Interaction Polish:
	Graceful no-data handling, smooth list animations on filter changes, and dark-mode-safe form readability.

## Folder Structure

```text
src/
	App.jsx
	main.jsx
	index.css
	components/
		Sidebar.jsx
		Header.jsx
		MobileNav.jsx
		Card.jsx
		SummaryCards.jsx
		BalanceChart.jsx
		SpendingChart.jsx
		RecentTransactions.jsx
		AddTransactionModal.jsx
	pages/
		Dashboard.jsx
		Transactions.jsx
		Insights.jsx
	store/
		useStore.js
	data/
		mockData.js
```

## Design Decisions

- Tailwind v4 token strategy:
	Color and semantic styling are driven by CSS custom properties in `index.css` under `@theme`, enabling consistent theming without `tailwind.config.js`.

- Dark mode implementation:
	Dark mode is class-based (`.dark` on `html`) and applied centrally in `App.jsx` for predictable global theming.

- Zustand selector safety:
	Derived calculations (filtering and summaries) are exported as standalone utilities and consumed with `useMemo` in components to avoid selector snapshot loops.

- Chart stability:
	Recharts containers are wrapped with explicit sizing constraints to improve responsive rendering reliability.

- UX polish:
	Framer Motion is used for card entrances and transactional list transitions, keeping interactions smooth without overwhelming motion.
