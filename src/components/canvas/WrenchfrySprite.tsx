import { useEffect, useRef } from 'react'
import { SPRITE_HEIGHT, SPRITE_WIDTH, drawWrenchfry } from '../../lib/drawWrenchfry'

interface WrenchfrySpriteProps {
  scale: number
  className?: string
  interactive?: boolean
}

export function WrenchfrySprite({
  scale,
  className,
  interactive = true,
}: WrenchfrySpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return
    }

    let animationFrame = 0
    let spillFrame = 0
    let walkTimer = 0
    let bounceDirection = -1
    let bounceValue = 0
    let walking = false
    let scrollTimeout = 0
    const canAnimate =
      interactive &&
      window.innerWidth >= 1024 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = () => {
      if (walking) {
        walkTimer += 1
        bounceValue += bounceDirection * 0.9

        if (bounceValue <= -4) {
          bounceDirection = 1
        }

        if (bounceValue >= 0) {
          bounceDirection = -1
        }

        spillFrame = walkTimer % 16 < 8 ? 1 : 2
      } else {
        bounceValue *= 0.8
        spillFrame = Math.max(0, spillFrame - 1)
        walkTimer = 0
      }

      drawWrenchfry(context, scale, Math.round(bounceValue), spillFrame)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const onScroll = () => {
      if (!canAnimate) {
        return
      }

      walking = true
      window.clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        walking = false
      }, 360)
    }

    drawWrenchfry(context, scale, 0, 0)
    if (!canAnimate) {
      return
    }

    animate()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', onScroll)
    }
  }, [interactive, scale])

  return (
    <canvas
      className={`pixel-canvas ${className ?? ''}`}
      height={SPRITE_HEIGHT * scale}
      ref={canvasRef}
      width={SPRITE_WIDTH * scale}
    />
  )
}
