import { type ReactNode, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    visibility: 'hidden' as const
  })

  useEffect(() => {
    if (!isVisible || !triggerRef.current) {
      setTooltipStyle({
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        visibility: 'hidden' as const
      })
      return
    }

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      if (tooltipRect.width === 0 && tooltipRect.height === 0) {
        requestAnimationFrame(updatePosition)
        return
      }

      const arrowSize = 8 // Size of the arrow

      let left = 0
      let top = 0

      
      // Calculate position based on trigger element and tooltip's actual dimensions
      if (position === 'top' || position === 'bottom') {
        // Center horizontally relative to trigger element
        left = triggerRect.left - (tooltipRect.width / 4) + (triggerRect.height)
        top = position === 'top' 
          ? triggerRect.top - tooltipRect.height
          : triggerRect.bottom + arrowSize
      } else if (position === 'left' || position === 'right') {
        left = position === 'left'
          ? triggerRect.left - tooltipRect.width - arrowSize
          : triggerRect.right + arrowSize
        // Center vertically relative to trigger element
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      }

      setTooltipStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 9999,
        maxWidth: 'min(280px, calc(100vw - 2rem))',
        wordWrap: 'break-word',
        width: 'max-content',
        visibility: 'visible' as const,
        opacity: 1
      })
    }

    // Wait for tooltip to be rendered and measured
    // Use multiple requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition)
      })
    }, 0)

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isVisible, position])

  const handleMouseEnter = () => setIsVisible(true)
  const handleMouseLeave = () => setIsVisible(false)

  const tooltip = isVisible && (
    <div
      ref={tooltipRef}
      className={`px-3 py-2 text-sm text-white bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg whitespace-normal relative pointer-events-none`}
      style={tooltipStyle}
      role="tooltip"
    >
      {content}
    </div>
  )

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && createPortal(tooltip, document.body)}
    </>
  )
}

