'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BookCard from '@/components/BookCard'
import { supabase, Book } from '@/lib/supabase'
import { Search, X } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchInput, setShowSearchInput] = useState(false)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%,genre.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to search books')
        setBooks([])
      } else {
        setBooks(data || [])
      }
    } catch (error) {
      console.error('Error searching books:', error)
      setError('Failed to search books')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setBooks([])
    setError(null)
    router.push('/search')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Search Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-md border-b border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white font-merriweather">
              Search Results
            </h1>
            
            <div className="flex items-center space-x-4">
              {!showSearchInput && (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              
              {showSearchInput && (
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books..."
                    className="px-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-300 font-inter">
                Search results for: <span className="text-white font-semibold">&quot;{searchQuery}&quot;</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-white transition-colors font-inter"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <p className="text-gray-600">
                  Found {books.length} book{books.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </p>
              </motion.div>

              {books.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse our collection
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                >
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
