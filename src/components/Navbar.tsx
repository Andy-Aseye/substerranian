'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-GB', { 
      hour12: false, 
      timeZone: 'Europe/London' 
    })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 mt-7 w-[90vw] mx-auto rounded-full  backdrop-blur-md border border-gray-700/50 shadow-2xl"
    >
      <div className="flex justify-between items-center h-16 px-6">
        {/* Brand Name - Left */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <h1 className="text-lg font-bold text-white tracking-wider">SUBTERRANEA</h1>
        </motion.div>

        {/* Search Section - Center */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-center max-w-md">
          <p className="text-white text-sm">I&apos;m looking for...</p>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="w-full px-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              />
            </div>
          </form>
        </div>

        {/* Time Display - Right */}
        <div className="hidden md:flex items-center">
          <span className="text-white font-bold text-sm">
            {getCurrentTime()}
          </span>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-700/50"
          >
            <div className="px-6 py-4 space-y-4">
              <p className="text-white text-sm">I&apos;m looking for...</p>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books..."
                    className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  />
                </div>
              </form>
              <div className="text-white font-bold text-sm">
                {getCurrentTime()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
