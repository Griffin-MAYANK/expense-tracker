import { createClient } from '@/lib/supabase/client'
import { Budget, BudgetFormData, ApiResponse } from '@/types'

export const budgetService = {
  // Get all budgets
  async getBudgets(userId: string, filters?: { isActive?: boolean }): Promise<ApiResponse<Budget[]>> {
    try {
      const supabase = createClient()
      let query = supabase.from('budgets').select('*').eq('user_id', userId)

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }

      const { data, error } = await query.order('start_date', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch budgets',
      }
    }
  },

  // Add budget
  async addBudget(userId: string, formData: BudgetFormData): Promise<ApiResponse<Budget>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            category_id: formData.category_id,
            amount: formData.amount,
            period: formData.period,
            start_date: formData.start_date,
            end_date: formData.end_date,
            alert_threshold: formData.alert_threshold,
            is_active: true,
            spent: 0,
            currency: 'USD',
          },
        ])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Budget created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add budget',
      }
    }
  },

  // Update budget
  async updateBudget(budgetId: string, updates: Partial<Budget>): Promise<ApiResponse<Budget>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', budgetId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Budget updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update budget',
      }
    }
  },

  // Delete budget
  async deleteBudget(budgetId: string): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()

      const { error } = await supabase.from('budgets').delete().eq('id', budgetId)

      if (error) throw error

      return {
        success: true,
        message: 'Budget deleted successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete budget',
      }
    }
  },

  // Get budget performance
  async getBudgetPerformance(budgetId: string): Promise<ApiResponse<any>> {
    try {
      const supabase = createClient()

      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .single()

      if (budgetError) throw budgetError

      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('category_id', budget.category_id)
        .gte('date', budget.start_date)
        .lte('date', budget.end_date || new Date().toISOString().split('T')[0])
        .eq('type', 'expense')

      if (transError) throw transError

      const spent = transactions?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0
      const remaining = Math.max(0, budget.amount - spent)
      const percentage = (spent / budget.amount) * 100

      return {
        success: true,
        data: {
          ...budget,
          spent,
          remaining,
          percentage,
          status: percentage > 100 ? 'exceeded' : percentage >= budget.alert_threshold ? 'warning' : 'on_track',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get budget performance',
      }
    }
  },
}
