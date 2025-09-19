'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Book } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ViewAllBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null)
  const [defaultBook, setDefaultBook] = useState<Book | null>(null)
  const router = useRouter()

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
        // Set the first book as default if available
        if (data && data.length > 0) {
          setDefaultBook(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      setError('Failed to load books')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (book: Book) => {
    router.push(`/book/${book.id}`)
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
    <div className="min-h-screen flex">
      {/* Left Side - Image Display */}
      <div className="w-1/2 relative">
        <div className="h-screen flex items-center justify-center">
          <motion.div
            key={hoveredBook?.id || defaultBook?.id || 'default'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            {(hoveredBook || defaultBook)?.cover_image_url ? (
              <img
                src={(hoveredBook || defaultBook)?.cover_image_url}
                alt={(hoveredBook || defaultBook)?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl font-semibold">Hover over a book</p>
                  <p className="text-gray-500">to see its cover</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Blue Divider with Text */}
      <div className="w-14 bg-[#020eff] flex items-center justify-center relative">
        <div 
          className="text-white font-semibold text-sm tracking-wider"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)'
          }}
        >
          SUBTERRANEA | AFRICAN ARTISTS LIBRARY
        </div>
      </div>

      {/* Right Side - Book List */}
      <div className="w-1/2 bg-gray-50 p-8">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              animate={{
                color: ["#ff0000", "#00ff00", "#0000ff", "#00FFFF", "#FF00FF", "#FFFF00"]
              }}
            transition = {{
              // duration: 1,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              repeat: Infinity,
              repeatType: "loop"

            }}
            className="text-4xl text-center mb-4 underline"
            
            > 
              <a href='https://docs.google.com/document/d/1GDa9C1okh_iwo2RgMB35RCZU4oCeRCFKHlliBInUDLo/edit?tab=t.0#heading=h.690theuvfh12' target='_blank'>Contribute To The Library!</a>
            </motion.h1>
          </div>

          {/* Book List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Artist Book Section */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-1">Artist Book</h2>
                <div className="space-y-0">
                  {books.filter(book => book.category === 'artist-book' || !book.category).slice(0, 5).map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredBook(book)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer"
                    >
                      <div className="text-gray-600 hover:text-blue-600 transition-colors">
                        <span className="font-medium">AB—</span>
                        {book.title}
                        {index < 3 && <sup className="text-xs ml-1">{index + 1}</sup>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Magazine Section */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-1">Magazine</h2>
                <div className="space-y-2">
                  {books.filter(book => book.category === 'magazine').slice(0, 4).map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 5) * 0.05 }}
                      onMouseEnter={() => setHoveredBook(book)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer"
                    >
                      <div className="text-black hover:text-blue-600 transition-colors">
                        <span className="font-medium">M—</span>
                        {book.title}
                        {index < 2 && <sup className="text-xs ml-1">{index + 4}</sup>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Demo Section */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-1">Demo-</h2>
                <div className="space-y-2">
                  {books.filter(book => book.category === 'demo').slice(0, 3).map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 9) * 0.05 }}
                      onMouseEnter={() => setHoveredBook(book)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer"
                    >
                      <div className="text-black hover:text-blue-600 transition-colors">
                        <span className="font-medium">Demo—</span>
                        {book.title}
                        {index < 2 && <sup className="text-xs ml-1">{index + 6}</sup>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Digi Files Section */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-1">Digi Files-</h2>
                <div className="space-y-2">
                  {books.filter(book => book.category === 'digital').slice(0, 2).map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 12) * 0.05 }}
                      onMouseEnter={() => setHoveredBook(book)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer"
                    >
                      <div className="text-black hover:text-blue-600 transition-colors">
                        <span className="font-medium">Digi Files—</span>
                        {book.title}
                        {index < 1 && <sup className="text-xs ml-1">{index + 8}</sup>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cargo Section */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-1">Cargo (Sample)</h2>
                <div className="space-y-2">
                  {books.filter(book => book.category === 'cargo').slice(0, 2).map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 14) * 0.05 }}
                      onMouseEnter={() => setHoveredBook(book)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer"
                    >
                      <div className="text-black hover:text-blue-600 transition-colors">
                        <span className="font-medium">Cargo</span>
                        {book.title}
                        {index < 1 && <sup className="text-xs ml-1">{index + 9}</sup>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
