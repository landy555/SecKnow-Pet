import { motion } from 'framer-motion'
import type { Expression } from '../../lib/types'
import type { StageId } from '../../config/config'

// Kizupi 的像素猫头鹰 —— 用像素网格忠实重建，保持一致的轮廓 / 配色 / 五官。
const P = {
  O: '#E8853D', // 身体橙
  D: '#C96A26', // 描边深橙
  C: '#F7E8C9', // 肚皮 / 脸盘奶油
  W: '#FFFDF6', // 眼白
  K: '#2A2118', // 瞳孔 / 墨
  Y: '#F2B33D', // 喙 / 脚 柠檬
  B: '#F2A9A0', // 腮红
}
type C = keyof typeof P

const BODY: string[] = [
  '..DD........DD..',
  '..DOOD....DOOD..',
  '..DOOODDDDOOOOD.',
  '.DOOOOOOOOOOOOD.',
  '.DOOOOOOOOOOOOD.',
  'DOOWWWOOOOWWWOOD',
  'DOWWWWOOOOWWWWOD',
  'DOWWKWOOOOWKWWOD',
  'DOWWWWOOOOWWWWOD',
  'DOOWWOOYYOOWWOOD',
  'DOOOOOYYYYOOOOOD',
  'DOOCCOOOOOOCCOOD',
  'DOCCCCCCCCCCCOOD',
  '.DOCCCCCCCCCOOD.',
  '.DOOCCCCCCCOOOD.',
  '..DDOOOOOOOODD..',
  '...YY......YY...',
]

const EGG: string[] = [
  '.....DDDDDD.....',
  '...DDCCCCCCDD...',
  '..DCCCCCCCCCCD..',
  '.DCCCCCCCCCCCCD.',
  '.DCCOCCCCCCOCCD.',
  'DCCCCCOCCOCCCCCD',
  'DCCCCCCCCCCCCCD.',
  'DCCOCCCCCCCOCCD.',
  'DCCCCCCCCCCCCCD.',
  '.DCCCCCCCCCCCCD.',
  '.DCCCOCCCCOCCCD.',
  '..DCCCCCCCCCCD..',
  '...DDCCCCCCDD...',
  '.....DDDDDD.....',
]

function Pixels({ rows, px }: { rows: string[]; px: number }) {
  const rects: JSX.Element[] = []
  rows.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      if (ch === '.') return
      const fill = P[ch as C]
      if (!fill) return
      rects.push(<rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={fill} />)
    })
  })
  return <>{rects}</>
}

function Eyes({ expression, px }: { expression: Expression; px: number }) {
  // 眼睛中心（网格坐标）
  const lx = 4 * px
  const rx = 12 * px
  const cy = 7 * px
  const k = px
  if (expression === 'happy' || expression === 'excited') {
    // ^ ^ 弯眼
    const arc = (cx: number) => (
      <g fill={P.K}>
        <rect x={cx - k} y={cy} width={k} height={k} />
        <rect x={cx} y={cy - k} width={k} height={k} />
        <rect x={cx + k} y={cy} width={k} height={k} />
      </g>
    )
    return (
      <>
        {arc(lx)}
        {arc(rx)}
      </>
    )
  }
  if (expression === 'sleepy' || expression === 'missing') {
    const line = (cx: number) => <rect x={cx - k} y={cy} width={k * 3} height={k} fill={P.K} />
    return (
      <>
        {line(lx)}
        {line(rx)}
      </>
    )
  }
  // 默认 / 饥饿：圆瞳（饥饿时略下垂）
  const dy = expression === 'hungry' ? k * 0.5 : 0
  return (
    <>
      <rect x={lx} y={cy + dy} width={k} height={k} fill={P.K} />
      <rect x={rx} y={cy + dy} width={k} height={k} fill={P.K} />
    </>
  )
}

export interface CharacterProps {
  stage?: StageId
  expression?: Expression
  size?: number
  float?: boolean
  className?: string
}

export default function Character({
  stage = 'adult',
  expression = 'happy',
  size = 240,
  float = true,
  className = '',
}: CharacterProps) {
  const px = 12
  const isEgg = stage === 'egg'
  const rows = isEgg ? EGG : BODY
  const w = 16 * px
  const h = rows.length * px
  const scale = stage === 'baby' ? 0.86 : stage === 'adult' ? 1 : 0.8
  const Inner = (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size * scale}
      height={(size * scale * h) / w}
      className="pixelated"
      shapeRendering="crispEdges"
    >
      <Pixels rows={rows} px={px} />
      {!isEgg && <Eyes expression={expression} px={px} />}
      {!isEgg && (expression === 'happy' || expression === 'excited') && (
        <>
          <rect x={2 * px} y={11 * px} width={px} height={px} fill={P.B} />
          <rect x={13 * px} y={11 * px} width={px} height={px} fill={P.B} />
        </>
      )}
      {/* 成年装饰：小小学士帽像素 */}
      {stage === 'adult' && (
        <g>
          <rect x={5 * px} y={-1 * px} width={6 * px} height={px} fill={P.K} />
          <rect x={7 * px} y={-2 * px} width={2 * px} height={px} fill={P.K} />
          <rect x={10 * px} y={0} width={px} height={px} fill={P.Y} />
        </g>
      )}
    </svg>
  )
  return (
    <motion.div
      className={className}
      animate={float ? { y: [0, -10, 0] } : undefined}
      transition={float ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
      style={{ lineHeight: 0 }}
    >
      {Inner}
    </motion.div>
  )
}