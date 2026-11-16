import { motion } from 'framer-motion'
import Character from '../character/Character'
import Nav from './Nav'
import { Floaty, PixelPlus, PixelStar } from './PixelDecor'
import { LESSONS, SUBJECTS } from '../../data/lessons'
import { useState } from 'react'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-forest border border-forest/15">
      <PixelPlus size={12} color="#1F6B3B" /> {children}
    </span>
  )
}

export default function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div id="top" className="grain relative overflow-x-clip">
      <Nav onEnter={onEnter} />
      <Hero onEnter={onEnter} />
      <Product />
      <How />
      <Features />
      <PetShowcase onEnter={onEnter} />
      <Faq />
      <CtaFooter onEnter={onEnter} />
    </div>
  )
}

function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-lemon/20 blur-3xl" />
      </div>
      <Floaty className="left-[12%] top-[24%]" delay={0.4}><PixelStar color="#F2B33D" size={30} /></Floaty>
      <Floaty className="right-[14%] top-[22%]" delay={1.2}><PixelPlus color="#E8853D" size={26} /></Floaty>
      <Floaty className="left-[18%] bottom-[20%]" delay={0.8}><PixelPlus color="#7FB7D6" size={22} /></Floaty>
      <Floaty className="right-[16%] bottom-[26%]" delay={1.6}><PixelStar color="#E8853D" size={24} /></Floaty>

      <div className="section relative z-10 flex flex-col items-center text-center">
        <motion.div {...reveal}>
          <Eyebrow>AI + 教育 · 学习陪伴</Eyebrow>
        </motion.div>
        <motion.div {...reveal} className="mt-6">
          <Character stage="adult" expression="happy" size={168} />
        </motion.div>
        <motion.h1
          {...reveal}
          className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl"
        >
          学习的路上，
          <br className="hidden sm:block" />
          有我陪你一起<span className="text-owl">长大</span>
        </motion.h1>
        <motion.p {...reveal} className="mt-5 max-w-xl text-base font-semibold text-inkSoft sm:text-lg">
          每一次认真学习，都让我们的小伙伴变得更快乐、更强大。
          速知把每个知识点变成 10 分钟的小探险。
        </motion.p>
        <motion.div {...reveal} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button onClick={onEnter} className="btn btn-primary text-base">
            领取我的小伙伴 →
          </button>
          <a href="#how" className="btn btn-ghost text-base">看看怎么学</a>
        </motion.div>
        <motion.div {...reveal} className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-inkSoft">
          {SUBJECTS.slice(0, 6).map((s) => (
            <span key={s} className="rounded-pill bg-white/60 px-3 py-1 border border-ink/5">{s}</span>
          ))}
          <span className="rounded-pill bg-white/60 px-3 py-1 border border-ink/5">…等</span>
        </motion.div>
      </div>
    </section>
  )
}

function Product() {
  return (
    <section id="product" className="section py-20 sm:py-28">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <Eyebrow>产品一瞥</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">会追问「为什么」的学习伙伴</h2>
        <p className="mt-3 font-semibold text-inkSoft">小知不急着给答案，它先听你说，再问「你是怎么知道的？」</p>
      </motion.div>
      <motion.div {...reveal} className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-ink/10 bg-white/70 p-5 shadow-card sm:p-8">
        <div className="flex items-center gap-3 border-b border-ink/5 pb-4">
          <Character stage="baby" expression="happy" size={44} float={false} />
          <div>
            <div className="font-display font-extrabold">小知 · 数学</div>
            <div className="text-xs font-bold text-forest">● 在线陪你学习</div>
          </div>
        </div>
        <div className="space-y-3 pt-5">
          <Bubble side="pet">把蛋糕平均分给 4 个人，每人拿到多少呀？</Bubble>
          <Bubble side="me">1/4！</Bubble>
          <Bubble side="pet">答对啦～那你是怎么知道是 1/4 的呢？</Bubble>
          <Bubble side="me">因为平均分成了 4 份，取 1 份。</Bubble>
          <Bubble side="pet">太棒了！你不仅答对，还想清楚了道理 🎉 +22 经验</Bubble>
        </div>
      </motion.div>
    </section>
  )
}

