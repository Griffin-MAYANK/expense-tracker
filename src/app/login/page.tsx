'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/layout'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks'
import { isValidEmail } from '@/lib/utils'

const LoginPage: React.FC = () => {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const success = await login(formData.email, formData.password)
    if (success) {
      router.push('/dashboard')
    }
  }

  // Demo account
  const fillDemoAccount = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'Demo@1234',
    })
  }

  return (
    <AuthLayout>
      <Card className="bg-white/95 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Expense Tracker Pro</h1>
          <p className="text-slate-600">Manage your finances smartly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button variant="primary" className="w-full" isLoading={isLoading} type="submit">
            Login
          </Button>
        </form>

        <div className="my-4 border-t border-slate-200">
          <div className="flex items-center justify-center -translate-y-2">
            <span className="bg-white px-2 text-slate-500 text-sm">or</span>
          </div>
        </div>

        <Button variant="ghost" className="w-full" onClick={fillDemoAccount}>
          Try Demo Account
        </Button>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}

export default LoginPage
