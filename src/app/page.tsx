'use client'

import React from 'react'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Expense Tracker Pro</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-primary-600 hover:bg-slate-100">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-white">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">Take Control of Your Finances</h2>
          <p className="text-xl text-white/90 mb-8">
            Track every expense, set smart budgets, and achieve your financial goals with our intuitive expense tracker.
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button className="bg-white text-primary-600 px-8 py-3 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="border-2 border-white text-white px-8 py-3 text-lg">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Powerful Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '💳',
                title: 'Smart Tracking',
                description: 'Easily track income, expenses, and transfers across multiple accounts',
              },
              {
                icon: '💰',
                title: 'Budget Control',
                description: 'Set budgets by category and get alerts before you overspend',
              },
              {
                icon: '📊',
                title: 'Detailed Analytics',
                description: 'Visualize your spending patterns with beautiful charts and reports',
              },
              {
                icon: '🏷️',
                title: 'Smart Categories',
                description: 'Pre-built categories with full customization support',
              },
              {
                icon: '🔄',
                title: 'Recurring Transactions',
                description: 'Set up automatic transactions for bills and regular income',
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                description: 'Eye-friendly dark mode for comfortable viewing anytime',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h3 className="text-3xl font-bold mb-6">Ready to manage your finances?</h3>
          <p className="text-lg mb-8 text-white/90">
            Create a free account today and start tracking your spending in minutes.
          </p>
          <Link href="/signup">
            <Button className="bg-white text-primary-600 px-8 py-3 text-lg hover:bg-slate-100">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Expense Tracker Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
