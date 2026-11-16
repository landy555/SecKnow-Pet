import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Lesson } from '../../data/lessons'
import { wrongLine } from '../../lib/dialogue'

type Phase = 'explore' | 'read' | 'quiz' | 'result'

export default function Learning({
  lesson,
  onFinish,
  onClose,
}: {
  lesson: Lesson
  onFinish: (correct: number, total: number) => { gained: number; streakBonus: boolean }
  onClose: () => void
}) {
  const [phase, setPhase] = useState<Phase>('explore')
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [result, setResult] = useState<{ gained: number; streakBonus: boolean } | null>(null)
  const [encourage, setEncourage] = useState('')

  const q = lesson.quiz[qi]

  function choose(i: number) {
    if (picked !== null) return
    setPicked(i)
    const ok = i === q.answer
    if (ok) setCorrect((c) => c + 1)
    else setEncourage(wrongLine())
  }
  function next() {
    if (qi + 1 < lesson.quiz.length) {
      setQi(qi + 1)
      setPicked(null)
      setEncourage('')
    } else {
      const total = lesson.quiz.length
      const finalCorrect = correct
      setResult(onFinish(finalCorrect, total))
      setPhase('result')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] bg-cream shadow-card sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-forest">{lesson.subject} · {lesson.minutes} 分钟</div>
            <div className="font-display text-lg font-extrabold">{lesson.title}</div>
          </div>
          <button onClick={onClose} className="rounded-pill bg-white/70 p-2 font-bold">✕</button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {(['explore', 'read', 'quiz'] as Phase[]).map((p) => (
            <div key={p} className={`h-1.5 flex-1 rounded-pill ${phase === p || (phase === 'result') ? 'bg-forest' : done(p, phase) ? 'bg-forest/50' : 'bg-ink/10'}`} />
          ))}
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">
            {phase === 'explore' && (
              <Step key="e" title="探究">
                <p className="text-sm font-semibold text-inkSoft">{lesson.explore}</p>
                <button onClick={() => setPhase('read')} className="btn btn-primary mt-5 w-full">我想好了，开始阅读 →</button>
              </Step>
            )}
            {phase === 'read' && (
              <Step key="r" title="阅读">
                <ul className="space-y-3">
                  {lesson.read.map((r, i) => (
                    <li key={i} className="rounded-2xl bg-white/70 p-4 text-sm font-semibold text-ink border border-ink/5">{r}</li>
                  ))}
                </ul>
                <button onClick={() => setPhase('quiz')} className="btn btn-primary mt-5 w-full">读懂了，去测试 →</button>
              </Step>
            )}
            {phase === 'quiz' && (
              <Step key={`q${qi}`} title={`测试 ${qi + 1}/${lesson.quiz.length}`}>
                <p className="font-display text-base font-extrabold">{q.q}</p>
                <div className="mt-4 space-y-2.5">
                  {q.options.map((o, i) => {
                    const isPicked = picked === i
                    const isAnswer = i === q.answer
                    let cls = 'bg-white/70 border-ink/10'
                    if (picked !== null && isAnswer) cls = 'bg-forest/15 border-forest'
                    else if (isPicked && !isAnswer) cls = 'bg-blush/15 border-blush'
                    return (
                      <button key={i} onClick={() => choose(i)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${cls}`}>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-cream2 text-xs font-extrabold">{String.fromCharCode(65 + i)}</span>
                        {o}
                      </button>
                    )
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-4">
                    {picked !== q.answer && <p className="mb-3 rounded-2xl bg-lemon/20 px-4 py-2.5 text-sm font-bold text-ink">{encourage}</p>}
                    <button onClick={next} className="btn btn-primary w-full">{qi + 1 < lesson.quiz.length ? '下一题 →' : '提交，看看奖励 →'}</button>
                  </div>
                )}
              </Step>
            )}
            {phase === 'result' && result && (
              <Step key="res" title="完成啦！">
                <div className="rounded-[1.5rem] bg-forest/10 p-6 text-center">
                  <div className="font-display text-5xl font-extrabold text-forest">+{result.gained}</div>
                  <div className="mt-1 text-sm font-extrabold text-inkSoft">经验值</div>
                  <p className="mt-3 text-sm font-bold">答对 {correct}/{lesson.quiz.length} 题{result.streakBonus ? ' · 连续学习额外奖励！' : ''}</p>
                  <p className="mt-2 text-sm font-semibold text-inkSoft">答错也没关系，思考的过程最珍贵。小伙伴又长大了一点点～</p>
                </div>
                <button onClick={onClose} className="btn btn-primary mt-5 w-full">回到小伙伴身边</button>
              </Step>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function done(p: Phase, cur: Phase) {
  const order = ['explore', 'read', 'quiz', 'result']
  return order.indexOf(p) < order.indexOf(cur)
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
      <div className="mb-3 inline-flex rounded-pill bg-lemon/25 px-3 py-1 text-xs font-extrabold text-ink">{title}</div>
      {children}
    </motion.div>
  )
}