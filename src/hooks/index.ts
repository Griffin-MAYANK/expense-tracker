'use client'

import { useState, useCallback } from 'react'
import { useUserStore, useNotificationStore } from '@/store'
import { authService } from '@/services/auth.service'
import { transactionService } from '@/services/transaction.service'
import { createClient } from '@/lib/supabase/client'

// Auth Hook
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useUserStore()
  const { addNotification } = useNotificationStore()

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true)
      const response = await authService.register(email, password, fullName)
      setIsLoading(false)

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: response.message || 'Account created successfully',
        })
        return true
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Registration failed',
        })
        return false
      }
    },
    [addNotification]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      const response = await authService.login(email, password)
      setIsLoading(false)

      if (response.success && response.data?.user) {
        setUser(response.data.user)
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Logged in successfully',
        })
        return true
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Login failed',
        })
        return false
      }
    },
    [addNotification, setUser]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    const response = await authService.logout()
    setIsLoading(false)

    if (response.success) {
      setUser(null)
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Logged out successfully',
      })
      return true
    }
    return false
  }, [setUser, addNotification])

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true)
    const response = await authService.getCurrentUser()
    setIsLoading(false)

    if (response.success && response.data) {
      setUser(response.data)
      return response.data
    }
    return null
  }, [setUser])

  return {
    register,
    login,
    logout,
    getCurrentUser,
    isLoading,
  }
}

// Transaction Hook
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotificationStore()

  const fetchTransactions = useCallback(
    async (userId: string, filters?: any, pagination?: any) => {
      setIsLoading(true)
      const response = await transactionService.getTransactions(userId, filters, pagination)
      setIsLoading(false)

      if (response.success && response.data) {
        setTransactions(response.data.data)
        return response.data
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to fetch transactions',
        })
      }
    },
    [addNotification]
  )

  const addTransaction = useCallback(
    async (userId: string, formData: any) => {
      setIsLoading(true)
      const response = await transactionService.addTransaction(userId, formData)
      setIsLoading(false)

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction added successfully',
        })
        return response.data
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to add transaction',
        })
      }
    },
    [addNotification]
  )

  const updateTransaction = useCallback(
    async (transactionId: string, updates: any) => {
      setIsLoading(true)
      const response = await transactionService.updateTransaction(transactionId, updates)
      setIsLoading(false)

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction updated successfully',
        })
        return response.data
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update transaction',
        })
      }
    },
    [addNotification]
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      setIsLoading(true)
      const response = await transactionService.deleteTransaction(transactionId)
      setIsLoading(false)

      if (response.success) {
        setTransactions(transactions.filter((t) => t.id !== transactionId))
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction deleted successfully',
        })
        return true
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to delete transaction',
        })
      }
    },
    [transactions, addNotification]
  )

  return {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}

// Auth State Hook
export const useAuthState = () => {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  return { user, isLoading, checkAuth }
}
