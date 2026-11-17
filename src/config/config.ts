export const CONFIG = {
  // 成长阶段：经验阈值
  stages: [
    { id: 'egg', name: '蛋', minXP: 0, scale: 0.72 },
    { id: 'baby', name: '幼年', minXP: 120, scale: 0.9 },
    { id: 'adult', name: '成年', minXP: 400, scale: 1.12 },
  ] as const,

  // 学习奖励
  rewards: {
    complete: 12, // 完成一次学习的基础奖励
    correct: 22, // 答对单题
    wrong: 6, // 答错单题（依然给予鼓励）
    streakBonus: 8, // 连续学习额外奖励（每 streak 里程碑）
    streakStep: 3, // 每连续 3 次触发一次额外奖励
  },

  // 状态随真实时间变化（单位：每小时）
  decay: {
    moodPerHour: 2.2, // 心情下降速度
    fullnessPerHour: 3.4, // 饱腹度下降速度
    floor: 12, // 最低值，不会归零 / 不惩罚
  },

  // 互动效果
  interactions: {
    feedFullness: 26, // 喂食恢复饱腹度
    feedMood: 6,
    petMood: 10, // 抚摸提升心情
    studyMood: 14, // 学习完成提升心情
    studyFullness: -4, // 学习消耗少量饱腹度
  },

  // 想念 / 回归判定（小时）
  absence: {
    missingAfterHours: 20, // 超过则显示想念
    welcomeBackAfterHours: 8, // 回来时的温暖欢迎
  },

  maxStat: 100,
  storageKey: 'secknow:v1',
} as const

export type Stage = (typeof CONFIG.stages)[number]
export type StageId = Stage['id']

export function stageForXP(xp: number): Stage {
  let current: Stage = CONFIG.stages[0]
  for (const s of CONFIG.stages) if (xp >= s.minXP) current = s
  return current
}

export function nextStage(xp: number) {
  return CONFIG.stages.find((s) => s.minXP > xp) ?? null
}

export function stageProgress(xp: number) {
  const cur = stageForXP(xp)
  const nxt = nextStage(xp)
  if (!nxt) return 1
  return Math.min(1, (xp - cur.minXP) / (nxt.minXP - cur.minXP))
}