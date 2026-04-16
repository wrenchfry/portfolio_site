import { useEffect, useState } from 'react'

export function useBootSequence(messages: string[]) {
  const [lines, setLines] = useState<string[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timers: number[] = []

    messages.forEach((message, index) => {
      timers.push(
        window.setTimeout(() => {
          setLines((current) => [...current, message])
        }, index * 260),
      )
    })

    timers.push(
      window.setTimeout(
        () => {
          setVisible(false)
        },
        messages.length * 260 + 900,
      ),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [messages])

  return { lines, visible }
}
