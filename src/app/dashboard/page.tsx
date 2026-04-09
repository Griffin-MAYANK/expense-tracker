'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedLayout } from '@/components/layout'
import { Card, Button, Loader, EmptyState, Progress } from '@/components/ui'
import { useUserStore } from '@/store'
import { reportService } from '@/services/report.service'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import Link from 'next/link'

const DashboardPage: React.FC = () => {
  const { user } = useUserStore()
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await reportService.getDashboardMetrics(user.id)
        if (response.success && response.data) {
          setMetrics(response.data)
        }
      } catch (error) {
        console.error('Failed to load metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [user?.id])

  if (isLoading) return <Loader fullScreen />

  if (!metrics) {
    return (
      <ProtectedLayout>
        <div className="p-6">
          <EmptyState
            title="Start Tracking Your Expenses"
            description="Add your first transaction to see your financial overview here"
            icon="📊"
            action={
              <Link href="/transactions?action=add">
                <Button variant="primary">Add First Transaction</Button>
              </Link>
            }
          />
        </div>
      </ProtectedLayout>
    )
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Here's your financial overview</p>
          </div>
          <Link href="/transactions?action=add">
            <Button variant="primary">+ Add Transaction</Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Balance</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.total_balance, user?.currency || 'USD')}</p>
            <small className="text-green-600 dark:text-green-400">+📈 Updated today</small>
          </Card>

          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Income</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(metrics.total_income, user?.currency || 'USD')}</p>
            <small className="text-slate-600 dark:text-slate-400">This month</small>
          </Card>

          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(metrics.total_expense, user?.currency || 'USD')}</p>
            <small className="text-slate-600 dark:text-slate-400">This month</small>
          </Card>

          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Savings</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(metrics.savings, user?.currency || 'USD')}</p>
            <small className="text-slate-600 dark:text-slate-400">This month</small>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Budget Status</h2>
          <Progress value={metrics.budget_used_percentage} max={100} color={metrics.budget_used_percentage > 100 ? 'danger' : 'primary'} showLabel />
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {metrics.budget_used_percentage.toFixed(1)}% of your monthly budget used
          </p>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by Category */}
          {metrics.top_categories && metrics.top_categories.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.top_categories}
                    dataKey="total"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {metrics.top_categories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
            {metrics.recent_transactions && metrics.recent_transactions.length > 0 ? (
              <div className="space-y-3">
                {metrics.recent_transactions.slice(0, 5).map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{transaction.category?.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{formatDate(transaction.date)}</p>
                    </div>
                    <p
                      className={cn(
                        'font-semibold',
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No transactions yet</p>
            )}
            <Link href="/transactions" className="mt-4 block">
              <Button variant="ghost" className="w-full">View All Transactions →</Button>
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/transactions?action=add">
              <Button variant="secondary" className="w-full">Add Transaction</Button>
            </Link>
            <Link href="/budgets">
              <Button variant="secondary" className="w-full">Set Budget</Button>
            </Link>
            <Link href="/reports">
              <Button variant="secondary" className="w-full">View Reports</Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" className="w-full">Settings</Button>
            </Link>
          </div>
        </Card>
      </div>
    </ProtectedLayout>
  )
}

export default DashboardPage
