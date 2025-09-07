'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BookCard from './BookCard'
import { supabase, Book } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ScatteredBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Pagination settings
  const booksPerPage = 56 // Total books per inventory page (28 per page)
  const leftPageBooks = 25 // Books on left page (7x4)
  const rightPageBooks = 25 // Books on right page (7x4)

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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <Navbar />
      
      <div className="relative min-h-screen p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-widest">
            SUBTERRANEA&apos;S INVENTORY
          </h1>
        </div>

        {/* Two-Page Spread */}
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
            
            {/* Left Page - 7x4 Grid */}
            <div className="bg-gray-800 rounded-tl-lg rounded-bl-lg p-6 border border-gray-700">
              <div className="grid grid-cols-5 gap-3">
                {leftPage.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: Math.random() * 20 - 10
                    }}
                    transition={{ 
                      delay: index * 0.05, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 0,
                      z: 10
                    }}
                    className="relative group"
                  >
                    {/* BookCard */}
                    <div className="transform scale-75 origin-center">
                      <BookCard book={book} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Page - 7x4 Grid + List */}
            <div className="bg-gray-800 rounded-tr-lg rounded-br-lg p-6 border border-gray-700">
              <div className="flex gap-4">
                {/* Grid Section */}
                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-3">
                    {rightPage.map((book, index) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          rotate: Math.random() * 20 - 10
                        }}
                        transition={{ 
                          delay: (index + leftPageBooks) * 0.05, 
                          duration: 0.6,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          rotate: 0,
                          z: 10
                        }}
                        className="relative group"
                      >
                        {/* BookCard */}
                        <div className="transform scale-75 origin-center">
                          <BookCard book={book} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Numbered List - Right Side */}
                <div className="w-36 flex-shrink-0">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-white font-semibold mb-3">View All &gt;</h3>
                    <div className="space-y-2 text-sm h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {currentPageBooks.map((book, index) => (
                        <div key={book.id} className="text-white">
                          <span className="text-white">{startIndex + index + 1}. </span>
                          <span className="text-white text-xs">{book.title}</span>
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

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    page === currentPage
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>

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
