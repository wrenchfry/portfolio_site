const FY = '#f5c842'
const FYH = '#ffe87a'
const FYD = '#c9960a'
const FYB = '#a06c00'
const RED = '#cc0008'
const RED_HIGHLIGHT = '#ff3333'
const RED_SHADOW = '#880005'
const MUSTACHE = '#111111'
const CUP = '#d4763b'
const CUP_HIGHLIGHT = '#e8904a'
const CUP_RIM = '#f5f5f5'
const COFFEE = '#3d1a00'
const COFFEE_LIGHT = '#6b3200'
const STEAM = 'rgba(230,230,200,0.7)'

export const SPRITE_WIDTH = 28
export const SPRITE_HEIGHT = 42

export function drawWrenchfry(
  context: CanvasRenderingContext2D,
  scale: number,
  beretOffset = 0,
  spillFrame = 0,
) {
  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, context.canvas.width, context.canvas.height)

  const pixel = (x: number, y: number, color: string, width = 1, height = 1) => {
    context.fillStyle = color
    context.fillRect(x * scale, y * scale, width * scale, height * scale)
  }

  const bY = beretOffset

  pixel(10, 0 + bY, RED_HIGHLIGHT, 2, 1)
  pixel(8, 1 + bY, RED, 8, 1)
  pixel(9, 1 + bY, RED_HIGHLIGHT, 4, 1)
  pixel(7, 2 + bY, RED, 10, 1)
  pixel(9, 2 + bY, RED_HIGHLIGHT, 4, 1)
  pixel(7, 3 + bY, RED, 10, 1)
  pixel(8, 3 + bY, RED_HIGHLIGHT, 3, 1)
  pixel(8, 4 + bY, RED, 8, 1)
  pixel(9, 5 + bY, RED_SHADOW, 6, 1)

  const bodyX = 10
  for (let y = 7; y <= 22; y += 1) {
    pixel(bodyX, y, FYD)
    pixel(bodyX + 1, y, FYH, 2, 1)
    pixel(bodyX + 3, y, FY)
    pixel(bodyX + 4, y, FYD)
  }

  for (let y = 23; y <= 38; y += 1) {
    const shift = Math.floor((y - 23) / 5)
    pixel(bodyX + shift, y, FYD)
    pixel(bodyX + shift + 1, y, FYH, 2, 1)
    pixel(bodyX + shift + 3, y, FY)
    pixel(bodyX + shift + 4, y, FYD)
  }

  pixel(13, 39, FYB, 3, 1)
  pixel(13, 40, FYB, 2, 1)
  pixel(14, 41, FYB, 1, 1)

  const mustacheY = 15
  const mustacheX = 10

  pixel(mustacheX + 2, mustacheY - 4, MUSTACHE)
  pixel(mustacheX + 1, mustacheY - 3, MUSTACHE)
  pixel(mustacheX + 3, mustacheY - 3, MUSTACHE)
  pixel(mustacheX, mustacheY - 2, MUSTACHE)
  pixel(mustacheX + 4, mustacheY - 2, MUSTACHE)
  pixel(mustacheX - 1, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX + 4, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX - 3, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX - 5, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX - 6, mustacheY - 2, MUSTACHE, 2, 1)
  pixel(mustacheX - 7, mustacheY - 3, MUSTACHE)
  pixel(mustacheX - 7, mustacheY - 4, MUSTACHE)
  pixel(mustacheX - 6, mustacheY - 5, MUSTACHE, 2, 1)
  pixel(mustacheX - 5, mustacheY - 6, MUSTACHE)
  pixel(mustacheX + 6, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX + 8, mustacheY - 1, MUSTACHE, 2, 1)
  pixel(mustacheX + 9, mustacheY - 2, MUSTACHE, 2, 1)
  pixel(mustacheX + 10, mustacheY - 3, MUSTACHE)
  pixel(mustacheX + 10, mustacheY - 4, MUSTACHE)
  pixel(mustacheX + 9, mustacheY - 5, MUSTACHE, 2, 1)
  pixel(mustacheX + 8, mustacheY - 6, MUSTACHE)

  const cupX = 17
  const cupY = 10

  if (spillFrame === 0) {
    context.globalAlpha = 0.7
    pixel(cupX + 1, cupY - 3, STEAM)
    pixel(cupX + 3, cupY - 4, STEAM)
    pixel(cupX + 2, cupY - 5, STEAM)
    context.globalAlpha = 1
  }

  pixel(cupX, cupY, CUP, 5, 6)
  pixel(cupX + 1, cupY, CUP_HIGHLIGHT, 2, 3)
  pixel(cupX, cupY, COFFEE, 5, 1)
  pixel(cupX + 1, cupY, COFFEE_LIGHT, 2, 1)
  pixel(cupX - 1, cupY - 1, CUP_RIM, 7, 1)
  pixel(cupX - 1, cupY + 6, CUP, 7, 1)
  pixel(cupX + 5, cupY + 1, CUP, 2, 1)
  pixel(cupX + 6, cupY + 1, CUP, 1, 3)
  pixel(cupX + 5, cupY + 4, CUP, 2, 1)

  if (spillFrame > 0) {
    const tilt = spillFrame > 1 ? 2 : 1

    // Coffee physics remain intentionally dramatic.
    pixel(cupX + 5, cupY + tilt, COFFEE)
    pixel(cupX + 6, cupY + tilt - 1, COFFEE, 2, 1)
    pixel(cupX + 7, cupY + tilt - 2, COFFEE)
    pixel(cupX + 8, cupY + tilt - 2, COFFEE)
    pixel(cupX + 6, cupY + 4, COFFEE, 1, 2)
    pixel(cupX + 8, cupY + 3, COFFEE, 1, 3)

    if (spillFrame > 1) {
      pixel(cupX + 9, cupY + 2, COFFEE, 1, 4)
      pixel(cupX + 10, cupY + 1, COFFEE, 1, 2)
      pixel(cupX + 7, cupY + 6, COFFEE, 2, 1)
    }
  }
}
