import { useState } from 'react'
import type { PetApi } from '../../hooks/usePet'

export default function DebugPanel({ api }: { api: PetApi }) {
  const [open, setOpen] = useState(false)
  const { state, derived, debug } = api
  return (
    <div className="fixed bottom-4 left-4 z-[70]">
      <button onClick={() => setOpen((v) => !v)} className="rounded-pill bg-ink px-4 py-2 text-xs font-extrabold text-cream shadow-soft">
        {open ? '关闭调试' : '🛠 调试面板'}
      </button>
      {open && (
        <div className="mt-2 w-72 rounded-2xl border border-ink/15 bg-cream p-4 text-xs shadow-card">
          <div className="grid grid-cols-2 gap-2 font-bold">
            <Stat label="经验" v={state.xp} />
            <Stat label="阶段" v={derived.stageName} />
            <Stat label="心情" v={Math.round(state.mood)} />
            <Stat label="饱腹" v={Math.round(state.fullness)} />
            <Stat label="连续" v={state.streak} />
            <Stat label="离开(h)" v={derived.hoursAway.toFixed(1)} />
          </div>
          <div className="mt-3 space-y-2">
            <Row>
              <Btn onClick={() => debug.addXP(50)}>+50 经验</Btn>
              <Btn onClick={() => debug.addXP(200)}>+200 经验</Btn>
            </Row>
            <Row>
              <Btn onClick={() => debug.setMood(95)}>心情↑</Btn>
              <Btn onClick={() => debug.setMood(20)}>心情↓</Btn>
              <Btn onClick={() => debug.setFullness(20)}>饥饿</Btn>
            </Row>
            <Row>
              <Btn onClick={() => debug.simulateAway(24)}>离开24h</Btn>
              <Btn onClick={() => debug.simulateAway(72)}>离开72h</Btn>
            </Row>
            <Row>
              <Btn onClick={() => debug.simulateAnswer(true)}>模拟答对</Btn>
              <Btn onClick={() => debug.simulateAnswer(false)}>模拟答错</Btn>
            </Row>
            <button onClick={debug.reset} className="w-full rounded-pill bg-blush px-3 py-2 font-extrabold text-white">重置全部数据</button>
          </div>
        </div>
      )}
    </div>
  )
}
const Stat = ({ label, v }: { label: string; v: string | number }) => (
  <div className="rounded-xl bg-white/70 px-2.5 py-1.5"><span className="text-inkSoft">{label}</span><div className="font-display text-sm font-extrabold">{v}</div></div>
)
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex gap-1.5">{children}</div>
const Btn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="flex-1 rounded-pill bg-white/80 border border-ink/10 px-2 py-1.5 font-bold hover:bg-white">{children}</button>
)