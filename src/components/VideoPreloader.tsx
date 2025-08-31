'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface WelcomeTextProps {
  isVisible: boolean
  onComplete: () => void
}

interface PreloaderAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

const WelcomeText = ({ isVisible, onComplete }: WelcomeTextProps) => {
  const words = ["WELCOME", "TO", "SUBTERRANEA", "LIBRARY"]
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {words.map((word, index) => (
              <motion.div
                key={word}
                className="overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -100 : 100,
                  transition: { delay: index * 0.1, duration: 0.6 }
                }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                onAnimationComplete={() => {
                  if (index === words.length - 1) {
                    setTimeout(onComplete, 2000) // Wait 2s before starting preloader
                  }
                }}
              >
                <h1 
                  className="text-3xl md:text-5xl font-black tracking-widest mb-4 font-inter"
                  style={{
                    background: 'linear-gradient(135deg, #d1d5db 0%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {word}
                </h1>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const PreloaderAnimation = ({ isVisible, onComplete }: PreloaderAnimationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Preloader Container */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-24 h-24"
            style={{
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'transparent'
            }}
            animate={{
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              transform: 'translate(0, 0)',
              backgroundColor: '#ffffff'
            }}
            transition={{
              delay: 4,
              duration: 1,
              ease: "easeOut"
            }}
            onAnimationComplete={onComplete}
          >
            {/* Border Animation Segments */}
            <motion.div
              className="absolute top-0 left-0 h-0.5 bg-white"
              animate={{ width: '100%' }}
              transition={{ duration: 1, ease: "linear" }}
            />
            
            <motion.div
              className="absolute top-0 right-0 w-0.5 bg-white"
              animate={{ height: '100%' }}
              transition={{ delay: 1, duration: 1, ease: "linear" }}
            />
            
            <motion.div
              className="absolute bottom-0 right-0 h-0.5 bg-white"
              animate={{ width: '100%' }}
              transition={{ delay: 2, duration: 1, ease: "linear" }}
            />
            
            <motion.div
              className="absolute bottom-0 left-0 w-0.5 bg-white"
              animate={{ height: '100%' }}
              transition={{ delay: 3, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function VideoPreloader({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPreloader, setShowPreloader] = useState(false)
  const [uiVisible, setUiVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleVideoEnd)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  const handleVideoEnd = () => {
    // Fade out UI elements but keep video visible
    setUiVisible(false)
    
    // Brief pause, then show welcome text
    setTimeout(() => {
      setShowWelcome(true)
    }, 1000) // 1 second pause
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setTimeout(() => {
      setShowPreloader(true)
    }, 500)
  }

  const handlePreloaderComplete = () => {
    onComplete()
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectFit: 'cover' }}
      >
        <source src="/preloader.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* UI Elements */}
      <AnimatePresence>
        {uiVisible && (
          <>
            {/* Top Bar */}
            <motion.div 
              className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 text-white"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-sm font-mono">
                {new Date().toLocaleTimeString('en-US', { 
                  hour12: false, 
                  timeZone: 'Europe/London' 
                })} GMT
              </div>
              <div><p className='text-xs'>Powered by:</p><p  className="text-sm font-bold">Incandescence</p></div>
             
            </motion.div>

            {/* Right Side - Sound Control */}
            <motion.div 
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20"
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors transform rotate-90 origin-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted ? (
                  <VolumeX size={30} className="text-white" />
                ) : (
                  <Volume2 size={30} className="text-white" />
                )}
              </motion.button>
            </motion.div>

            {/* Bottom Bar */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white"
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-2xl font-bold">Maya Angelou | Noble Story</div>
                  </div>
                  <motion.button
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white ml-1" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-mono">{formatTime(currentTime)}</div>
                <div className="text-sm font-mono">{formatTime(duration)}</div>
              </div>

            
            </motion.div>
          </>
        )}
      </AnimatePresence>

      

      {/* Welcome Text Animation */}
      <WelcomeText 
        isVisible={showWelcome} 
        onComplete={handleWelcomeComplete}
      />

      {/* Preloader Animation */}
      <PreloaderAnimation 
        isVisible={showPreloader} 
        onComplete={handlePreloaderComplete}
      />
    </div>
  )
}
