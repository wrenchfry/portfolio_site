import { motion } from 'framer-motion'
import { WrenchfrySprite } from '../canvas/WrenchfrySprite'
import { SectionHeading } from '../layout/SectionHeading'
import { getBirthdayStats } from '../../lib/utils'
import type { SiteProfile } from '../../types/portfolio'

interface ProfileSectionProps {
  profile: SiteProfile
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const birthdayStats = getBirthdayStats(profile.birthDate)

  const statBars = [
    {
      id: 'hp',
      label: 'HP',
      helper: 'Current energy',
      value: profile.stats.hp,
      display: `${profile.stats.hp}/100`,
      fill: 'linear-gradient(90deg, rgba(0,255,136,0.95), rgba(98,255,184,0.9))',
      glow: 'shadow-[0_0_24px_rgba(0,255,136,0.28)]',
    },
    {
      id: 'xp',
      label: 'XP',
      helper: birthdayStats.isBirthday
        ? 'Birthday milestone active'
        : `Tracks progress to 26 May`,
      value: birthdayStats.xpProgress,
      display: `${birthdayStats.xpProgress}/100`,
      fill: 'linear-gradient(90deg, rgba(0,212,255,0.95), rgba(125,238,255,0.88))',
      glow: birthdayStats.isBirthday
        ? 'shadow-[0_0_28px_rgba(0,212,255,0.4)]'
        : 'shadow-[0_0_24px_rgba(0,212,255,0.24)]',
    },
    {
      id: 'level',
      label: 'LVL',
      helper: 'Age',
      value: birthdayStats.ageProgress,
      display: `${birthdayStats.age} / 100 (age)`,
      fill: 'linear-gradient(90deg, rgba(255,208,0,0.95), rgba(255,239,125,0.88))',
      glow: 'shadow-[0_0_24px_rgba(255,208,0,0.24)]',
    },
  ]

  return (
    <section className="section-shell" id="about">
      <SectionHeading
        kicker="Player Profile"
        subtitle="A live profile card with the essentials."
        title="Player Profile"
      />

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <motion.div
          className={`panel relative flex flex-col items-center gap-5 overflow-hidden px-6 py-7 text-center ${
            birthdayStats.isBirthday
              ? 'border border-neon-gold/50 bg-[radial-gradient(circle_at_top,rgba(255,208,0,0.2),transparent_45%),rgba(14,14,36,0.88)]'
              : 'border border-neon-gold/25'
          }`}
          initial={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          {birthdayStats.isBirthday ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_10%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.22),transparent_10%),radial-gradient(circle_at_35%_82%,rgba(0,212,255,0.2),transparent_12%),radial-gradient(circle_at_72%_76%,rgba(255,208,0,0.24),transparent_14%)] opacity-80" />
          ) : null}

          <div className="relative z-10 flex w-full items-center justify-between gap-3 text-left">
            <div>
              <p className="font-display text-[0.56rem] uppercase tracking-[0.24em] text-neon-gold">
                {profile.handle}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ice-dim">
                {profile.role}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ice">
              {birthdayStats.isBirthday
                ? 'Birthday buff active'
                : `${birthdayStats.daysUntilBirthday} days to next level`}
            </span>
          </div>

          <div className="relative z-10">
            <WrenchfrySprite className="drop-shadow-[0_0_20px_rgba(255,208,0,0.45)]" interactive={false} scale={5} />
          </div>

          <div className="relative z-10">
            <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-neon-gold">
              {profile.name}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ice-dim">
              {profile.location}
            </p>
          </div>

          <div className="relative z-10 w-full space-y-4 text-left">
            {statBars.map((bar) => (
              <div key={bar.id}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm uppercase tracking-[0.2em] text-ice-dim">
                  <div className="space-y-1">
                    <p className="text-ice">{bar.label}</p>
                    <p className="text-[0.68rem] tracking-[0.18em] text-white/45">{bar.helper}</p>
                  </div>
                  <span className="text-right text-xs tracking-[0.18em] text-ice">
                    {bar.display}
                  </span>
                </div>
                <div className="relative h-3.5 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${bar.glow} ${
                      bar.id === 'xp' && birthdayStats.isBirthday ? 'animate-[sparkle_1.4s_linear_infinite]' : ''
                    }`}
                    style={{
                      width: `${bar.value}%`,
                      backgroundImage: bar.fill,
                    }}
                  />
                  {bar.id === 'xp' ? (
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden rounded-full">
                      <div className="h-full w-20 -translate-x-full animate-[shimmer_2.8s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent)]" />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            className="space-y-4 text-lg leading-8 text-ice-dim"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {profile.tags.map((tag) => (
              <article
                className="rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 py-4 backdrop-blur-sm transition hover:-translate-y-1 hover:border-neon-cyan/30"
                key={tag}
              >
                <span className="block h-1.5 w-12 rounded-full bg-[linear-gradient(90deg,rgba(0,212,255,1),rgba(0,255,136,1))]" />
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-ice">{tag}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
