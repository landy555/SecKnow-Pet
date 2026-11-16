import type { StageId } from '../config/config'

export interface LessonRecord {
  lessonId: string
  title: string
  subject: string
  correct: number
  total: number
  xp: number
  at: number
}

export interface PetState {
  xp: number
  mood: number
  fullness: number
  streak: number
  lastVisit: number // 上次互动时间戳
  lastDecay: number // 上次结算衰减时间戳
  createdAt: number
  records: LessonRecord[]
  claimed: boolean // 是否已领取小伙伴
  name: string
}

export type Expression = 'happy' | 'neutral' | 'hungry' | 'missing' | 'excited' | 'sleepy'

export interface Derived {
  stageId: StageId
  stageName: string
  scale: number
  progress: number
  expression: Expression
  hoursAway: number
  justReturned: boolean
}