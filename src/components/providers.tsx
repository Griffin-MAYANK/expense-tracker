'use client'

import React, { useEffect } from 'react'
import { useUiStore, useNotificationStore } from '@/store'

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useUiStore()
  const { notifications } = useNotificationStore()

  // Apply theme
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else if (theme === 'light') {
      html.classList.remove('dark')
    } else {
      // System default
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }, [theme])

  return (
    <>
      {children}
      
      {/* Notifications Container */}
      <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg text-white animate-slideInRight ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
          >
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm mt-1">{notification.message}</p>
          </div>
        ))}
      </div>
    </>
  )
}
