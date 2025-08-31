'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react'
import { supabase, Book } from '@/lib/supabase'

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchBook(params.id as string)
    }
  }, [params.id])

  const fetchBook = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setBook(data)
    } catch (error) {
      console.error('Error fetching book:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-merriweather">Book not found</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-inter"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-inter"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Library
          </button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            {/* Book cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/3"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.div>

            {/* Book details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:w-2/3 p-6 md:p-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-merriweather">
                {book.title}
              </h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600 font-inter">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{book.author}</span>
                </div>

                {book.published_year && (
                  <div className="flex items-center text-gray-600 font-inter">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{book.published_year}</span>
                  </div>
                )}

                {book.genre && (
                  <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium font-inter">
                    {book.genre}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-merriweather">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed font-inter">
                  {book.description}
                </p>
              </div>

              <motion.a
                href={book.external_link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors font-inter"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Get This Book
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
