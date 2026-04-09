// ========== FORMATTING UTILITIES ==========

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
  } else if (format === 'long') {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } else {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
}

export const formatTime = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const m = parseInt(minutes)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHours = h % 12 || 12
  return `${displayHours}:${m.toString().padStart(2, '0')} ${period}`
}

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals)
}

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`
}

// ========== CALCULATION UTILITIES ==========

export const calculateBudgetPercentage = (spent: number, budget: number): number => {
  if (budget === 0) return 0
  return (spent / budget) * 100
}

export const calculateTotalTransactions = (transactions: Array<{ amount: number }>): number => {
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

export const calculateAverageTransaction = (transactions: Array<{ amount: number }>): number => {
  if (transactions.length === 0) return 0
  return calculateTotalTransactions(transactions) / transactions.length
}

export const groupTransactionsByCategory = (transactions: any[]) => {
  const grouped: Record<string, any[]> = {}
  transactions.forEach(t => {
    if (!grouped[t.category_id]) {
      grouped[t.category_id] = []
    }
    grouped[t.category_id].push(t)
  })
  return grouped
}

// ========== VALIDATION UTILITIES ==========

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidAmount = (amount: number | string): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return !isNaN(num) && num > 0
}

export const isValidDate = (date: string): boolean => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

export const isPasswordStrong = (password: string): boolean => {
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*]/.test(password)
  
  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChar
  )
}

// ========== DATE UTILITIES ==========

export const getMonthStartDate = (): string => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
}

export const getMonthEndDate = (): string => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
}

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const getLastNDays = (n: number): { start: string; end: string } => {
  const end = new Date()
  const start = new Date(end.getTime() - n * 24 * 60 * 60 * 1000)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export const getLastNMonths = (n: number): { start: string; end: string } => {
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - n, 1)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export const getMonthName = (monthIndex: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthIndex]
}

// ========== SORTING UTILITIES ==========

export const sortTransactions = (
  transactions: any[],
  sortBy: 'latest' | 'oldest' | 'highest' | 'lowest' | 'category'
) => {
  const sorted = [...transactions]
  
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case 'highest':
      return sorted.sort((a, b) => b.amount - a.amount)
    case 'lowest':
      return sorted.sort((a, b) => a.amount - b.amount)
    case 'category':
      return sorted.sort((a, b) => (a.category?.name || '').localeCompare(b.category?.name || ''))
    default:
      return sorted
  }
}

// ========== STORAGE UTILITIES ==========

export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting local storage:', error)
  }
}

export const getLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error getting local storage:', error)
    return null
  }
}

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing local storage:', error)
  }
}

// ========== CLASS NAME UTILITIES ==========

export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// ========== ERROR HANDLING ==========

export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return 'An error occurred. Please try again.'
}
