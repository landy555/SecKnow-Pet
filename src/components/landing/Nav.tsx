import { useEffect, useState } from 'react'
import Character from '../character/Character'

const LINKS = [
  { href: '#product', label: '产品' },
  { href: '#how', label: '学习流程' },
  { href: '#features', label: '特色' },
  { href: '#pet', label: '小伙伴' },
  { href: '#faq', label: '常见问题' },
]

export default function Nav({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-pill border px-3 py-2 sm:px-4 transition-all duration-300 backdrop-blur-md ${
          scrolled ? 'bg-cream/80 border-ink/10 shadow-soft' : 'bg-cream/40 border-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 pl-1">
          <Character stage="baby" expression="happy" size={34} float={false} />
          <span className="font-display text-lg font-extrabold tracking-tight">速知</span>
          <span className="hidden text-xs font-bold text-inkSoft sm:inline">SecKnow</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-pill px-3 py-1.5 text-sm font-bold text-inkSoft hover:bg-white/60 hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEnter} className="btn btn-primary !px-5 !py-2 text-sm">
            领取我的小伙伴
          </button>
          <button aria-label="菜单" onClick={() => setOpen((v) => !v)} className="md:hidden rounded-pill bg-white/60 p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2118" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="absolute top-16 w-[92%] max-w-6xl rounded-3xl border border-ink/10 bg-cream/95 p-3 shadow-card backdrop-blur md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-2.5 font-bold text-inkSoft hover:bg-white/70">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}