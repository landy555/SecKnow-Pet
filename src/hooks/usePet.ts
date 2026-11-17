import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from '../config/config'
import * as P from '../lib/persistence'
import * as L from '../lib/logic'
import type { PetSpecies, PetState } from '../lib/types'

export function usePet() {
  const [state, setState] = useState<PetState>(() => L.applyDecay(P.load()))
  const [now, setNow] = useState(() => Date.now())
  const stateRef = useRef(state)
  stateRef.current = state

  // 持久化
  useEffect(() => {
    P.save(state)
  }, [state])

  // 定时结算真实时间衰减（每分钟）+ 刷新 derived
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      setState((s) => L.applyDecay(s, t))
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const derived = useMemo(() => L.derive(state, now), [state, now])

  const pet = useCallback(() => setState((s) => L.pet(s)), [])
  const feed = useCallback(() => setState((s) => L.feed(s)), [])
  const claim = useCallback((choice: PetSpecies | 'random' = 'owl') => {
    const species: PetSpecies = choice === 'random' ? (Math.random() < 0.5 ? 'owl' : 'frog') : choice
    setState((s) => ({ ...s, species, claimed: true, lastVisit: Date.now(), lastDecay: Date.now() }))
    return species
  }, [])

  const finishLesson = useCallback(
    (lesson: { id: string; title: string; subject: string }, correct: number, total: number) => {
      const res = L.completeLesson(stateRef.current, lesson, correct, total)
      setState(res.state)
      return res
    },
    [],
  )

  // 调试用
  const debug = useMemo(
    () => ({
      addXP: (n: number) => setState((s) => ({ ...s, xp: Math.max(0, s.xp + n) })),
      setMood: (n: number) => setState((s) => ({ ...s, mood: n })),
      setFullness: (n: number) => setState((s) => ({ ...s, fullness: n })),
      simulateAway: (hours: number) =>
        setState((s) => {
          const past = Date.now() - hours * 3600_000
          return L.applyDecay({ ...s, lastVisit: past, lastDecay: past }, Date.now())
        }),
      simulateAnswer: (correct: boolean) =>
        setState((s) =>
          L.completeLesson(s, { id: 'debug', title: '调试练习', subject: '调试' }, correct ? 1 : 0, 1).state,
        ),
      reset: () => {
        P.clear()
        setState(P.freshState())
      },
    }),
    [],
  )

  return { state, derived, now, pet, feed, claim, finishLesson, debug, maxStat: CONFIG.maxStat }
}

export type PetApi = ReturnType<typeof usePet>