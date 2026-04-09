'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProtectedLayout } from '@/components/layout'
import { Card, Button, Input, Select, Loader, EmptyState, Modal } from '@/components/ui'
import { useUserStore } from '@/store'
import { transactionService } from '@/services/transaction.service'
import { accountService } from '@/services/account.service'
import { categoryService } from '@/services/category.service'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

const TransactionsPage: React.FC = () => {
  const searchParams = useSearchParams()
  const { user } = useUserStore()
  const [transactions, setTransactions] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add')
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    account: '',
    dateFrom: '',
    dateTo: '',
  })

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category_id: '',
    account_id: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    merchant: '',
    notes: '',
    payment_method: 'card',
  })

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const [transResp, accResp, catResp] = await Promise.all([
          transactionService.getRecentTransactions(user.id, 100),
          accountService.getAccounts(user.id),
          categoryService.getCategories(user.id),
        ])

        if (transResp.success) setTransactions(transResp.data || [])
        if (accResp.success) setAccounts(accResp.data || [])
        if (catResp.success) setCategories(catResp.data || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      const response = await transactionService.addTransaction(user.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      })

      if (response.success) {
        setShowModal(false)
        setFormData({
          amount: '',
          type: 'expense',
          category_id: '',
          account_id: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          merchant: '',
          notes: '',
          payment_method: 'card',
        })
        // Reload transactions
        const resp = await transactionService.getRecentTransactions(user.id, 100)
        if (resp.success) setTransactions(resp.data || [])
      }
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filters.type && t.type !== filters.type) return false
    if (filters.category && t.category_id !== filters.category) return false
    if (filters.account && t.account_id !== filters.account) return false
    if (filters.dateFrom && t.date < filters.dateFrom) return false
    if (filters.dateTo && t.date > filters.dateTo) return false
    return true
  })

  if (isLoading) return <Loader fullScreen />

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-100 dark:bg-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select
              label="Type"
              options={[
                { value: '', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
            <Select
              label="Category"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
            <Select
              label="Account"
              options={[
                { value: '', label: 'All Accounts' },
                ...accounts.map((a) => ({ value: a.id, label: a.name })),
              ]}
              value={filters.account}
              onChange={(e) => setFilters({ ...filters, account: e.target.value })}
            />
            <Input
              label="From Date"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <Input
              label="To Date"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </Card>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
          <form className="space-y-4" onSubmit={handleAddTransaction}>
            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <Select
              label="Type"
              options={[
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />

            <Select
              label="Category"
              options={categories
                .filter((c) => c.type === formData.type)
                .map((c) => ({ value: c.id, label: c.name }))}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
            />

            <Select
              label="Account"
              options={accounts.map((a) => ({ value: a.id, label: a.name }))}
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              required
            />

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Merchant"
              placeholder="e.g., McDonald's"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            />

            <Input
              label="Notes"
              placeholder="Add notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Transaction
              </Button>
            </div>
          </form>
        </Modal>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="flex items-center justify-between hover:shadow-lg transition-shadow">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{transaction.category?.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.merchant || transaction.notes || 'No description'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{formatDate(transaction.date)}</p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-lg font-bold',
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, user?.currency)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{transaction.account?.name}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Transactions"
            description="Create your first transaction to get started"
            icon="💳"
            action={
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Transaction
              </Button>
            }
          />
        )}
      </div>
    </ProtectedLayout>
  )
}

export default TransactionsPage
