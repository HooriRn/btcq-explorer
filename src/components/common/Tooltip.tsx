import { type ReactNode } from 'react'
import { Tooltip as HeroUITooltip } from '@heroui/react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  // Map position to HeroUI's placement prop
  const placement = position as 'top' | 'bottom' | 'left' | 'right'

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

