// Script to seed default data into the database
// This script can be run via: node scripts/seed.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#FFE66D', type: 'expense' },
  { name: 'Bills & Utilities', icon: '💡', color: '#95E1D3', type: 'expense' },
  { name: 'Rent', icon: '🏠', color: '#F38181', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#AA96DA', type: 'expense' },
  { name: 'Health', icon: '💊', color: '#EC97B9', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#A29BFE', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#6C5FFF', type: 'expense' },
  { name: 'Groceries', icon: '🛒', color: '#00D2FC', type: 'expense' },
  { name: 'Subscriptions', icon: '📱', color: '#FCBF49', type: 'expense' },
  { name: 'Gifts', icon: '🎁', color: '#FF006E', type: 'expense' },
  { name: 'Personal Care', icon: '💅', color: '#FB5607', type: 'expense' },
  { name: 'Insurance', icon: '🛡️', color: '#FFBE0B', type: 'expense' },
  { name: 'Taxes', icon: '📊', color: '#8338EC', type: 'expense' },
  { name: 'Other', icon: '📌', color: '#A8DADC', type: 'expense' },
]

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#10B981', type: 'income' },
  { name: 'Freelance', icon: '👨‍💻', color: '#3B82F6', type: 'income' },
  { name: 'Business', icon: '🏢', color: '#F59E0B', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#8B5CF6', type: 'income' },
  { name: 'Rental Income', icon: '🏘️', color: '#EC4899', type: 'income' },
  { name: 'Bonus', icon: '🎊', color: '#14B8A6', type: 'income' },
  { name: 'Gift Received', icon: '🎉', color: '#06B6D4', type: 'income' },
  { name: 'Refund', icon: '🔄', color: '#F97316', type: 'income' },
  { name: 'Other', icon: '📌', color: '#06B6D4', type: 'income' },
]

const DEMO_USER = {
  email: 'demo@example.com',
  password: 'Demo@1234',
  fullName: 'Demo User',
}

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create demo user
    console.log('\n📝 Creating demo user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      email_confirm: true,
    })

    if (authError && authError.message !== 'A user with this email address has already been registered') {
      console.error('Error creating user:', authError)
      process.exit(1)
    }

    const userId = authData?.user?.id || (await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    })).data.user?.id

    if (!userId) {
      console.error('Failed to get user ID')
      process.exit(1)
    }

    console.log(`✅ Demo user created/found: ${userId}`)

    // Upsert user profile
    console.log('\n👤 Setting up user profile...')
    const { error: profileError } = await supabase.from('users').upsert({
      id: userId,
      email: DEMO_USER.email,
      full_name: DEMO_USER.fullName,
      currency: 'USD',
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    }, { onConflict: 'id' })

    if (profileError) {
      console.error('Error setting up profile:', profileError)
    } else {
      console.log('✅ User profile set up')
    }

    // Create demo accounts
    console.log('\n💰 Creating demo accounts...')
    const demoAccounts = [
      { name: 'Cash', type: 'cash', balance: 500, color: '#FFD93D' },
      { name: 'Debit Card', type: 'debit_card', balance: 2000, color: '#6BCB77' },
      { name: 'Credit Card', type: 'credit_card', balance: 0, color: '#FF6B6B' },
      { name: 'Savings', type: 'savings_account', balance: 5000, color: '#4D96FF' },
    ]

    for (const account of demoAccounts) {
      const { error } = await supabase.from('accounts').insert({
        user_id: userId,
        ...account,
      })
      if (error) console.error(`Error creating ${account.name}:`, error)
    }
    console.log('✅ Demo accounts created')

    // Create default categories
    console.log('\n🏷️ Creating default categories...')
    const allCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]

    for (const category of allCategories) {
      const { error } = await supabase.from('categories').insert({
        user_id: userId,
        ...category,
        is_custom: false,
      })
      if (error && error.code !== '23505') {
        console.error(`Error creating ${category.name}:`, error)
      }
    }
    console.log('✅ Default categories created')

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\n📧 Demo Account Credentials:')
    console.log(`Email: ${DEMO_USER.email}`)
    console.log(`Password: ${DEMO_USER.password}`)

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedData()
