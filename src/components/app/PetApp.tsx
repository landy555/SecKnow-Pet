import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PetApi } from '../../hooks/usePet'
import type { PetSpecies } from '../../lib/types'
import Character from '../character/Character'
import Learning from './Learning'
import DebugPanel from './DebugPanel'
import { LESSONS } from '../../data/lessons'
import { ambientLine, feedLine, petLine, rewardLine } from '../../lib/dialogue'
import { nextStage } from '../../config/config'

export default function PetApp({ api, onHome }: { api: PetApi; onHome: () => void }) {
  const { state, derived, pet, feed, claim, finishLesson } = api
  const [line, setLine] = useState('')
  const [bounce, setBounce] = useState(0)
  const [active, setActive] = useState<(typeof LESSONS)[number] | null>(null)
  const [tab, setTab] = useState<'learn' | 'records'>('learn')

  useEffect(() => {
    setLine(ambientLine(state, derived))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived.expression, derived.justReturned])

  const nxt = useMemo(() => nextStage(state.xp), [state.xp])

  function doPet() {
    pet()
    setBounce((b) => b + 1)
    setLine(petLine())
  }
  function doFeed() {
    feed()
    setBounce((b) => b + 1)
    setLine(feedLine())
  }
  function doClaim(choice: PetSpecies | 'random') {
    const got = claim(choice)
    setBounce((b) => b + 1)
    const intro = got === 'owl' ? '一只小猫头鹰' : '一只小蝌蚪（长大就是青蛙啦）'
    setLine(choice === 'random' ? `盲盒开启！恭喜抽中${intro}，我一直期待和你见面。` : `欢迎${intro}！我一直期待和你见面。`)
  }

  return (
    <div className="grain min-h-[100svh] bg-cream pb-24">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button onClick={onHome} className="flex items-center gap-2 font-display font-extrabold">
            <span className="rounded-pill bg-white/70 px-2.5 py-1 text-sm">← 首页</span>
          </button>
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <span className="rounded-pill bg-lemon/25 px-3 py-1">Lv. {derived.stageName}</span>
            <span className="rounded-pill bg-forest/10 px-3 py-1 text-forest">{state.xp} XP</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {/* 宠物舞台 */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-b from-white/80 to-cream2/70 p-6 shadow-card sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lemon/20 blur-2xl" />
          <div className="relative flex flex-col items-center">
            {/* 对话气泡 */}
            <AnimatePresence mode="wait">
              <motion.div key={line} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4 max-w-sm rounded-2xl rounded-bl-md bg-white px-4 py-3 text-center text-sm font-bold text-ink shadow-soft">
                {line}
              </motion.div>
            </AnimatePresence>
            <motion.button
              key={bounce}
              onClick={doPet}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
              aria-label="抚摸宠物"
            >
              <Character stage={derived.stageId} expression={derived.expression} size={200} species={state.species} />
            </motion.button>
            <div className="mt-2 font-display text-xl font-extrabold">{state.name} · {derived.stageName}</div>

            {/* 成长进度 */}
            <div className="mt-4 w-full max-w-sm">
              <div className="flex justify-between text-xs font-extrabold text-inkSoft">
                <span>成长进度</span>
                <span>{nxt ? `距「${nxt.name}」还差 ${nxt.minXP - state.xp} XP` : '已成年 🎓'}</span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-pill bg-ink/10">
                <motion.div className="h-full rounded-pill bg-forest" animate={{ width: `${Math.round(derived.progress * 100)}%` }} />
              </div>
            </div>

            {/* 状态条 */}
            <div className="mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
              <Meter label="心情" value={state.mood} color="#E8853D" emoji="😊" />
              <Meter label="饱腹度" value={state.fullness} color="#1F6B3B" emoji="🍎" />
            </div>

            {/* 互动按钮 */}
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Action onClick={doPet}>🤚 抚摸</Action>
              <Action onClick={doFeed}>🍎 喂食</Action>
              <Action onClick={() => setLine(ambientLine(state, derived))}>💬 说说话</Action>
            </div>
          </div>
        </section>

        {/* 标签：学习 / 记录 */}
        <div className="mt-8 flex gap-2">
          <TabBtn active={tab === 'learn'} onClick={() => setTab('learn')}>知识点</TabBtn>
          <TabBtn active={tab === 'records'} onClick={() => setTab('records')}>学习记录 ({state.records.length})</TabBtn>
        </div>

        {tab === 'learn' ? (
          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            {LESSONS.map((l) => (
              <button key={l.id} onClick={() => setActive(l)} className="group flex items-center justify-between rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 text-left shadow-soft transition hover:-translate-y-0.5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-forest">{l.subject} · {l.minutes} 分钟</div>
                  <div className="mt-1 font-display text-lg font-extrabold">{l.title}</div>
                  <div className="mt-1 text-xs font-bold text-inkSoft">探究 → 阅读 → 测试</div>
                </div>
                <span className="rounded-pill bg-forest px-4 py-2 text-sm font-extrabold text-cream opacity-90 group-hover:opacity-100">开始</span>
              </button>
            ))}
          </section>
        ) : (
          <section className="mt-4 space-y-3">
            {state.records.length === 0 && <p className="rounded-2xl bg-white/60 p-6 text-center text-sm font-bold text-inkSoft">还没有学习记录，去学一个知识点吧～</p>}
            {state.records.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white/70 px-5 py-3.5">
                <div>
                  <div className="font-display font-extrabold">{r.title}</div>
                  <div className="text-xs font-bold text-inkSoft">{r.subject} · 答对 {r.correct}/{r.total} · {new Date(r.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className="rounded-pill bg-lemon/25 px-3 py-1 text-sm font-extrabold">+{r.xp}</span>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* 领取弹窗 */}
      <AnimatePresence>
        {!state.claimed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[65] grid place-items-center bg-ink/40 p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] bg-cream p-8 text-center shadow-card">
              <h2 className="font-display text-2xl font-extrabold">挑一只小伙伴吧！</h2>
              <p className="mt-2 text-sm font-semibold text-inkSoft">领养你的像素伙伴，认真学习就能孵出它、陪它长大。</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <ClaimCard label="猫头鹰" desc="博学的夜行者" onClick={() => doClaim('owl')}>
                  <Character species="owl" stage="baby" expression="happy" size={72} float={false} className="mx-auto" />
                </ClaimCard>
                <ClaimCard label="青蛙" desc="从蝌蚪长大" onClick={() => doClaim('frog')}>
                  <Character species="frog" stage="baby" expression="happy" size={72} float={false} className="mx-auto" />
                </ClaimCard>
                <ClaimCard label="盲盒" desc="随机惊喜？" onClick={() => doClaim('random')}>
                  <div className="relative mx-auto" style={{ width: 72 }}>
                    <Character stage="egg" expression="happy" size={72} float={false} />
                    <span className="absolute inset-0 grid place-items-center font-display text-3xl font-extrabold text-ink">?</span>
                  </div>
                </ClaimCard>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 学习流程 */}
      <AnimatePresence>
        {active && (
          <Learning
            lesson={active}
            onClose={() => setActive(null)}
            onFinish={(c, t) => {
              const res = finishLesson({ id: active.id, title: active.title, subject: active.subject }, c, t)
              setLine(rewardLine(res.gained, res.streakBonus))
              setBounce((b) => b + 1)
              return res
            }}
          />
        )}
      </AnimatePresence>

      <DebugPanel api={api} />
    </div>
  )
}

function Meter({ label, value, color, emoji }: { label: string; value: number; color: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <div className="flex justify-between text-xs font-extrabold text-inkSoft"><span>{emoji} {label}</span><span>{Math.round(value)}</span></div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-pill bg-ink/10">
        <motion.div className="h-full rounded-pill" style={{ background: color }} animate={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
const Action = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="btn bg-white/80 border border-ink/10 px-5 py-2.5 text-sm hover:bg-white hover:-translate-y-0.5">{children}</button>
)
const TabBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`rounded-pill px-5 py-2 text-sm font-extrabold transition ${active ? 'bg-forest text-cream' : 'bg-white/70 text-inkSoft'}`}>{children}</button>
)
const ClaimCard = ({ label, desc, onClick, children }: { label: string; desc: string; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="rounded-[1.5rem] border border-ink/10 bg-white/70 p-4 shadow-soft transition hover:-translate-y-0.5 hover:bg-white">
    <div className="grid h-24 place-items-center">{children}</div>
    <div className="mt-2 font-display text-sm font-extrabold">{label}</div>
    <div className="mt-0.5 text-xs font-bold text-inkSoft">{desc}</div>
  </button>
)