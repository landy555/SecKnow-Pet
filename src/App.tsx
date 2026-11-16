import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/landing/Landing'
import PetApp from './components/app/PetApp'
import { usePet } from './hooks/usePet'

export default function App() {
  const api = usePet()
  const [view, setView] = useState<'landing' | 'app'>('landing')
  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Landing onEnter={() => setView('app')} />
        </motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PetApp api={api} onHome={() => setView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}