import { useEffect, useState } from 'react'

export function useTypewriter(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompactMode, setIsCompactMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const compactQuery = window.matchMedia('(max-width: 767px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMode = () => {
      setIsCompactMode(compactQuery.matches || reducedMotionQuery.matches)
    }

    syncMode()
    compactQuery.addEventListener('change', syncMode)
    reducedMotionQuery.addEventListener('change', syncMode)

    return () => {
      compactQuery.removeEventListener('change', syncMode)
      reducedMotionQuery.removeEventListener('change', syncMode)
    }
  }, [])

  useEffect(() => {
    if (isCompactMode) {
      return
    }

    const phrase = phrases[phraseIndex] ?? ''
    const delay = isDeleting ? 40 : 90

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        const nextCursor = cursor + 1
        setCursor(nextCursor)

        if (nextCursor > phrase.length) {
          setIsDeleting(true)
        }
        return
      }

      const nextCursor = cursor - 1
      setCursor(nextCursor)

      if (nextCursor < 0) {
        setIsDeleting(false)
        setPhraseIndex((current) => (current + 1) % phrases.length)
      }
    }, cursor > (phrases[phraseIndex]?.length ?? 0) ? 1400 : delay)

    return () => window.clearTimeout(timer)
  }, [cursor, isCompactMode, isDeleting, phraseIndex, phrases])

  if (isCompactMode) {
    return phrases[0] ?? ''
  }

  return `${phrases[phraseIndex]?.slice(0, Math.max(cursor, 0)) ?? ''}`
}
