import { useEffect, useState } from 'react'

export function useTypewriter(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
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
  }, [cursor, isDeleting, phraseIndex, phrases])

  return `${phrases[phraseIndex]?.slice(0, Math.max(cursor, 0)) ?? ''}`
}
