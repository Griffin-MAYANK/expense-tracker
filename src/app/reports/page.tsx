'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedLayout } from '@/components/layout'
import { Card, Button, Input, Loader, EmptyState } from '@/components/ui'
import { useUserStore } from '@/store'
import { reportService } from '@/services/report.service'
import { formatCurrency, getLastNMonths, getMonthName } from '@/lib/utils'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'

const ReportsPage: React.FC = () => {
  const { user } = useUserStore()
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: getLastNMonths(3).start,
    to: getLastNMonths(3).end,
  })

  useEffect(() => {
    const loadReport = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await reportService.getMonthlyReport(user.id, dateRange.from, dateRange.to)
        if (response.success && response.data) {
          setReport(response.data)
        }
      } catch (error) {
        console.error('Failed to load report:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReport()
  }, [user?.id, dateRange])

  if (isLoading) return <Loader fullScreen />

  if (!report || report.category_breakdown.length === 0) {
    return (
      <ProtectedLayout>
        <div className="p-6">
          <EmptyState
            title="No Data Available"
            description="Add transactions to see reports"
            icon="📊"
            action={
              <Button variant="primary" href="/transactions">
                Add Transaction
              </Button>
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Reports</h1>

        {/* Date Filter */}
        <Card className="bg-slate-100 dark:bg-slate-800">
          <div className="flex gap-4 items-end">
            <Input
              label="From Date"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
            <Input
              label="To Date"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(report.total_income, user?.currency)}</p>
          </Card>
          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(report.total_expense, user?.currency)}</p>
          </Card>
          <Card>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Net Savings</p>
            <p className={`text-2xl font-bold ${report.total_savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(report.total_savings, user?.currency)}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by Category */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.category_breakdown}
                  dataKey="total"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {report.category_breakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Category Breakdown Table */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detailed Category Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-4 font-semibold">Category</th>
                  <th className="text-right py-2 px-4 font-semibold">Amount</th>
                  <th className="text-right py-2 px-4 font-semibold">% of Total</th>
                  <th className="text-right py-2 px-4 font-semibold">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {report.category_breakdown.map((item: any) => (
                  <tr key={item.category_id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-3 px-4">{item.category_name}</td>
                    <td className="text-right py-3 px-4 font-semibold">{formatCurrency(item.total, user?.currency)}</td>
                    <td className="text-right py-3 px-4">{item.percentage.toFixed(1)}%</td>
                    <td className="text-right py-3 px-4">{item.transactions_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Export Button */}
        <Card className="flex justify-between items-center">
          <p className="text-slate-600 dark:text-slate-400">Export this report to PDF or CSV</p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">Export to PDF</Button>
            <Button variant="secondary" size="sm">Export to CSV</Button>
          </div>
        </Card>
      </div>
    </ProtectedLayout>
  )
}

export default ReportsPage
