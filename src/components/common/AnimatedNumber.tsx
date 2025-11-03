import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
}

/**
 * Component that displays a number with smooth animation when the value changes
 */
export const AnimatedNumber = ({ 
  value, 
  duration = 1000, 
  formatter = (val) => val.toLocaleString(),
  className = '' 
}: AnimatedNumberProps) => {
  const animatedValue = useAnimatedNumber(value, duration)

  return <span className={className}>{formatter(animatedValue)}</span>
}

