import { CONFIG, stageForXP, stageProgress } from '../config/config'
import type { Derived, Expression, PetState } from './types'

const HOUR = 3600_000
const clamp = (n: number) => Math.max(CONFIG.decay.floor, Math.min(CONFIG.maxStat, n))

// 依据真实经过时间结算心情 / 饱腹度衰减（无死亡 / 无惩罚，有下限）
export function applyDecay(state: PetState, now = Date.now()): PetState {
  const hours = Math.max(0, (now - state.lastDecay) / HOUR)
  if (hours <= 0) return { ...state, lastDecay: now }
  return {
    ...state,
    mood: clamp(state.mood - hours * CONFIG.decay.moodPerHour),
    fullness: clamp(state.fullness - hours * CONFIG.decay.fullnessPerHour),
    lastDecay: now,
  }
}

export function derive(state: PetState, now = Date.now()): Derived {
  const stage = stageForXP(state.xp)
  const hoursAway = (now - state.lastVisit) / HOUR
  const justReturned = hoursAway >= CONFIG.absence.welcomeBackAfterHours
  let expression: Expression = 'neutral'
  if (hoursAway >= CONFIG.absence.missingAfterHours) expression = 'missing'
  else if (state.fullness < 35) expression = 'hungry'
  else if (state.mood >= 75) expression = 'happy'
  else if (state.mood < 40) expression = 'sleepy'
  return {
    stageId: stage.id,
    stageName: stage.name,
    scale: stage.scale,
    progress: stageProgress(state.xp),
    expression,
    hoursAway,
    justReturned,
  }
}

// 互动
export function pet(state: PetState, now = Date.now()): PetState {
  return touch({ ...state, mood: clamp(state.mood + CONFIG.interactions.petMood) }, now)
}

export function feed(state: PetState, now = Date.now()): PetState {
  return touch(
    {
      ...state,
      fullness: clamp(state.fullness + CONFIG.interactions.feedFullness),
      mood: clamp(state.mood + CONFIG.interactions.feedMood),
    },
    now,
  )
}

// 完成学习：基础奖励 + 每题对/错奖励 + 连续里程碑
export function completeLesson(
  state: PetState,
  lesson: { id: string; title: string; subject: string },
  correct: number,
  total: number,
  now = Date.now(),
): { state: PetState; gained: number; streakBonus: boolean } {
  const wrong = total - correct
  let gained =
    CONFIG.rewards.complete +
    correct * CONFIG.rewards.correct +
    wrong * CONFIG.rewards.wrong
  const streak = state.streak + 1
  const streakBonus = streak % CONFIG.rewards.streakStep === 0
  if (streakBonus) gained += CONFIG.rewards.streakBonus
  const next: PetState = {
    ...state,
    xp: state.xp + gained,
    streak,
    mood: clamp(state.mood + CONFIG.interactions.studyMood),
    fullness: clamp(state.fullness + CONFIG.interactions.studyFullness),
    records: [
      {
        lessonId: lesson.id,
        title: lesson.title,
        subject: lesson.subject,
        correct,
        total,
        xp: gained,
        at: now,
      },
      ...state.records,
    ].slice(0, 50),
  }
  return { state: touch(next, now), gained, streakBonus }
}

function touch(state: PetState, now: number): PetState {
  return { ...state, lastVisit: now, lastDecay: now }
}