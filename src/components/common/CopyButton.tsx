import { useState } from 'react'
import { Button } from '@heroui/react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export const CopyButton = ({ text, className = '', size = 'sm' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <Button
      isIconOnly
      variant="light"
      size={size}
      onPress={handleCopy}
      className={className}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <svg className={`${iconSize} text-green-600 dark:text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={`${iconSize} text-gray-500 dark:text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </Button>
  )
}

