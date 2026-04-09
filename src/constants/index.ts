// Application constants
export const APP_NAME = 'Expense Tracker Pro'
export const APP_VERSION = '1.0.0'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
]

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
}

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'digital_wallet', label: 'Digital Wallet' },
  { value: 'check', label: 'Check' },
]

// Account types
export const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_account', label: 'Bank Account' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'savings_account', label: 'Savings Account' },
]

// Budget periods
export const BUDGET_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

// Recurring frequency
export const RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
]

// Themes
export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

// Languages
export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
]

// Timezones
export const TIMEZONES = [
  { value: 'UTC', label: 'UTC / GMT' },
  { value: 'EST', label: 'Eastern Standard Time' },
  { value: 'CST', label: 'Central Standard Time' },
  { value: 'MST', label: 'Mountain Standard Time' },
  { value: 'PST', label: 'Pacific Standard Time' },
  { value: 'IST', label: 'Indian Standard Time' },
  { value: 'JST', label: 'Japan Standard Time' },
  { value: 'AEST', label: 'Australian Eastern Standard Time' },
]

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
}

// API endpoints (for reference)
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  TRANSACTIONS: '/api/transactions',
  CATEGORIES: '/api/categories',
  BUDGETS: '/api/budgets',
  ACCOUNTS: '/api/accounts',
  REPORTS: '/api/reports',
}

// Chart colors
export const CHART_COLORS = [
  '#4F46E5', // primary
  '#10B981', // secondary
  '#F59E0B', // warning
  '#EF4444', // danger
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#06B6D4', // cyan
]

// Feature flags
export const FEATURES = {
  OCR_SCANNING: false, // Enable receipt OCR
  BANK_INTEGRATION: false, // Enable bank account sync
  SOCIAL_LOGIN: false, // Enable Google/Apple sign-in
  EXPORT_PDF: false, // Enable PDF export
  VOICE_INPUT: false, // Enable voice input for transactions
  FAMILY_SHARING: false, // Enable family budget sharing
  AI_INSIGHTS: false, // Enable AI spending insights
}
