'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  clickable?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className, clickable, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      'bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700',
      clickable && 'cursor-pointer hover:shadow-lg transition-shadow',
      className
    )}
  >
    {children}
  </div>
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-slate-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 disabled:bg-slate-300',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 disabled:bg-slate-300',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
      <input
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
          'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
          'transition-colors outline-none',
          icon && 'pl-10',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-danger-500 text-sm mt-1">{error}</p>}
  </div>
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <select
      className={cn(
        'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
        'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
        'transition-colors outline-none',
        error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
        className
      )}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-danger-500 text-sm mt-1">{error}</p>}
  </div>
)

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-100',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-100',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return <span className={cn('inline-flex rounded-full font-medium', variants[variant], sizes[size])}>{children}</span>
}

interface ProgressProps {
  value: number
  max?: number
  showLabel?: boolean
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, showLabel, color = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    success: 'bg-green-500',
  }

  return (
    <div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{percentage.toFixed(1)}%</p>}
    </div>
  )
}

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className={cn('border-2 border-slate-300 dark:border-slate-600 border-t-primary-500 rounded-full animate-spin', sizes[size])} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {icon && <div className="text-4xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">{description}</p>
    {action}
  </div>
)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  )
}
