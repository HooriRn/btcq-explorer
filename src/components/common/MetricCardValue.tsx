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
 * Component that displays a metric value with animation and highlights when it increases or decreases
 */
export const MetricCardValue = ({ 
  value, 
  colorClasses,
  duration = 1000 
}: MetricCardValueProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showArrow, setShowArrow] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const prevValueRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // On initial load, don't show highlight
    if (prevValueRef.current === null) {
      prevValueRef.current = value
      return
    }

    // Check if value changed
    if (value !== prevValueRef.current) {
      const isIncrease = value > prevValueRef.current
      setIsHighlighted(true)
      setShowArrow(true)
      setDirection(isIncrease ? 'up' : 'down')
      
      // Reset highlight after animation duration
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsHighlighted(false)
        setShowArrow(false)
        setDirection(null)
      }, duration + 500) // Keep highlighted a bit longer than animation
    }

    prevValueRef.current = value

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, duration])

  const arrowColor = direction === 'down' 
    ? 'text-red-600 dark:text-red-400' 
    : colorClasses.highlight

  return (
    <div className="flex items-center space-x-2">
      <p className={`text-3xl font-bold transition-colors duration-300 ${isHighlighted ? colorClasses.highlight : colorClasses.default}`}>
        <AnimatedNumber value={value} duration={duration} />
      </p>
      {showArrow && direction && (
        <svg 
          className={`w-6 h-6 ${arrowColor} transition-opacity duration-300 animate-bounce`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {direction === 'up' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          )}
        </svg>
      )}
    </div>
  )
}

