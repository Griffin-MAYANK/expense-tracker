'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedLayout } from '@/components/layout'
import { Card, Button, Input, Select, Loader } from '@/components/ui'
import { useUserStore } from '@/store'
import { useAuth } from '@/hooks'
import { authService } from '@/services/auth.service'
import { useNotificationStore } from '@/store'

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const { addNotification } = useNotificationStore()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    currency: 'USD',
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        currency: user.currency || 'USD',
        theme: user.theme || 'system',
        language: user.language || 'en',
        timezone: user.timezone || 'UTC',
      })
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      setIsLoading(true)
      const response = await authService.updateProfile(user.id, formData)

      if (response.success && response.data) {
        setUser(response.data)
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Profile updated successfully',
        })
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return

    const success = await logout()
    if (success) {
      router.push('/login')
    }
  }

  if (!user) return <Loader fullScreen />

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>

        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Information</h2>
          <div className="space-y-4">
            <Input label="Email" type="email" value={user.email} disabled />
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preferences</h2>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <Select
              label="Currency"
              options={[
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'GBP', label: 'British Pound (GBP)' },
                { value: 'INR', label: 'Indian Rupee (INR)' },
                { value: 'JPY', label: 'Japanese Yen (JPY)' },
              ]}
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            />

            <Select
              label="Theme"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System Default' },
              ]}
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />

            <Select
              label="Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
              ]}
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />

            <Select
              label="Timezone"
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'EST', label: 'Eastern Standard Time' },
                { value: 'CST', label: 'Central Standard Time' },
                { value: 'MST', label: 'Mountain Standard Time' },
                { value: 'PST', label: 'Pacific Standard Time' },
                { value: 'IST', label: 'Indian Standard Time' },
              ]}
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            />

            <Button variant="primary" type="submit" isLoading={isLoading}>
              Save Preferences
            </Button>
          </form>
        </Card>

        {/* Security */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Manage your account security</p>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full">Change Password</Button>
            <Button variant="secondary" className="w-full">Enable Two-Factor Authentication</Button>
          </div>
        </Card>

        {/* Data & Storage */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data & Storage</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Manage your data</p>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full">Export All Data</Button>
            <Button variant="danger" className="w-full">Delete Account</Button>
          </div>
        </Card>

        {/* Logout */}
        <Card>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Sign out of your account on this device</p>
          <Button variant="danger" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </Card>
      </div>
    </ProtectedLayout>
  )
}

export default ProfilePage