function Bubble({ side, children }: { side: 'pet' | 'me'; children: React.ReactNode }) {
  const me = side === 'me'
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-semibold ${me ? 'bg-forest text-cream rounded-br-md' : 'bg-cream2 text-ink rounded-bl-md'}`}>
        {children}
      </div>
    </div>
  )
}

function How() {
  const steps = [
    { n: '01', t: '探究', d: '从一个生活小问题出发，先猜一猜、想一想，激活好奇心。', c: '#E8853D' },
    { n: '02', t: '阅读', d: '用简短清晰的卡片读懂知识点，图文并茂，10 分钟刚刚好。', c: '#1F6B3B' },
    { n: '03', t: '测试', d: '几道选择题检验理解，答对答错都有鼓励，伙伴一起成长。', c: '#F2B33D' },
  ]
  return (
    <section id="how" className="section py-20 sm:py-28">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <Eyebrow>学习流程</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">每个知识点，10 分钟三步走</h2>
      </motion.div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div key={s.n} {...reveal} transition={{ duration: 0.5, delay: i * 0.1 }} className="rounded-[1.75rem] border border-ink/10 bg-white/70 p-7 shadow-soft">
            <div className="font-display text-4xl font-extrabold" style={{ color: s.c }}>{s.n}</div>
            <div className="mt-3 font-display text-xl font-extrabold">{s.t}</div>
            <p className="mt-2 text-sm font-semibold text-inkSoft">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const feats = [
    { t: '宠物成长系统', d: '蛋 → 幼年 → 成年，经验累积看得见，认真学习就有正向反馈。', e: 'excited' as const },
    { t: '真实心情状态', d: '心情与饱腹度随时间变化，饿了会撒娇，久了会想你——但绝不惩罚。', e: 'hungry' as const },
    { t: '温暖的对话', d: '没有制造焦虑的语言，只有陪伴、鼓励与「欢迎回来」。', e: 'happy' as const },
    { t: '多学科覆盖', d: '语数英科信，还有心理健康、财商、逻辑与法律等泛学科。', e: 'neutral' as const },
  ]
  return (
    <section id="features" className="section py-20 sm:py-28">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <Eyebrow>产品特色</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">不是刷题工具，是学习伙伴</h2>
      </motion.div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {feats.map((f, i) => (
          <motion.div key={f.t} {...reveal} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex items-start gap-4 rounded-[1.75rem] border border-ink/10 bg-white/70 p-6 shadow-soft">
            <div className="shrink-0 rounded-2xl bg-cream2 p-2">
              <Character stage="adult" expression={f.e} size={64} float={false} />
            </div>
            <div>
              <div className="font-display text-lg font-extrabold">{f.t}</div>
              <p className="mt-1.5 text-sm font-semibold text-inkSoft">{f.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function PetShowcase({ onEnter }: { onEnter: () => void }) {
  const stages = [
    { id: 'egg' as const, name: '蛋', d: '刚刚相遇，充满可能' },
    { id: 'baby' as const, name: '幼年', d: '一起学习，慢慢长大' },
    { id: 'adult' as const, name: '成年', d: '博学的小伙伴，为你骄傲' },
  ]
  return (
    <section id="pet" className="section py-20 sm:py-28">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <Eyebrow>认识小伙伴</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">你越认真，它越快乐</h2>
        <p className="mt-3 font-semibold text-inkSoft">小知是一只像素猫头鹰，会随你的学习一点点成长。</p>
      </motion.div>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {stages.map((s, i) => (
          <motion.div key={s.id} {...reveal} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex flex-col items-center rounded-[1.75rem] border border-ink/10 bg-gradient-to-b from-white/80 to-cream2/60 p-8 shadow-soft">
            <div className="flex h-40 items-end">
              <Character stage={s.id} expression="happy" size={s.id === 'egg' ? 120 : 150} />
            </div>
            <div className="mt-4 font-display text-xl font-extrabold">{s.name}</div>
            <p className="mt-1 text-sm font-semibold text-inkSoft">{s.d}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button onClick={onEnter} className="btn btn-primary text-base">领取我的小伙伴 →</button>
      </div>
    </section>
  )
}

function Faq() {
  const items = [
    { q: '速知适合多大的孩子？', a: '面向中小学生，内容按学科与认知水平编排，泛学科内容也适合亲子共学。' },
    { q: '宠物会不会因为我没学习而「死掉」？', a: '不会。心情和饱腹度会随时间下降，但有下限，绝不死亡、退化或惩罚。它只会想你，并在你回来时热烈欢迎。' },
    { q: '一个知识点要学多久？', a: '大约 10 分钟，分为探究、阅读、测试三个环节，轻量但完整。' },
    { q: '我的学习记录会保存吗？', a: '会。经验、成长阶段、状态与学习记录都保存在本地，关闭页面后再打开依然在。' },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="section py-20 sm:py-28">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <Eyebrow>常见问题</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">你可能想知道</h2>
      </motion.div>
      <div className="mx-auto mt-10 max-w-2xl space-y-3">
        {items.map((it, i) => (
          <motion.div key={i} {...reveal} className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left font-display font-extrabold">
              {it.q}
              <span className={`transition-transform ${open === i ? 'rotate-45' : ''}`}><PixelPlus size={16} color="#1F6B3B" /></span>
            </button>
            {open === i && <p className="px-5 pb-4 text-sm font-semibold text-inkSoft">{it.a}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CtaFooter({ onEnter }: { onEnter: () => void }) {
  return (
    <footer className="relative mt-10">
      <div className="section">
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-16 text-center text-cream shadow-card sm:py-20">
          <Floaty className="left-[10%] top-[20%]"><PixelStar color="#F2B33D" size={26} /></Floaty>
          <Floaty className="right-[12%] bottom-[24%]" delay={1}><PixelPlus color="#F7E8C9" size={22} /></Floaty>
          <div className="relative z-10 flex flex-col items-center">
            <Character stage="adult" expression="excited" size={120} />
            <h2 className="mt-5 max-w-xl font-display text-3xl font-extrabold sm:text-4xl">今天，也一起学习吧！</h2>
            <p className="mt-3 max-w-md font-semibold text-cream/80">领取属于你的像素小伙伴，让每一次认真都被看见。</p>
            <button onClick={onEnter} className="btn mt-7 bg-lemon px-8 py-4 text-base text-ink hover:-translate-y-0.5 hover:bg-lemon/90">
              领取我的小伙伴 →
            </button>
          </div>
        </motion.div>
      </div>
      <div className="section flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <Character stage="baby" expression="happy" size={30} float={false} />
          <span className="font-display font-extrabold">速知 SecKnow</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm font-bold text-inkSoft">
          {LESSONS.slice(0, 4).map((l) => <span key={l.id}>{l.subject}</span>)}
          <a href="#faq" className="hover:text-ink">常见问题</a>
        </div>
        <p className="text-xs font-semibold text-inkSoft">© 2026 速知</p>
      </div>
    </footer>
  )
}