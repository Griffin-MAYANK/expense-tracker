import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionWithDetails, TransactionFormData, ApiResponse, PaginatedResponse } from '@/types'

export const transactionService = {
  // Get all transactions for user
  async getTransactions(
    userId: string,
    filters?: {
      accountId?: string
      categoryId?: string
      type?: string
      dateFrom?: string
      dateTo?: string
      searchQuery?: string
    },
    pagination?: {
      page: number
      limit: number
    }
  ): Promise<ApiResponse<PaginatedResponse<TransactionWithDetails>>> {
    try {
      const supabase = createClient()
      let query = supabase
        .from('transactions')
        .select('*, category:categories(*), account:accounts(*)', { count: 'exact' })
        .eq('user_id', userId)

      // Apply filters
      if (filters?.accountId) {
        query = query.eq('account_id', filters.accountId)
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      // Pagination
      const page = pagination?.page || 1
      const limit = pagination?.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.order('date', { ascending: false }).range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          total_pages: Math.ceil((count || 0) / limit),
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions',
      }
    }
  },

  // Get single transaction
  async getTransaction(transactionId: string): Promise<ApiResponse<TransactionWithDetails>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*), account:accounts(*)')
        .eq('id', transactionId)
        .single()

      if (error) throw error

      return {
        success: true,
        data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transaction',
      }
    }
  },

  // Add transaction
  async addTransaction(userId: string, formData: TransactionFormData): Promise<ApiResponse<Transaction>> {
    try {
      const supabase = createClient()

      const transaction = {
        user_id: userId,
        account_id: formData.account_id,
        category_id: formData.category_id,
        amount: formData.amount,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        merchant: formData.merchant,
        payment_method: formData.payment_method,
        receipt_url: formData.receipt_url,
        tags: formData.tags,
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Transaction added successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add transaction',
      }
    }
  },

  // Update transaction
  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Transaction updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update transaction',
      }
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId: string): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('transactions').delete().eq('id', transactionId)

      if (error) throw error

      return {
        success: true,
        message: 'Transaction deleted successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete transaction',
      }
    }
  },

  // Get recent transactions
  async getRecentTransactions(userId: string, limit: number = 10): Promise<ApiResponse<TransactionWithDetails[]>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*), account:accounts(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions',
      }
    }
  },

  // Get total income/expense
  async getTotalByType(userId: string, type: 'income' | 'expense', dateFrom?: string, dateTo?: string): Promise<ApiResponse<number>> {
    try {
      const supabase = createClient()
      let query = supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', type)

      if (dateFrom) query = query.gte('date', dateFrom)
      if (dateTo) query = query.lte('date', dateTo)

      const { data, error } = await query

      if (error) throw error

      const total = data?.reduce((sum, t) => sum + t.amount, 0) || 0

      return {
        success: true,
        data: total,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to calculate total',
      }
    }
  },
}
