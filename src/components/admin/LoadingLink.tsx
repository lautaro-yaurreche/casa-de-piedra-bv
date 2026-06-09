'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Reset loading when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (onClick) {
      onClick()
    }

    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {children}
        </div>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </Link>
  )
}
