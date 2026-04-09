import { createClient } from '@/lib/supabase/client'
import { Category, CategoryFormData, ApiResponse } from '@/types'

export const categoryService = {
  // Get all categories
  async getCategories(userId: string, type?: 'income' | 'expense'): Promise<ApiResponse<Category[]>> {
    try {
      const supabase = createClient()
      let query = supabase.from('categories').select('*').eq('user_id', userId)

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query.order('name')

      if (error) throw error

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch categories',
      }
    }
  },

  // Add category
  async addCategory(userId: string, formData: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: userId,
            ...formData,
            is_custom: true,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Category created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add category',
      }
    }
  },

  // Update category
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Category updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update category',
      }
    }
  },

  // Delete category
  async deleteCategory(categoryId: string): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()

      const { error } = await supabase.from('categories').delete().eq('id', categoryId)

      if (error) throw error

      return {
        success: true,
        message: 'Category deleted successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete category',
      }
    }
  },
}

// Default categories to seed
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { name: 'Shopping', icon: '🛍️', color: '#FFE66D' },
  { name: 'Bills & Utilities', icon: '💡', color: '#95E1D3' },
  { name: 'Rent', icon: '🏠', color: '#F38181' },
  { name: 'Entertainment', icon: '🎬', color: '#AA96DA' },
  { name: 'Health', icon: '💊', color: '#EC97B9' },
  { name: 'Education', icon: '📚', color: '#A29BFE' },
  { name: 'Travel', icon: '✈️', color: '#6C5FFF' },
  { name: 'Groceries', icon: '🛒', color: '#00D2FC' },
  { name: 'Subscriptions', icon: '📱', color: '#FCBF49' },
  { name: 'Gifts', icon: '🎁', color: '#FF006E' },
  { name: 'Personal Care', icon: '💅', color: '#FB5607' },
  { name: 'Insurance', icon: '🛡️', color: '#FFBE0B' },
  { name: 'Taxes', icon: '📊', color: '#8338EC' },
]

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#10B981' },
  { name: 'Freelance', icon: '👨‍💻', color: '#3B82F6' },
  { name: 'Business', icon: '🏢', color: '#F59E0B' },
  { name: 'Investment', icon: '📈', color: '#8B5CF6' },
  { name: 'Rental Income', icon: '🏘️', color: '#EC4899' },
  { name: 'Bonus', icon: '🎊', color: '#14B8A6' },
  { name: 'Gift Received', icon: '🎉', color: '#06B6D4' },
  { name: 'Refund', icon: '🔄', color: '#F97316' },
]
