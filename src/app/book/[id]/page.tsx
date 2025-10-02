'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Calendar, User, MapPin } from 'lucide-react'
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
    <div className="min-h-screen">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Top Section - Red Background with Back Button and Book Cover */}
        <div className="">
          {/* Back Button */}
          <div className="">
            <button
              onClick={() => router.push('/')}
              className="text-white text-sm hover:underline focus:outline-none absolute top-5 left-5 z-10"
            >
              <ArrowLeft className='w-5 h-5 inline-block' /> Back to Library
            </button>
          </div>
          
          {/* Book Cover */}
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                className="!relative"
                sizes="(max-width: 768px) 192px"
                priority
              />
        </div>

        {/* Middle Section - Red Background with Large Title */}


        {/* Bottom Section - Yellow Background with Details */}
        <div className="bg-[#E8DE37] p-6 min-h-screen flex flex-col">
          {/* Book Title */}
          <h2 className="text-xl font-bold italic text-black mb-2">
            {book.title}
          </h2>
          
          {/* Authors */}
          <p className="text-lg italic text-black mb-6">
            by {book.author}
          </p>
          
          {/* Book Description */}
          <div className="mb-6">
            <p className="text-sm text-black leading-relaxed">
              {book.description}
            </p>
          </div>
          
          {/* Purchase Information */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-black">Buy here:</span>
              <span className="text-sm font-semibold text-black text-right">
                {book.title}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-black">Online:</span>
              <span className="text-sm font-semibold text-black">
                {book.external_link ? 'Available' : 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Location Information */}
          <div className="mb-6">
            <p className="text-sm text-black mb-2">
              Come and see this book at
            </p>
            <p className="text-sm font-semibold text-black">
              The House of Annetta
            </p>
            <div className="flex items-center text-sm text-black">
              <MapPin className="w-4 h-4 mr-2" />
              <a href='https://maps.app.goo.gl/xGb4pyZVQ7V8bPe79' target='_blank' className='cursor-pointer hover:text-blue-900 transition-colors'>
                25 Princelet St, London E1 6QH
              </a>
            </div>
          </div>
          
          <p className="text-sm text-black mb-2">
            <span className='font-bold'>ISBN:</span> {book.isbn || ''}
          </p>
          {/* ISBN and Barcode */}
          <div className="mt-auto mx-auto">
            <img 
                alt='Barcode' 
                src={`https://barcode.tec-it.com/barcode.ashx?data=${book.isbn}&code=ISBN13&imagetype=Jpg&bgcolor=E8DE37`}
                className='mx-auto'
              />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen relative">
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
          {/* Yellow Card - Positioned absolutely on the left */}
          <div className="absolute left-0 top-0 h-[100vh] w-[20vw] bg-[#E8DE37] p-6 overflow-y-auto z-20 flex flex-col">
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
                <MapPin className="w-4 h-4 mr-2" />
                <a href='https://maps.app.goo.gl/xGb4pyZVQ7V8bPe79' target='_blank' className='cursor-pointer hover:text-blue-900 transition-colors'>
                  25 Princelet St, London E1 6QH
                </a>
              </div>
            </div>
          
            <p className="text-sm text-black mb-2 font-inter">
              <span className='font-bold'>ISBN:</span> {book.isbn || ''}
            </p>
            
            {/* ISBN and Barcode */}
            <div className="mt-auto mx-auto">
              <img 
                alt='Barcode' 
                src={`https://barcode.tec-it.com/barcode.ashx?data=${book.isbn}&code=ISBN13&imagetype=Jpg&bgcolor=E8DE37`}
              />
            </div>
          </div>
          <div className='absolute right-20 top-10 space-x-2 text-white hover:underline focus:outline-none z-20'>
            <div onClick={() => router.push('/')} className='flex items-center space-x-2 cursor-pointer' >
            <ArrowLeft className='w-5 h-5' /> <p><em>Back to Library</em></p>
            </div>
            <Image
            src={book.cover_image_url}
            alt=""
            fill
            className="object-contain !h-auto !relative"
            priority
          />
          </div>
        </div>
      </div>
    </div>
  );
}



