import { useState, useEffect, useRef } from 'react'
import { AnimatedNumber } from './AnimatedNumber'

interface MetricCardValueProps {
  value: number
  colorClasses: {
    default: string
    highlight: string
  }
  duration?: number
}

/**
 * Component that displays a metric value with animation and highlights when it increases
 */
export const MetricCardValue = ({ 
  value, 
  colorClasses,
  duration = 1000 
}: MetricCardValueProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showArrow, setShowArrow] = useState(false)
  const prevValueRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // On initial load, don't show highlight
    if (prevValueRef.current === null) {
      prevValueRef.current = value
      return
    }

    // Check if value increased
    if (value > prevValueRef.current) {
      setIsHighlighted(true)
      setShowArrow(true)
      
      // Reset highlight after animation duration
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsHighlighted(false)
        setShowArrow(false)
      }, duration + 500) // Keep highlighted a bit longer than animation
    }

    prevValueRef.current = value

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, duration])

  return (
    <div className="flex items-center space-x-2">
      <p className={`text-3xl font-bold transition-colors duration-300 ${isHighlighted ? colorClasses.highlight : colorClasses.default}`}>
        <AnimatedNumber value={value} duration={duration} />
      </p>
      {showArrow && (
        <svg 
          className={`w-6 h-6 ${colorClasses.highlight} transition-opacity duration-300 animate-bounce`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
    </div>
  )
}

