import type { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2',
    bottom: 'bottom-full left-1/2 -translate-x-1/2',
    left: 'left-full top-1/2 -translate-y-1/2',
    right: 'right-full top-1/2 -translate-y-1/2'
  }

  const arrowBorderClasses = {
    top: 'border-t-gray-800 dark:border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'border-b-gray-800 dark:border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
    left: 'border-l-gray-800 dark:border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent',
    right: 'border-r-gray-800 dark:border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent'
  }

  return (
    <div className="relative group flex items-center">
      {children}
      <div
        className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-sm text-white bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-normal`}
        style={{
          left: position === 'top' || position === 'bottom' 
            ? 'clamp(1rem, 50%, calc(100vw - 1rem))' 
            : undefined,
          right: position === 'left' ? '100%' : undefined,
          transform: position === 'top' || position === 'bottom' 
            ? 'translateX(clamp(calc(-50% + 1rem), -50%, calc(50% - 1rem)))' 
            : undefined,
          maxWidth: 'min(280px, calc(100vw - 2rem))',
          wordWrap: 'break-word',
          width: 'max-content'
        }}
        role="tooltip"
      >
        {content}
        <div
          className={`absolute w-0 h-0 border-4 ${arrowClasses[position]} ${arrowBorderClasses[position]}`}
        />
      </div>
    </div>
  )
}

