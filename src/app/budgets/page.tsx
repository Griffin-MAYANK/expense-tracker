'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedLayout } from '@/components/layout'
import { Card, Button, Input, Select, Loader, EmptyState, Modal, Progress, Badge } from '@/components/ui'
import { useUserStore } from '@/store'
import { budgetService } from '@/services/budget.service'
import { categoryService } from '@/services/category.service'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

const BudgetsPage: React.FC = () => {
  const { user } = useUserStore()
  const [budgets, setBudgets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    amount: '',
    period: 'monthly',
    start_date: '',
    end_date: '',
    alert_threshold: '80',
  })

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const [budgetResp, catResp] = await Promise.all([
          budgetService.getBudgets(user.id),
          categoryService.getCategories(user.id, 'expense'),
        ])

        if (budgetResp.success) setBudgets(budgetResp.data || [])
        if (catResp.success) setCategories(catResp.data || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      const response = await budgetService.addBudget(user.id, {
        ...formData,
        amount: parseFloat(formData.amount),
        alert_threshold: parseFloat(formData.alert_threshold),
      })

      if (response.success) {
        setShowModal(false)
        setFormData({
          name: '',
          category_id: '',
          amount: '',
          period: 'monthly',
          start_date: '',
          end_date: '',
          alert_threshold: '80',
        })
        // Reload budgets
        const resp = await budgetService.getBudgets(user.id)
        if (resp.success) setBudgets(resp.data || [])
      }
    } catch (error) {
      console.error('Failed to add budget:', error)
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await budgetService.deleteBudget(budgetId)
      if (response.success) {
        setBudgets(budgets.filter((b) => b.id !== budgetId))
      }
    } catch (error) {
      console.error('Failed to delete budget:', error)
    }
  }

  if (isLoading) return <Loader fullScreen />

  const getBudgetStatus = (spent: number, budget: number, threshold: number) => {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return 'exceeded'
    if (percentage >= threshold) return 'warning'
    return 'on_track'
  }

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Budgets</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Create Budget
          </Button>
        </div>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Budget">
          <form className="space-y-4" onSubmit={handleAddBudget}>
            <Input
              label="Budget Name"
              placeholder="e.g., Monthly Food Budget"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Select
              label="Category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
            />

            <Input
              label="Budget Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <Select
              label="Period"
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              required
            />

            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />

            <Input
              label="Alert Threshold (%)"
              type="number"
              min="0"
              max="100"
              value={formData.alert_threshold}
              onChange={(e) => setFormData({ ...formData, alert_threshold: e.target.value })}
              required
            />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Budget
              </Button>
            </div>
          </form>
        </Modal>

        {/* Budgets List */}
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget.spent, budget.amount, budget.alert_threshold)
              const percentage = (budget.spent / budget.amount) * 100

              return (
                <Card key={budget.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{budget.name}</h3>
                      <Badge
                        variant={status === 'exceeded' ? 'danger' : status === 'warning' ? 'warning' : 'success'}
                      >
                        {status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{budget.period}</p>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatCurrency(budget.spent, user?.currency)}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(budget.amount, user?.currency)}
                        </span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} max={100} />
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {percentage.toFixed(0)}% used
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    Delete
                  </Button>
                </Card>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No Budgets"
            description="Create your first budget to start tracking spending"
            icon="💰"
            action={
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Create Budget
              </Button>
            }
          />
        )}
      </div>
    </ProtectedLayout>
  )
}

export default BudgetsPage
