'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  BarChart3, 
  Package, 
  ShieldCheck, 
  Users,
  Rocket,
  ChevronRight,
  CheckCircle,
  Store,
  Search,
  Filter,
  ShoppingCart,
  Star,
  Eye,
  ArrowLeft
} from 'lucide-react'

export default function WelcomePage() {
  const [stats, setStats] = useState([
    { value: '10K+', label: 'Products Managed' },
    { value: '500+', label: 'Happy Businesses' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ])

  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: 'Real-Time Tracking',
      description: 'Monitor inventory levels in real-time across multiple locations',
      color: 'bg-blue-500'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Get insights with powerful analytics and reporting tools',
      color: 'bg-purple-500'
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption',
      color: 'bg-green-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with role-based access',
      color: 'bg-orange-500'
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager, TechCorp',
      content: 'StockFlow reduced our inventory discrepancies by 95% in just 3 months.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'CEO, RetailPro',
      content: 'The analytics dashboard alone was worth the investment. Game changer!',
      avatar: 'MC'
    },
    {
      name: 'Emma Williams',
      role: 'Warehouse Director',
      content: 'Our team loves the intuitive interface. Training time was cut in half.',
      avatar: 'EW'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      {/* <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StockFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition">Testimonials</a>
              <Link 
                href="/products" 
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Products →
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-6">
              <Rocket className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-700">
                Trusted by 500+ businesses worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Inventory
              </span>
              <br />
              <span className="text-gray-900">Management Simplified</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Take control of your inventory with our powerful, intuitive platform. 
              Real-time tracking, advanced analytics, and seamless team collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/products"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                Explore Products
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Section */}
          <section id="features" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-gray-600 text-lg">
                Powerful features designed to streamline your inventory management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${feature.color} bg-opacity-10 p-6 rounded-2xl border border-gray-200 hover:border-transparent transition-all duration-300 group cursor-pointer`}
                >
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-700" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 mb-20"
          >
            <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Inventory?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that trust StockFlow for their inventory needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
                >
                  <Store className="h-5 w-5 mr-2" />
                  Browse Products Catalog
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <section id="testimonials" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Loved by Businesses
              </h2>
              <p className="text-gray-600 text-lg">
                See what our customers have to say
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Store className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold">StockFlow</span>
              </div>
              <p className="text-gray-400">
                Smart inventory management for modern businesses
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-gray-400 mb-4">
                Ready to get started?
              </div>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                <Package className="h-5 w-5 mr-2" />
                Explore Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} StockFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}