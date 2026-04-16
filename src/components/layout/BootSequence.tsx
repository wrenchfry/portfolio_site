import { AnimatePresence, motion } from 'framer-motion'

interface BootSequenceProps {
  lines: string[]
  visible: boolean
}

export function BootSequence({ lines, visible }: BootSequenceProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-neon-green"
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          initial={{ opacity: 1 }}
        >
          <p className="mb-8 text-center font-display text-xs uppercase tracking-[0.36em] text-neon-gold">
            Lesego Sindani
          </p>
          <div className="w-full max-w-3xl space-y-3 font-mono text-2xl text-left">
            {lines.map((line) => (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="boot-line"
                initial={{ opacity: 0, y: 4 }}
                key={line}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
