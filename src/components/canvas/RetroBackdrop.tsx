import { useEffect, useRef } from 'react'

const CODE = '{}[]()<>/\\\\#@$!;:=+*%^&|~?01アイウエオ∑∆∇∂∫⊕≠≈'
const FLOATING_SNIPPETS = [
  'git commit -m',
  'npm run dev',
  'fetch(/api)',
  'python bot.py',
  'motion.div',
  'SELECT * FROM',
]

interface Drop {
  y: number
  speed: number
  opacity: number
}

interface NodePoint {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulse: number
  color: string
}

export function RetroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return
    }

    let animationFrame = 0
    let frame = 0
    let drops: Drop[] = []
    let nodes: NodePoint[] = []
    let compactMode = false

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      compactMode =
        window.innerWidth < 900 ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      drops = Array.from({ length: Math.floor(canvas.width / (compactMode ? 42 : 20)) }, () => ({
        y: Math.random() * canvas.height,
        speed: compactMode ? 0.45 + Math.random() * 0.7 : 1 + Math.random() * 2,
        opacity: compactMode ? 0.04 + Math.random() * 0.08 : 0.08 + Math.random() * 0.2,
      }))

      nodes = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / (compactMode ? 95000 : 28000)) },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (compactMode ? 0.16 : 0.4),
          vy: (Math.random() - 0.5) * (compactMode ? 0.16 : 0.4),
          radius: compactMode ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? '0, 212, 255' : '0, 255, 136',
        }),
      )
    }

    const renderStatic = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = 'rgba(6, 6, 15, 0.92)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index]
        const next = nodes[index + 1]
        context.fillStyle = `rgba(${node.color}, 0.18)`
        context.beginPath()
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        context.fill()

        if (!next) {
          continue
        }

        context.strokeStyle = `rgba(${node.color}, 0.08)`
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(node.x, node.y)
        context.lineTo(next.x, next.y)
        context.stroke()
      }
    }

    const render = () => {
      frame += 1
      context.fillStyle = 'rgba(6, 6, 15, 0.2)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.font = '13px monospace'

      drops.forEach((drop, index) => {
        context.fillStyle = `rgba(0, 255, 136, ${drop.opacity})`
        context.fillText(
          CODE[Math.floor(Math.random() * CODE.length)] ?? '',
          index * 20,
          drop.y,
        )
        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = 0
        }
      })

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index]
        node.x += node.vx
        node.y += node.vy
        node.pulse += compactMode ? 0.018 : 0.03

        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1
        }

        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1
        }

        const glow = Math.sin(node.pulse) * 0.5 + 0.5

        for (let peerIndex = index + 1; peerIndex < nodes.length; peerIndex += 1) {
          const peer = nodes[peerIndex]
          const dx = node.x - peer.x
          const dy = node.y - peer.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < (compactMode ? 86 : 140)) {
            context.strokeStyle = `rgba(${node.color}, ${(1 - distance / (compactMode ? 86 : 140)) * (compactMode ? 0.08 : 0.12) * glow})`
            context.lineWidth = 0.7
            context.beginPath()
            context.moveTo(node.x, node.y)
            context.lineTo(peer.x, peer.y)
            context.stroke()
          }
        }

        context.fillStyle = `rgba(${node.color}, ${0.22 + glow * 0.3})`
        context.beginPath()
        context.arc(node.x, node.y, node.radius + glow * 1.5, 0, Math.PI * 2)
        context.fill()
      }

      if (!compactMode && frame % 220 === 0) {
        context.fillStyle = 'rgba(191, 0, 255, 0.12)'
        context.font = '12px monospace'
        context.fillText(
          FLOATING_SNIPPETS[Math.floor(Math.random() * FLOATING_SNIPPETS.length)] ?? '',
          Math.random() * (canvas.width - 140),
          Math.random() * canvas.height,
        )
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    if (compactMode) {
      renderStatic()
    } else {
      render()
    }

    const onResize = () => {
      resize()
      if (compactMode) {
        renderStatic()
      }
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full opacity-60"
      ref={canvasRef}
    />
  )
}
