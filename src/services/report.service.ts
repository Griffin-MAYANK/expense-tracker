import { createClient } from '@/lib/supabase/client'
import { Report, MonthlyReport, CategoryExpense, ApiResponse } from '@/types'
import { getMonthName } from '@/lib/utils'

export const reportService = {
  // Get monthly summary report
  async getMonthlyReport(userId: string, dateFrom: string, dateTo: string): Promise<ApiResponse<Report>> {
    try {
      const supabase = createClient()

      // Get all transactions in range
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .gte('date', dateFrom)
        .lte('date', dateTo)

      if (error) throw error

      // Calculate totals
      const totalIncome = transactions
        ?.filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const totalExpense = transactions
        ?.filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const totalSavings = totalIncome - totalExpense

      // Category breakdown
      const categoryGroups: Record<string, CategoryExpense> = {}
      transactions?.forEach((t) => {
        if (t.type === 'expense') {
          if (!categoryGroups[t.category_id]) {
            categoryGroups[t.category_id] = {
              category_id: t.category_id,
              category_name: t.category?.name || 'Unknown',
              total: 0,
              percentage: 0,
              transactions_count: 0,
            }
          }
          categoryGroups[t.category_id].total += t.amount
          categoryGroups[t.category_id].transactions_count += 1
        }
      })

      const categoryBreakdown = Object.values(categoryGroups).map((cat) => ({
        ...cat,
        percentage: totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0,
      }))

      // Monthly trend
      const monthlyData: Record<string, any> = {}
      transactions?.forEach((t) => {
        const month = t.date.substring(0, 7) // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 }
        }
        if (t.type === 'income') {
          monthlyData[month].income += t.amount
        } else if (t.type === 'expense') {
          monthlyData[month].expense += t.amount
        }
      })

      const monthlyTrend: MonthlyReport[] = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        savings: data.income - data.expense,
        budget_used_percentage: 0,
      }))

      return {
        success: true,
        data: {
          start_date: dateFrom,
          end_date: dateTo,
          total_income: totalIncome,
          total_expense: totalExpense,
          total_savings: totalSavings,
          category_breakdown: categoryBreakdown,
          monthly_trend: monthlyTrend,
          budget_performance: [],
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to generate report',
      }
    }
  },

  // Get dashboard metrics
  async getDashboardMetrics(userId: string): Promise<ApiResponse<any>> {
    try {
      const supabase = createClient()

      // Get accounts for total balance
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', userId)

      if (accountsError) throw accountsError

      const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) || 0

      // Get transactions for this month
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .gte('date', monthStart)
        .lte('date', monthEnd)

      if (transError) throw transError

      const totalIncome = transactions
        ?.filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const totalExpense = transactions
        ?.filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const savings = totalIncome - totalExpense

      // Get budgets
      const { data: budgets, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (budgetError) throw budgetError

      let budgetUsedPercentage = 0
      if (budgets && budgets.length > 0) {
        const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
        const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
        budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
      }

      // Recent transactions
      const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('*, category:categories(*), account:accounts(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5)

      // Top categories
      const categoryGroups: Record<string, any> = {}
      transactions?.forEach((t) => {
        if (t.type === 'expense') {
          if (!categoryGroups[t.category_id]) {
            categoryGroups[t.category_id] = {
              category_id: t.category_id,
              category_name: t.category?.name || 'Unknown',
              total: 0,
              transactions_count: 0,
            }
          }
          categoryGroups[t.category_id].total += t.amount
          categoryGroups[t.category_id].transactions_count += 1
        }
      })

      const topCategories = Object.values(categoryGroups)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map((cat) => ({
          ...cat,
          percentage: totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0,
        }))

      return {
        success: true,
        data: {
          total_balance: totalBalance,
          total_income: totalIncome,
          total_expense: totalExpense,
          savings,
          budget_used_percentage: budgetUsedPercentage,
          recent_transactions: recentTransactions || [],
          top_categories: topCategories,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get dashboard metrics',
      }
    }
  },
}
