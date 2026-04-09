import { createClient } from '@/lib/supabase/client'
import { Account, AccountFormData, ApiResponse } from '@/types'

export const accountService = {
  // Get all accounts
  async getAccounts(userId: string): Promise<ApiResponse<Account[]>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch accounts',
      }
    }
  },

  // Add account
  async addAccount(userId: string, formData: AccountFormData): Promise<ApiResponse<Account>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('accounts')
        .insert([
          {
            user_id: userId,
            ...formData,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Account created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add account',
      }
    }
  },

  // Update account
  async updateAccount(accountId: string, updates: Partial<Account>): Promise<ApiResponse<Account>> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Account updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update account',
      }
    }
  },

  // Delete account
  async deleteAccount(accountId: string): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()

      const { error } = await supabase.from('accounts').delete().eq('id', accountId)

      if (error) throw error

      return {
        success: true,
        message: 'Account deleted successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete account',
      }
    }
  },

  // Get total balance
  async getTotalBalance(userId: string): Promise<ApiResponse<number>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', userId)

      if (error) throw error

      const total = data?.reduce((sum, account) => sum + account.balance, 0) || 0

      return {
        success: true,
        data: total,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to calculate balance',
      }
    }
  },

  // Transfer between accounts
  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    userId: string
  ): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()

      // Update from account
      const { error: fromError } = await supabase
        .from('accounts')
        .update({ balance: supabase.rpc('add_to_balance', { id: fromAccountId, amount: -amount }) })
        .eq('id', fromAccountId)

      if (fromError) throw fromError

      // Update to account
      const { error: toError } = await supabase
        .from('accounts')
        .update({ balance: supabase.rpc('add_to_balance', { id: toAccountId, amount }) })
        .eq('id', toAccountId)

      if (toError) throw toError

      return {
        success: true,
        message: 'Transfer completed successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to transfer funds',
      }
    }
  },
}
