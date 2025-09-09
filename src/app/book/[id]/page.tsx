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
    <div className="min-h-screen relative">
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={book.cover_image_url}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        {/* <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
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
        </motion.div> */}
        {/* Yellow Card - Positioned absolutely on the left */}
        <div className="absolute left-0 top-0 h-[100vh] w-[20vw] bg-[#E8DE37] p-6 overflow-y-auto z-20">
          {/* Book Title */}
          <h1 className="text-2xl font-bold text-black mb-2 font-inter">
            {book.title}
          </h1>
          
          {/* Authors */}
          <p className="text-sm italic text-black mb-6 font-inter">
            by {book.author}
          </p>
          
          {/* Book Description */}
          <div className="mb-6">
            <p className="text-sm text-black leading-relaxed font-inter">
              {book.description}
            </p>
          </div>
          
          {/* Purchase Information */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-black font-inter">Buy here:</span>
              <span className="text-sm font-semibold text-black font-inter text-right">
                {book.title}
                 {/* - {book.genre || 'Book Store'} */}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-black font-inter">Online:</span>
              <span className="text-sm font-semibold text-black font-inter">
                {book.external_link ? 'Available' : 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Location Information */}
          <div className="mb-6">
            <p className="text-sm text-black mb-2 font-inter">
              Come and see this book at
            </p>
            <p className="text-sm font-semibold text-black font-inter">
              The House of Annetta
            </p>
            <div className="flex items-center text-sm text-black font-inter">
              <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
              25 Princelet St, London E1 6QH
            </div>
          </div>
          
          {/* ISBN and Barcode */}
          <div className="mt-auto">
            <p className="text-sm text-black mb-2 font-inter">
              ISBN {book.isbn || '978-1-908617-57-6'}
            </p>
            {/* Placeholder for barcode - you can add an actual barcode image here */}
            <div className="w-full h-12 bg-black/10 border border-black/20 rounded flex items-center justify-center">
              <span className="text-xs text-black/60 font-inter">Barcode</span>
            </div>
          </div>
        </div>
        <div className='absolute right-20 top-10 space-x-2 text-white hover:underline focus:outline-none z-20'>
          <div onClick={() => router.push('/')} className='flex items-center space-x-2 cursor-pointer' >
          <ArrowLeft className='w-5 h-5' /> <p><em><u>Back to Library</u></em></p>
          </div>
          <Image
          src={book.cover_image_url}
          alt=""
          fill
          className="object-contain !h-auto !relative"
          // sizes="100%"
          priority
        />
        </div>
      </div>
    </div>
  );
}



