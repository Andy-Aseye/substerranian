'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BookCard from './BookCard'
import { supabase, Book } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ScatteredBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  // Pagination settings
  const booksPerPage = 27 // Total books per inventory page (28 per page)
  const leftPageBooks = 15 // Books on left page (7x4)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Supabase is not configured. Please set up your environment variables.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load books from database')
        setBooks([])
      } else {
        setBooks(data || [])
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      setError('Failed to load books')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(books.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentPageBooks = books.slice(startIndex, endIndex)
  
  // Split current page books into left and right
  const leftPage = currentPageBooks.slice(0, leftPageBooks)
  const rightPage = currentPageBooks.slice(leftPageBooks, booksPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPrevPage = () => goToPage(currentPage - 1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Books</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">No Books Found</h2>
          <p className="text-gray-500">No books are available in the database.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative overflow-hidden min-h-screen"
      style={{
        backgroundImage: 'url(/bg-image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* <Navbar /> */}

      <div className="relative z-10 p-8">
        {/* Title */}
        <div className='flex justify-between items-center mb-2'>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-widest">
            SUBTERRANEA&apos;S INVENTORY
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* <p className="text-white text-sm">I&apos;m looking for...</p> */}
          
          <form onSubmit={handleSearch} className="flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I&apos;m looking for..."
                className="w-full px-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#020EFF] transition-all duration-200"
              />
            </div>
          </form>
        </div>
        </div>
        

        {/* Two-Page Spread */}
        <div className="max-w-9xl mx-auto">
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 relative"
            style={{
              borderTop: '2px solid rgba(255,255,255,0.2)',
              borderImage: `
                linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(255,255,255,0.2) 2%,
                  rgba(255,255,255,0.1) 4%,
                  rgba(255,255,255,0.2) 6%,
                  rgba(255,255,255,0.1) 8%,
                  rgba(255,255,255,0.2) 10%,
                  rgba(255,255,255,0.1) 12%,
                  rgba(255,255,255,0.2) 14%,
                  rgba(255,255,255,0.1) 16%,
                  rgba(255,255,255,0.2) 18%,
                  rgba(255,255,255,0.1) 20%,
                  rgba(255,255,255,0.2) 22%,
                  rgba(255,255,255,0.1) 24%,
                  rgba(255,255,255,0.2) 26%,
                  rgba(255,255,255,0.1) 28%,
                  rgba(255,255,255,0.2) 30%,
                  rgba(255,255,255,0.1) 32%,
                  rgba(255,255,255,0.2) 34%,
                  rgba(255,255,255,0.1) 36%,
                  rgba(255,255,255,0.2) 38%,
                  rgba(255,255,255,0.1) 40%,
                  rgba(255,255,255,0.2) 42%,
                  rgba(255,255,255,0.1) 44%,
                  rgba(255,255,255,0.2) 46%,
                  rgba(255,255,255,0.1) 48%,
                  rgba(255,255,255,0.2) 50%,
                  rgba(255,255,255,0.1) 52%,
                  rgba(255,255,255,0.2) 54%,
                  rgba(255,255,255,0.1) 56%,
                  rgba(255,255,255,0.2) 58%,
                  rgba(255,255,255,0.1) 60%,
                  rgba(255,255,255,0.2) 62%,
                  rgba(255,255,255,0.1) 64%,
                  rgba(255,255,255,0.2) 66%,
                  rgba(255,255,255,0.1) 68%,
                  rgba(255,255,255,0.2) 70%,
                  rgba(255,255,255,0.1) 72%,
                  rgba(255,255,255,0.2) 74%,
                  rgba(255,255,255,0.1) 76%,
                  rgba(255,255,255,0.2) 78%,
                  rgba(255,255,255,0.1) 80%,
                  rgba(255,255,255,0.2) 82%,
                  rgba(255,255,255,0.1) 84%,
                  rgba(255,255,255,0.2) 86%,
                  rgba(255,255,255,0.1) 88%,
                  rgba(255,255,255,0.2) 90%,
                  rgba(255,255,255,0.1) 92%,
                  rgba(255,255,255,0.2) 94%,
                  rgba(255,255,255,0.1) 96%,
                  rgba(255,255,255,0.2) 98%,
                  transparent 100%
                ) 1
              `,
              filter: 'blur(0.3px)'
            }}
          >
            
            {/* Left Page - 7x4 Grid */}
            <div 
              className="rounded-tl-lg rounded-bl-lg pr-4"
              style={{
                borderRight: '2px solid rgba(255,255,255,0.2)',
                borderImage: `
                  linear-gradient(
                    to bottom,
                    transparent 0%,
                    rgba(255,255,255,0.2) 2%,
                    rgba(255,255,255,0.1) 4%,
                    rgba(255,255,255,0.2) 6%,
                    rgba(255,255,255,0.1) 8%,
                    rgba(255,255,255,0.2) 10%,
                    rgba(255,255,255,0.1) 12%,
                    rgba(255,255,255,0.2) 14%,
                    rgba(255,255,255,0.1) 16%,
                    rgba(255,255,255,0.2) 18%,
                    rgba(255,255,255,0.1) 20%,
                    rgba(255,255,255,0.2) 22%,
                    rgba(255,255,255,0.1) 24%,
                    rgba(255,255,255,0.2) 26%,
                    rgba(255,255,255,0.1) 28%,
                    rgba(255,255,255,0.2) 30%,
                    rgba(255,255,255,0.1) 32%,
                    rgba(255,255,255,0.2) 34%,
                    rgba(255,255,255,0.1) 36%,
                    rgba(255,255,255,0.2) 38%,
                    rgba(255,255,255,0.1) 40%,
                    rgba(255,255,255,0.2) 42%,
                    rgba(255,255,255,0.1) 44%,
                    rgba(255,255,255,0.2) 46%,
                    rgba(255,255,255,0.1) 48%,
                    rgba(255,255,255,0.2) 50%,
                    rgba(255,255,255,0.1) 52%,
                    rgba(255,255,255,0.2) 54%,
                    rgba(255,255,255,0.1) 56%,
                    rgba(255,255,255,0.2) 58%,
                    rgba(255,255,255,0.1) 60%,
                    rgba(255,255,255,0.2) 62%,
                    rgba(255,255,255,0.1) 64%,
                    rgba(255,255,255,0.2) 66%,
                    rgba(255,255,255,0.1) 68%,
                    rgba(255,255,255,0.2) 70%,
                    rgba(255,255,255,0.1) 72%,
                    rgba(255,255,255,0.2) 74%,
                    rgba(255,255,255,0.1) 76%,
                    rgba(255,255,255,0.2) 78%,
                    rgba(255,255,255,0.1) 80%,
                    rgba(255,255,255,0.2) 82%,
                    rgba(255,255,255,0.1) 84%,
                    rgba(255,255,255,0.2) 86%,
                    rgba(255,255,255,0.1) 88%,
                    rgba(255,255,255,0.2) 90%,
                    rgba(255,255,255,0.1) 92%,
                    rgba(255,255,255,0.2) 94%,
                    rgba(255,255,255,0.1) 96%,
                    rgba(255,255,255,0.2) 98%,
                    transparent 100%
                  ) 1
                `,
                filter: 'blur(0.3px)'
              }}
            >
              <div className="grid grid-cols-5">
                {leftPage.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 0.8, 
                      rotate: Math.random() * 20 - 10
                    }}
                    transition={{ 
                      delay: index * 0.05, 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1,
                      rotate: 0,
                      z: 10
                    }}
                    className="relative group"
                  >
                    {/* BookCard */}
                    <div className="transform scale-75 origin-center">
                      <BookCard book={book} />
                    </div>
                    <div className='flex justify-end'><span className='text-white absolute bottom-3'><span className='text-white absolute bottom-3 w-6 h-6 bg-gray-800 border border-white rounded-full flex items-center justify-center text-xs font-bold'>
                        {index + 1}
                      </span></span></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Page - 7x3 Grid + List */}
            <div className="rounded-tr-lg rounded-br-lg">
              <div className="flex gap-4">
                {/* Grid Section */}
                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-x-1 gap-y-0">
                    {rightPage.map((book, index) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 0.8, 
                          rotate: Math.random() * 20 - 10
                        }}
                        transition={{ 
                          delay: (index + leftPageBooks) * 0.05, 
                          duration: 0.8,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          scale: 1,
                          rotate: 0,
                          z: 10
                        }}
                        className="relative group"
                      >
                        {/* BookCard */}
                        <div className="transform scale-[0.70] origin-center">
                          <BookCard book={book} />
                        </div>
                        <div className='flex justify-end'><span className='text-white absolute bottom-3'><span className='text-white absolute bottom-3 w-6 h-6 bg-gray-800 border border-white rounded-full flex items-center justify-center text-xs font-bold'>
                        {index + 17}
                      </span></span></div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Numbered List - Right Side */}
                <div className="w-36 flex-shrink-0">
                  <div className="rounded-lg p-4">
                    <h3 
                      className="text-white font-semibold mb-3 text-center cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => router.push('/viewallbooks')}
                    >
                      <span className='border-b'>View All</span> &gt;
                    </h3>
                    <div className="space-y-2 text-sm h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {currentPageBooks.map((book, index) => (
                        <div key={book.id} className="text-white flex items-baseline gap-1">
                          <p className="text-white">{startIndex + index + 1}. </p>
                          <p className="text-white text-xs">{book.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            {/* Previous Button */}
            <motion.button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } transition-colors`}
              whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Next Button */}
            <motion.button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } transition-colors`}
              whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
          
        </div>
      </div>
    </div>
  )
}
