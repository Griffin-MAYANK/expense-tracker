import { createClient } from '@/lib/supabase/client'
import { User, ApiResponse } from '@/types'

export const authService = {
  // Sign up with email and password
  async register(email: string, password: string, fullName: string): Promise<ApiResponse<any>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          currency: 'USD',
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
        })

        if (profileError) throw profileError
      }

      return {
        success: true,
        data,
        message: 'Account created successfully. Please check your email to verify.',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      }
    }
  },

  // Sign in with email and password
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Logged in successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      }
    }
  },

  // Sign out
  async logout(): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      }
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      return {
        success: true,
        message: 'Password reset email sent. Check your inbox.',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) throw new Error('Not authenticated')

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      return {
        success: true,
        data: userProfile,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user',
      }
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Profile updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Profile update failed',
      }
    }
  },
}
