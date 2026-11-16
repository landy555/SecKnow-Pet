import { CONFIG } from '../config/config'
import type { PetState } from './types'

export function freshState(now = Date.now()): PetState {
  return {
    xp: 0,
    mood: 82,
    fullness: 78,
    streak: 0,
    lastVisit: now,
    lastDecay: now,
    createdAt: now,
    records: [],
    claimed: false,
    name: '小知',
  }
}

export function load(): PetState {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw)
    return { ...freshState(), ...parsed }
  } catch {
    return freshState()
  }
}

export function save(state: PetState) {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state))
  } catch {
    /* ignore quota errors */
  }
}

export function clear() {
  localStorage.removeItem(CONFIG.storageKey)
}