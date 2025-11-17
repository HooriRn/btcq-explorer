import { type ReactNode, useState, useEffect } from 'react'
import { Tooltip as HeroUITooltip, Popover, PopoverTrigger, PopoverContent } from '@heroui/react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect if device supports touch
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Map position to HeroUI's placement prop
  const placement = position as 'top' | 'bottom' | 'left' | 'right'

  // Use Popover for touch devices (works on click/tap)
  if (isTouchDevice) {
    return (
      <Popover 
        placement={placement}
        showArrow
        classNames={{
          base: 'max-w-[280px]',
          content: 'px-3 py-2 text-sm'
        }}
      >
        <PopoverTrigger>
          {children}
        </PopoverTrigger>
        <PopoverContent>
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  // Use Tooltip for non-touch devices (works on hover)
  return (
    <HeroUITooltip 
      content={content}
      placement={placement}
      showArrow
      classNames={{
        base: 'max-w-[280px]',
        content: 'px-3 py-2 text-sm'
      }}
    >
      {children}
    </HeroUITooltip>
  )
}

