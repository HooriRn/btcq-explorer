import { useState, useEffect, useRef } from 'react'

/**
 * Hook that animates a number from its current value to a target value
 * @param targetValue The target number to animate to
 * @param duration Duration of the animation in milliseconds (default: 1000ms)
 * @returns The current animated value
 */
export const useAnimatedNumber = (targetValue: number, duration: number = 1000): number => {
  const [currentValue, setCurrentValue] = useState(targetValue)
  const animationFrameRef = useRef<number | null>(null)
  const currentValueRef = useRef(targetValue)
  const prevTargetRef = useRef(targetValue)

  // Keep ref in sync with state
  useEffect(() => {
    currentValueRef.current = currentValue
  }, [currentValue])

  useEffect(() => {
    // If the target hasn't changed, don't animate
    if (prevTargetRef.current === targetValue) {
      return
    }

    // Cancel any ongoing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const startValue = currentValueRef.current
    const difference = targetValue - startValue
    const startTime = Date.now()
    prevTargetRef.current = targetValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const newValue = Math.round(startValue + difference * easedProgress)
      setCurrentValue(newValue)
      currentValueRef.current = newValue

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Ensure we end exactly at the target value
        setCurrentValue(targetValue)
        currentValueRef.current = targetValue
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [targetValue, duration])

  return currentValue
}

