import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Expression, PetSpecies } from '../../lib/types'
import type { StageId } from '../../config/config'

const P = {
  O: '#E8853D', // 身体橙
  A: '#A9531C', // 翅膀 / 耳羽 深橙
  D: '#C96A26', // 描边深橙
  C: '#F7E8C9', // 肚皮 / 脸盘奶油
  W: '#FFFDF6', // 眼白
  K: '#2A2118', // 瞳孔 / 墨
  Y: '#F2B33D', // 喙 / 脚 柠檬
  B: '#F2A9A0', // 腮红
  G: '#58B85C', // 青蛙绿
  E: '#2E7D32', // 青蛙深绿描边
  L: '#A8D977', // 青蛙肚皮浅绿
  T: '#3B3A45', // 蝌蚪深色
  F: '#5A5868', // 蝌蚪尾巴浅色
}
type C = keyof typeof P

const OWL_BASE: string[] = [
  '...A............A...',
  '...AA..........AA...',
  '...AAA........AAA...',
  '...OOOOOOOOOOOOOO...',
  '..OCCCCCOOOOCCCCCO..',
  '..OCCCCCCOOCCCCCCO..',
  '..OCWWWCCOOCCWWWCO..',
  '..OCWWWCCOOCCWWWCO..',
  '..OCWWWCCOOCCWWWCO..',
  '..OCCCCCCYYCCCCCCO..',
  '..OCCCCCCYYCCCCCCO..',
  '..OOOOOOOOOOOOOOOO..',
  'AAOOOOCCCCCCCCOOOOAA',
  'AAOOOCCCCCCCCCCOOOAA',
  'AAOOCCCCCCCCCCCCOOAA',
  'AAOOCCCCCCCCCCCCOOAA',
  '..OOCCCCCCCCCCCCOO..',
  '..OOCCCCCCCCCCCCOO..',
  '..OOOOCCCCCCCCOOOO..',
  '..OOOOCCCCCCCCOOOO..',
  '...OOOOOOOOOOOOOO...',
  '......Y......Y......',
  '.....YY......YY.....',
  '....YYY......YYY....',
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

// 蝌蚪：圆脑袋 + 细长尾巴，深色小眼睛（不是小青蛙）。
const TADPOLE: string[] = [
  '..TTTTTTTT......',
  '.TWWWTWWWT......',
  '.TWKWTWKWT......',
  '.TWWWTWWWT......',
  '.TTTTTTTTTT.....',
  '.TTTTTTTTTTTF...',
  '..TTTTTTTTTTTFF.',
  '...TTTTTTT..TFF.',
  '.............FF.',
  '............FF..',
]

// 成年青蛙：绿色宽扁身体、鼓起的大眼、浅色肚皮、蹼足。
const FROG_ADULT: string[] = [
  '..EEE......EEE..',
  '.EWWWE....EWWWE.',
  '.EWKWE....EWKWE.',
  'EEGGGGEEEEGGGGEE',
  'EGGGGGGGGGGGGGGE',
  'EGGGGGGGGGGGGGGE',
  'EGGGLLLLLLLLGGGE',
  'EGGLLLLLLLLLLGGE',
  'EGGLLLLLLLLLLGGE',
  '.EGGLLLLLLLLGGE.',
  '..EGGGGGGGGGGE..',
  '.EEGGEEEEEEGGEE.',
  '.EGE........EGE.',
  'EEEE........EEEE',
]

interface Face {
  lx: number
  rx: number
  cy: number
  blush?: { x: number; y: number }[]
}

// 眼睛 / 腮红坐标（网格单位）
const OWL_FACE: Face = { lx: 5, rx: 14, cy: 7, blush: [{ x: 3, y: 9 }, { x: 16, y: 9 }] }
const FACE: Record<PetSpecies, Partial<Record<StageId, Face>>> = {
  owl: {
    baby: OWL_FACE,
    adult: OWL_FACE,
  },
  frog: {
    baby: { lx: 3, rx: 7, cy: 2, blush: [{ x: 2, y: 5 }, { x: 8, y: 5 }] },
    adult: { lx: 3, rx: 12, cy: 2, blush: [{ x: 2, y: 6 }, { x: 13, y: 6 }] },
  },
}

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

function Eyes({
  expression,
  px,
  face,
  blink = false,
  look = 0,
}: {
  expression: Expression
  px: number
  face: Face
  blink?: boolean
  look?: number
}) {
  const lx = face.lx * px
  const rx = face.rx * px
  const cy = face.cy * px
  const k = px
  const shift = {
    animate: { x: look * k },
    transition: { duration: 0.2, ease: 'easeOut' as const },
  }
  if (blink) {
    const closed = (cx: number, key: string) => <rect key={key} x={cx - k} y={cy} width={k * 3} height={k} fill={P.K} />
    return <motion.g {...shift}>{[closed(lx, 'l'), closed(rx, 'r')]}</motion.g>
  }
  if (expression === 'happy' || expression === 'excited') {
    // ^ ^ 弯眼
    const arc = (cx: number, key: string) => (
      <g key={key} fill={P.K}>
        <rect x={cx - k} y={cy} width={k} height={k} />
        <rect x={cx} y={cy - k} width={k} height={k} />
        <rect x={cx + k} y={cy} width={k} height={k} />
      </g>
    )
    return <motion.g {...shift}>{[arc(lx, 'l'), arc(rx, 'r')]}</motion.g>
  }
  if (expression === 'sleepy' || expression === 'missing') {
    const line = (cx: number, key: string) => <rect key={key} x={cx - k} y={cy} width={k * 3} height={k} fill={P.K} />
    return <motion.g {...shift}>{[line(lx, 'l'), line(rx, 'r')]}</motion.g>
  }
  // 默认 / 饥饿：圆瞳（饥饿时略下垂），look 让瞳孔在眼白内左右移动
  const dy = expression === 'hungry' ? k * 0.5 : 0
  return (
    <motion.g {...shift}>
      <rect x={lx} y={cy + dy} width={k} height={k} fill={P.K} />
      <rect x={rx} y={cy + dy} width={k} height={k} fill={P.K} />
    </motion.g>
  )
}

export interface CharacterProps {
  stage?: StageId
  expression?: Expression
  size?: number
  float?: boolean
  className?: string
  species?: PetSpecies
}

export default function Character({
  stage = 'adult',
  expression = 'happy',
  size = 240,
  float = true,
  className = '',
  species = 'owl',
}: CharacterProps) {
  const px = 12
  const isEgg = stage === 'egg'
  const animated = float && !isEgg
  const [blink, setBlink] = useState(false)
  const [look, setLook] = useState(0)

  useEffect(() => {
    if (!animated) {
      setBlink(false)
      setLook(0)
      return
    }
    let blinkOff: ReturnType<typeof setTimeout> | undefined
    const blinkTimer = setInterval(() => {
      setBlink(true)
      blinkOff = setTimeout(() => setBlink(false), 160)
    }, 3200)
    const lookTimer = setInterval(() => {
      setLook((v) => (v === 0 ? (Math.random() < 0.5 ? -1 : 1) : v === -1 ? 0 : Math.random() < 0.5 ? 1 : 0))
    }, 2400)
    return () => {
      clearInterval(blinkTimer)
      clearInterval(lookTimer)
      if (blinkOff) clearTimeout(blinkOff)
    }
  }, [animated])

  const rows = isEgg
    ? EGG
    : species === 'frog'
      ? stage === 'baby'
        ? TADPOLE
        : FROG_ADULT
      : OWL_BASE
  const cols = rows[0].length
  const w = cols * px
  const h = rows.length * px
  const scale = stage === 'baby' ? 0.86 : stage === 'adult' ? 1 : 0.8
  const face = FACE[species][stage] ?? FACE.owl.baby!
  const Inner = (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size * scale}
      height={(size * scale * h) / w}
      className="pixelated"
      shapeRendering="crispEdges"
    >
      <Pixels rows={rows} px={px} />
      {!isEgg && <Eyes expression={expression} px={px} face={face} blink={animated && blink} look={animated ? look : 0} />}
      {!isEgg && (expression === 'happy' || expression === 'excited') && face.blush?.map((b) => (
        <rect key={`${b.x}-${b.y}`} x={b.x * px} y={b.y * px} width={px} height={px} fill={P.B} />
      ))}
    </svg>
  )
  return (
    <motion.div
      className={className}
      animate={
        float
          ? {
              y: [0, 0, -22, -26, 0, 0],
              scaleX: [1, 1, 0.96, 1, 1.06, 1],
              scaleY: [1, 1, 1.05, 1, 0.94, 1],
            }
          : undefined
      }
      transition={
        float
          ? {
              duration: 1.5,
              times: [0, 0.15, 0.4, 0.55, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: 'easeInOut',
            }
          : undefined
      }
      style={{ lineHeight: 0, transformOrigin: 'bottom center' }}
    >
      {Inner}
    </motion.div>
  )
}