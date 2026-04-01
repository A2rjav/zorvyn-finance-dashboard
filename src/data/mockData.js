const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Education', 'Salary', 'Freelance', 'Investment'];
const incomeCategories = ['Salary', 'Freelance', 'Investment'];

const descriptions = {
  'Food & Dining': ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Food Delivery', 'Bakery'],
  'Transportation': ['Uber Ride', 'Gas Station', 'Metro Pass', 'Parking Fee', 'Car Service'],
  'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Decor', 'Book Store'],
  'Entertainment': ['Netflix', 'Movie Tickets', 'Concert', 'Gaming', 'Spotify'],
  'Healthcare': ['Pharmacy', 'Doctor Visit', 'Lab Tests', 'Insurance Premium', 'Dental'],
  'Utilities': ['Electricity Bill', 'Internet Bill', 'Water Bill', 'Phone Bill', 'Gas Bill'],
  'Education': ['Online Course', 'Books', 'Workshop', 'Certification', 'Tuition Fee'],
  'Salary': ['Monthly Salary', 'Bonus', 'Overtime Pay'],
  'Freelance': ['Web Project', 'Design Work', 'Consulting', 'Content Writing'],
  'Investment': ['Stock Dividend', 'Interest Income', 'Rental Income'],
};

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 2, 31);

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const category = categories[Math.floor(Math.random() * categories.length)];
    const type = incomeCategories.includes(category) ? 'income' : 'expense';
    const amount = type === 'income'
      ? randomBetween(500, 8000)
      : randomBetween(5, 500);

    const descs = descriptions[category];
    const description = descs[Math.floor(Math.random() * descs.length)];

    transactions.push({
      id: `txn-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      type,
      description,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

export const transactions = generateTransactions();

export const getMonthlyData = (txns) => {
  const months = {};
  txns.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!months[month]) months[month] = { month, income: 0, expenses: 0 };
    if (t.type === 'income') months[month].income += t.amount;
    else months[month].expenses += t.amount;
  });

  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({
      ...m,
      income: Math.round(m.income),
      expenses: Math.round(m.expenses),
      balance: Math.round(m.income - m.expenses),
      name: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    }));
};

export const getCategoryData = (txns) => {
  const cats = {};
  txns
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!cats[t.category]) cats[t.category] = 0;
      cats[t.category] += t.amount;
    });

  return Object.entries(cats)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
};

export const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
