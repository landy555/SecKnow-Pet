import { motion } from 'framer-motion'

// 像素装饰：星星 / 加号 / 方块，呼应 Kizupi 首屏的漂浮像素元素
export function PixelStar({ className = '', color = '#F2B33D', size = 28 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 7 7" width={size} height={size} className={`pixelated ${className}`} shapeRendering="crispEdges">
      {[
        [3, 0], [3, 1], [2, 2], [3, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
        [2, 4], [3, 4], [4, 4], [3, 5], [3, 6],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  )
}

export function PixelPlus({ className = '', color = '#E8853D', size = 22 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 5 5" width={size} height={size} className={`pixelated ${className}`} shapeRendering="crispEdges">
      {[[2, 0], [2, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 3], [2, 4]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  )
}

export function Floaty({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}