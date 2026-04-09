# Expense Tracker Pro

A modern, full-featured expense tracking application built with Next.js, TypeScript, and Supabase.

## 🎯 Features

### Core Features
- ✅ **Authentication**: Email/password signup and login with secure JWT
- ✅ **Transaction Management**: Add, edit, delete, and categorize transactions
- ✅ **Multiple Accounts**: Create and manage multiple wallets/accounts
- ✅ **Smart Categories**: Pre-built categories with custom category support
- ✅ **Budget Tracking**: Set budgets and monitor spending
- ✅ **Advanced Analytics**: Visual reports and financial insights
- ✅ **Search & Filter**: Powerful search and filtering capabilities
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Responsive Design**: Mobile-first, fully responsive UI
- ✅ **Real-time Updates**: Instant data synchronization

### Advanced Features
- 📊 Dashboard with key metrics
- 📈 Monthly and yearly reports
- 💰 Budget alerts and notifications
- 🔄 Recurring transactions support
- 📱 Export to CSV/PDF (ready to implement)
- 🎨 Customizable categories and colors
- 🌍 Multi-currency support
- 🔒 Row-level security with Supabase RLS
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
expense-tracker-pro/
├── src/
│   ├── app/                 # Next.js app pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── dashboard/      # Dashboard page
│   │   ├── transactions/   # Transactions page
│   │   ├── budgets/        # Budgets page
│   │   ├── reports/        # Reports page
│   │   └── profile/        # Profile settings
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Button, Card, etc.)
│   │   └── layout.tsx      # Layout wrappers
│   ├── lib/
│   │   ├── supabase/       # Supabase clients
│   │   └── utils.ts        # Utility functions
│   ├── services/            # API/database services
│   │   ├── auth.service.ts
│   │   ├── transaction.service.ts
│   │   ├── category.service.ts
│   │   ├── account.service.ts
│   │   ├── budget.service.ts
│   │   └── report.service.ts
│   ├── store/              # Zustand stores
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles
│   └── types/              # TypeScript types
├── supabase/
│   └── migrations/         # Database migrations
├── scripts/
│   └── seed.js            # Database seeding script
└── public/                # Static assets
```

## 🔐 Authentication Flow

1. User signs up with email and password
2. Supabase creates user account
3. User profile created automatically
4. JWT token generated for session
5. User can login with credentials
6. Protected routes check authentication

## 💾 Database Schema

### Users
- Profile information
- Currency preference
- Theme and language settings

### Accounts
- Multiple wallet/account support
- Balance tracking
- Currency per account

### Categories
- Income and expense categories
- Custom user categories
- Icons and colors

### Transactions
- Income, expense, transfers
- Category tagging
- Merchant information
- Date and time tracking

### Budgets
- Category-based budgets
- Period tracking (daily/weekly/monthly/yearly)
- Alert thresholds

### Recurring Transactions
- Schedule tracking
- Auto-generation support
- Frequency configuration

### Notifications
- User alerts and reminders
- Budget notifications
- Bill due reminders

## 📊 Key Pages Explained

### Dashboard
- Overview of financial status
- Total balance, income, expenses
- Recent transactions
- Top spending categories
- Quick action buttons

### Transactions
- List all transactions
- Filter by date, category, account, type
- Add new transactions with full details
- View transaction details
- Edit/delete functionality

### Budgets
- Create and manage budgets
- Track spending against budget
- Visual progress indicators
- Alert threshold settings
- Budget status (on track/warning/exceeded)

### Reports
- Monthly/yearly analysis
- Spending by category (pie chart)
- Income vs expense trends (line chart)
- Category breakdown table
- Export functionality

### Profile
- User information management
- Currency selection
- Theme preference
- Language settings
- Security settings
- Data export/delete options

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { 500: '#4F46E5', ... },
  secondary: { 500: '#10B981', ... },
  // Add more colors
}
```

### Categories
Modify `src/services/category.service.ts` to add default categories:
```typescript
{ name: 'Your Category', icon: '🔥', color: '#FF6B6B', type: 'expense' }
```

### Timeframes
Define additional report periods in components:
```typescript
const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly']
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel and deploy
# Set environment variables in Vercel dashboard
```

### Deploy to Other Platforms

Set these environment variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (optional, needed for server-side operations)
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### "Not authenticated" error
- Check if your JWT token is valid
- Try logging in again
- Clear browser cookies and cache

### Transactions not showing
- Verify Supabase RLS policies are enabled
- Check if user_id matches logged-in user
- Ensure database migrations ran correctly

### Categories not loading
- Run the seed script: `npm run seed`
- Check Supabase console for database errors
- Verify user is authenticated

## 🔄 API Reference

### Transaction Service
```typescript
getTransactions(userId, filters?, pagination?)
getTransaction(transactionId)
addTransaction(userId, formData)
updateTransaction(transactionId, updates)
deleteTransaction(transactionId)
```

### Budget Service
```typescript
getBudgets(userId, filters?)
addBudget(userId, formData)
updateBudget(budgetId, updates)
deleteBudget(budgetId)
getBudgetPerformance(budgetId)
```

### Category Service
```typescript
getCategories(userId, type?)
addCategory(userId, formData)
updateCategory(categoryId, updates)
deleteCategory(categoryId)
```

## 📝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@expensetrackerpro.com
- Documentation: [docs.expensetrackerpro.com](https://docs.expensetrackerpro.com)

## 🗺️ Roadmap

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] AI-powered expense categorization
- [ ] Bill splitting features
- [ ] Advanced reporting (PDF export)
- [ ] Multi-user/family sharing
- [ ] Investment tracking
- [ ] Cryptocurrency support

### Future Features
- [ ] SMS/Email notifications
- [ ] Voice input for transactions
- [ ] Receipt scanning with OCR
- [ ] Financial goals
- [ ] Savings challenges
- [ ] Community features
- [ ] Financial tips & insights

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Data management with [Supabase](https://supabase.com/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)

---

**Made with ❤️ by the Expense Tracker Pro team**
