'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Book } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/book/${book.id}`)
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotate: 0,
        z: 10
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="book-card cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={book.cover_image_url}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
        />
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            className="bg-white/90 rounded-full p-2"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Book info */}
      {/* <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-1">
          {book.author}
        </p>
      </div> */}
    </motion.div>
  )
}
