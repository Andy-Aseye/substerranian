'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPreloader from '@/components/VideoPreloader'
import ScatteredBooksPage from '@/components/ScatteredBooksPage'

// Constants for localStorage management
const PRELOADER_KEY = 'subterranea-preloader'
const PRELOADER_VERSION = '1.0'

interface PreloaderData {
  seen: boolean
  timestamp: number
  version: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasSeenPreloader, setHasSeenPreloader] = useState(false)

  useEffect(() => {
    // Check if user has already seen the preloader
    const checkPreloaderStatus = () => {
      try {
        const stored = localStorage.getItem(PRELOADER_KEY)
        
        if (stored) {
          const data: PreloaderData = JSON.parse(stored)
          
          // Check if the stored version matches current version
          if (data.version === PRELOADER_VERSION && data.seen) {
            setHasSeenPreloader(true)
            setIsLoading(false)
            return
          }
        }
        
        // If no stored data or version mismatch, show preloader
        setHasSeenPreloader(false)
      } catch (error) {
        console.warn('Error reading preloader status from localStorage:', error)
        // Fallback: show preloader if there's an error
        setHasSeenPreloader(false)
      }
    }

    checkPreloaderStatus()
  }, [])

  const handlePreloaderComplete = () => {
    // Mark that the user has seen the preloader with version control
    const preloaderData: PreloaderData = {
      seen: true,
      timestamp: Date.now(),
      version: PRELOADER_VERSION
    }

    try {
      localStorage.setItem(PRELOADER_KEY, JSON.stringify(preloaderData))
    } catch (error) {
      console.warn('Error saving preloader status to localStorage:', error)
      // Fallback to sessionStorage if localStorage fails
      try {
        sessionStorage.setItem(PRELOADER_KEY, JSON.stringify(preloaderData))
      } catch (fallbackError) {
        console.warn('Error saving to sessionStorage as well:', fallbackError)
      }
    }

    setIsLoading(false)
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && !hasSeenPreloader ? (
        <VideoPreloader key="preloader" onComplete={handlePreloaderComplete} />
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScatteredBooksPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
