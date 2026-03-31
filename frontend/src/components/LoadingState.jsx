import { AnimatePresence, motion } from 'framer-motion'

const STEP_COPY = {
  analyzing: {
    title: 'Analyzing your mood...',
    subtitle: 'Reading the emotional tone of your words',
  },
  finding: {
    title: 'Finding your soundtrack...',
    subtitle: 'Matching songs to your vibe',
  },
}

export function LoadingState({ step }) {
  if (!step) return null

  const copy = STEP_COPY[step] ?? STEP_COPY.analyzing

  return (
    <div className="mt-10 rounded-2xl border border-slate-200/70 bg-white/60 px-6 py-10 text-center shadow-sm backdrop-blur">
      <div className="animate-pulse-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="text-lg font-medium text-slate-700">{copy.title}</p>
            <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
        <span className="loading-dot h-2 w-2 rounded-full bg-slate-400" />
        <span className="loading-dot h-2 w-2 rounded-full bg-slate-400 [animation-delay:120ms]" />
        <span className="loading-dot h-2 w-2 rounded-full bg-slate-400 [animation-delay:240ms]" />
      </div>
    </div>
  )
}
