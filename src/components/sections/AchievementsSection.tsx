import { motion } from 'framer-motion'
import { SectionHeading } from '../layout/SectionHeading'
import type { AchievementCard } from '../../types/portfolio'

interface AchievementsSectionProps {
  achievements: AchievementCard[]
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <section className="section-shell" id="achievements">
      <SectionHeading
        kicker="Achievements"
        subtitle="Certifications, milestones, and accomplishments"
        title="Accomplishments"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {achievements.map((achievement, index) => (
          <motion.article
            className="panel border border-white/10 p-6"
            initial={{ opacity: 0, y: 18 }}
            key={achievement.id}
            transition={{ delay: 0.06 * index, duration: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-3xl">{achievement.icon}</span>
              <span className="rounded-full border border-neon-gold/20 bg-neon-gold/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neon-gold">
                {achievement.earnedAt}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[0.66rem] uppercase leading-6 tracking-[0.2em] text-ice">
              {achievement.title}
            </h3>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neon-cyan">
              {achievement.issuer}
            </p>
            <p className="mt-4 text-base leading-7 text-ice-dim">{achievement.summary}</p>
            {achievement.link ? (
              <a
                className="mt-5 inline-flex text-sm uppercase tracking-[0.2em] text-neon-green transition hover:text-neon-gold"
                href={achievement.link}
                rel="noreferrer"
                target="_blank"
              >
                inspect reward
              </a>
            ) : null}
          </motion.article>
        ))}
      </div>
    </section>
  )
}
