'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader } from './ui'
import Link from 'next/link'
import { useUserStore, useUiStore } from '@/store'
import { createClient } from '@/lib/supabase/client'

export const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { user, isLoading, setUser, setLoading } = useUserStore()
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, setLoading])

  if (isLoading) {
    return <Loader fullScreen />
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/transactions', label: 'Transactions', icon: '💳' },
    { href: '/budgets', label: 'Budgets', icon: '💰' },
    { href: '/reports', label: 'Reports', icon: '📊' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-primary-600">ETP</h1>}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 border-r-4 border-primary-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
