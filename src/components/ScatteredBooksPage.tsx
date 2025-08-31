'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BookCard from './BookCard'
import { supabase, Book } from '@/lib/supabase'

export default function ScatteredBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      // Check if Supabase is properly configured
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

  // Function to assign random sizes to books
  const getBookSize = () => {
    const random = Math.random()
    
    // 50% chance of being normal size
    if (random < 0.5) {
      return 'scale-100'
    }
    // 25% chance of being slightly larger
    else if (random < 0.75) {
      return 'scale-110'
    }
    // 15% chance of being larger
    else if (random < 0.9) {
      return 'scale-125'
    }
    // 10% chance of being even larger
    else {
      return 'scale-140'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Books</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please check your Supabase configuration.</p>
        </div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Books Found</h2>
          <p className="text-gray-500">No books are available in the database.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="relative min-h-screen p-4">
        {/* Background gradient */}
        <div className="absolute inset-0 scattered-bg" />
        
        {/* Success message */}
        {/* <div className="relative z-20 max-w-7xl mx-auto mb-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="text-sm">✅ Successfully loaded {books.length} books from Supabase</p>
          </div>
        </div> */}
        
        {/* Scattered books container */}
        <div className="relative mt-[4vh] z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4"
          >
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: Math.random() * 20 - 10,
                  x: Math.random() * 40 - 20,
                  y: Math.random() * 40 - 20
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 0,
                  z: 10
                }}
                className="relative"
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
