// ========== USER TYPES ==========
export interface User {
  id: string
  email: string
  full_name: string
  profile_image?: string
  currency: string
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

// ========== ACCOUNT/WALLET TYPES ==========
export type AccountType = 'cash' | 'bank_account' | 'credit_card' | 'debit_card' | 'e_wallet' | 'savings_account'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  color: string
  icon?: string
  created_at: string
  updated_at: string
}

// ========== CATEGORY TYPES ==========
export type TransactionType = 'income' | 'expense' | 'transfer'
export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  icon: string
  color: string
  parent_category_id?: string
  is_custom: boolean
  created_at: string
  updated_at: string
}

export interface CategoryWithSubcategories extends Category {
  subcategories?: Category[]
}

// ========== TRANSACTION TYPES ==========
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'check'

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  amount: number
  type: TransactionType
  date: string
  time?: string
  notes?: string
  merchant?: string
  payment_method: PaymentMethod
  recurring_id?: string
  receipt_url?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface TransactionWithDetails extends Transaction {
  category?: Category
  account?: Account
}

// ========== BUDGET TYPES ==========
export interface Budget {
  id: string
  user_id: string
  category_id?: string
  name: string
  amount: number
  spent: number
  currency: string
  period: 'weekly' | 'monthly' | 'yearly' | 'custom'
  start_date: string
  end_date: string
  alert_threshold: number // percentage (e.g., 80)
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BudgetWithCategory extends Budget {
  category?: Category
}

// ========== RECURRING TRANSACTION TYPES ==========
export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface RecurringTransaction {
  id: string
  user_id: string
  title: string
  description?: string
  amount: number
  type: TransactionType
  category_id: string
  account_id: string
  payment_method: PaymentMethod
  frequency: RecurrenceFrequency
  start_date: string
  end_date?: string
  next_run_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ========== NOTIFICATION TYPES ==========
export type NotificationType = 'budget_alert' | 'bill_due' | 'recurring_transaction' | 'financial_summary'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  related_id?: string
  created_at: string
}

// ========== REPORT TYPES ==========
export interface MonthlyReport {
  month: string
  income: number
  expense: number
  savings: number
  budget_used_percentage: number
}

export interface CategoryExpense {
  category_id: string
  category_name: string
  total: number
  percentage: number
  transactions_count: number
}

export interface Report {
  start_date: string
  end_date: string
  total_income: number
  total_expense: number
  total_savings: number
  category_breakdown: CategoryExpense[]
  monthly_trend: MonthlyReport[]
  budget_performance: BudgetPerformance[]
}

export interface BudgetPerformance {
  budget_id: string
  budget_name: string
  allocated: number
  spent: number
  remaining: number
  percentage: number
  status: 'on_track' | 'warning' | 'exceeded'
}

// ========== EXPORT TYPES ==========
export type ExportFormat = 'csv' | 'excel' | 'pdf'

export interface ExportRequest {
  start_date: string
  end_date: string
  format: ExportFormat
  include_budgets?: boolean
  include_summary?: boolean
}

// ========== DASHBOARD TYPES ==========
export interface DashboardMetrics {
  total_balance: number
  total_income: number
  total_expense: number
  savings: number
  budget_used_percentage: number
  recent_transactions: TransactionWithDetails[]
  top_categories: CategoryExpense[]
  monthly_trend: MonthlyReport[]
}

// ========== API RESPONSE TYPES ==========
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// ========== FORM TYPES ==========
export interface TransactionFormData {
  amount: number
  type: TransactionType
  category_id: string
  account_id: string
  date: string
  time?: string
  notes?: string
  merchant?: string
  payment_method: PaymentMethod
  tags?: string[]
  receipt_url?: string
}

export interface BudgetFormData {
  name: string
  category_id?: string
  amount: number
  period: 'weekly' | 'monthly' | 'yearly' | 'custom'
  start_date: string
  end_date?: string
  alert_threshold: number
}

export interface CategoryFormData {
  name: string
  type: CategoryType
  icon: string
  color: string
  parent_category_id?: string
}

export interface AccountFormData {
  name: string
  type: AccountType
  balance: number
  currency: string
  color: string
  icon?: string
}

// ========== CHART TYPES ==========
export interface ChartDataPoint {
  name: string
  value: number
  percentage?: number
}

export interface MonthlyTrendData {
  month: string
  income: number
  expense: number
  savings: number
}
