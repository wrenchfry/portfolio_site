import { motion } from 'framer-motion'
import { SectionHeading } from '../layout/SectionHeading'
import { cn, formatMonthYear } from '../../lib/utils'
import type { QuestCard } from '../../types/portfolio'

interface QuestLogSectionProps {
  quests: QuestCard[]
}

const statusStyles = {
  ongoing: 'border-neon-green/40 bg-neon-green/10 text-neon-green',
  completed: 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan',
  available: 'border-neon-gold/40 bg-neon-gold/10 text-neon-gold',
}

export function QuestLogSection({ quests }: QuestLogSectionProps) {
  return (
    <section className="section-shell" id="quests">
      <SectionHeading
        kicker="Quest Log"
        subtitle=""
        title="Projects in play"
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {quests.map((quest, index) => (
          <motion.article
            className={cn(
              'group panel relative overflow-hidden border border-white/10 p-6 transition hover:-translate-y-1 hover:border-neon-gold/35 hover:shadow-gold',
              quest.repoUrl && 'cursor-pointer',
            )}
            initial={{ opacity: 0, y: 18 }}
            key={quest.id}
            onClick={() => {
              if (quest.repoUrl) {
                window.open(quest.repoUrl, '_blank', 'noopener,noreferrer')
              }
            }}
            onKeyDown={(event) => {
              if (!quest.repoUrl) {
                return
              }

              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                window.open(quest.repoUrl, '_blank', 'noopener,noreferrer')
              }
            }}
            role={quest.repoUrl ? 'link' : undefined}
            tabIndex={quest.repoUrl ? 0 : undefined}
            transition={{ delay: 0.06 * index, duration: 0.42 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-neon-gold/70 transition group-hover:w-full group-hover:opacity-5" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[0.52rem] uppercase tracking-[0.28em] text-neon-violet">
                    lvl {`0${quest.level}`.slice(-2)} quest
                  </p>
                  <h3 className="mt-3 font-display text-[0.72rem] uppercase leading-6 tracking-[0.18em] text-ice">
                    {quest.title}
                  </h3>
                </div>
                <span
                  className={cn(
                    'pixel-frame border px-3 py-2 text-xs uppercase tracking-[0.18em]',
                    statusStyles[quest.status],
                  )}
                >
                  {quest.status}
                </span>
              </div>

              <p className="text-base leading-7 text-ice-dim">{quest.summary}</p>

              <div className="flex flex-wrap gap-2">
                {quest.stack.map((stackItem) => (
                  <span
                    className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neon-cyan"
                    key={stackItem}
                  >
                    {stackItem}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-ice-dim">
                <p>XP reward: {quest.xp}</p>
                <p>{quest.updatedAt ? `Updated ${formatMonthYear(quest.updatedAt)}` : 'Quest data live'}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {quest.repoUrl ? (
                  <a
                    className="pixel-button border-neon-green bg-neon-green/10 text-neon-green hover:shadow-neon"
                    href={quest.repoUrl}
                    onClick={(event) => event.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    repo
                  </a>
                ) : null}
                {quest.liveUrl ? (
                  <a
                    className="pixel-button border-neon-cyan bg-neon-cyan/10 text-neon-cyan hover:shadow-cyan"
                    href={quest.liveUrl}
                    onClick={(event) => event.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    live
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
