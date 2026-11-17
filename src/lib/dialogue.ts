import type { Derived, PetState } from './types'

const LINES: Record<string, string[]> = {
  happy: ['今天也一起学习吧！', '和你在一起，我变得更强啦～', '你认真的样子，我都看在眼里！'],
  neutral: ['我准备好啦，想学点什么？', '慢慢来，我会一直陪着你。', '今天想探索哪个知识点呢？'],
  hungry: ['有点饿啦，可以陪我吃点东西吗？', '肚子咕咕叫～喂我一颗小果实吧！'],
  missing: ['好久没见到你啦，今天过得怎么样？', '我一直在等你回来，见到你真开心。'],
  sleepy: ['有点困困的，陪我玩一会儿好吗？', '摸摸我，我就又有精神啦！'],
  excited: ['太棒了！我们一起又长大了一点点！', '答得真好，我为你骄傲！'],
}

const RETURN_LINES = ['欢迎回来！我一直期待和你见面。', '你回来啦！今天也一起加油吧～']
const FEED_LINES = ['唔姆～好好吃！谢谢你！', '吃饱啦，浑身都是力气！']
const PET_LINES = ['嘿嘿，好舒服～', '最喜欢被你摸摸啦！']
const WRONG_LINES = ['没关系，错一道也没事，我们再想想～', '思考的过程最重要，你已经很棒啦！']

function pick(arr: string[], seed = Date.now()) {
  return arr[Math.floor(seed / 1000) % arr.length]
}

export function ambientLine(state: PetState, d: Derived): string {
  if (d.justReturned) return pick(RETURN_LINES, state.lastVisit)
  return pick(LINES[d.expression] ?? LINES.neutral, state.lastVisit + state.xp)
}

export const feedLine = () => pick(FEED_LINES)
export const petLine = () => pick(PET_LINES)
export const wrongLine = () => pick(WRONG_LINES)
export const rewardLine = (gained: number, bonus: boolean) =>
  bonus
    ? `连续学习达成！这次获得 ${gained} 点经验，我开心地转了个圈～`
    : `完成啦！获得 ${gained} 点经验，我们一起成长了！`