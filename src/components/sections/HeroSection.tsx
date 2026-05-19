import { motion } from 'framer-motion'
import { WrenchfrySprite } from '../canvas/WrenchfrySprite'
import { formatShortNumber } from '../../lib/utils'
import type { SiteProfile } from '../../types/portfolio'
import type { useGithubProfile } from '../../hooks/useGithubProfile'

type GithubState = ReturnType<typeof useGithubProfile>

interface HeroSectionProps {
  profile: SiteProfile
  github: GithubState
  questCount: number
  achievementCount: number
  typewriter: string
}

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.22 + index * 0.08,
      duration: 0.5,
    },
  }),
}

export function HeroSection({
  profile,
  github,
  questCount,
  achievementCount,
  typewriter,
}: HeroSectionProps) {
  const stats = [
    { label: 'quests', value: questCount },
    { label: 'achievements', value: achievementCount },
    {
      label: 'repos',
      value: github.data?.publicRepos ?? '...',
    },
    {
      label: 'stars',
      value: github.data ? formatShortNumber(github.data.totalStars) : '...',
    },
  ]

  return (
    <section className="section-shell grid gap-8 overflow-hidden lg:grid-cols-[1.12fr_0.88fr]">
      <div className="relative space-y-6">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="section-title"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45 }}
        >
          Overview
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <h1 className="max-w-3xl font-display text-base uppercase leading-[1.7] tracking-[0.18em] text-neon-gold sm:text-xl lg:text-[1.85rem]">
            {profile.name}
          </h1>
          <p className="max-w-2xl text-sm uppercase tracking-[0.24em] text-neon-cyan sm:text-base lg:text-lg">
            {profile.role}
          </p>
          <p className="max-w-2xl text-base leading-8 text-ice-dim sm:text-lg">
            {profile.headline}
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1 }}
          className="relative h-[6.25rem] max-w-2xl overflow-hidden rounded-[24px] border border-neon-green/18 bg-black/25 px-4 py-4 font-mono text-[1.95rem] text-neon-green shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:h-[5.5rem] sm:text-[2.25rem] lg:h-[5.25rem] lg:text-[2.4rem]"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <div className="absolute inset-0 flex items-center px-4 py-4">
            <span className="max-w-[92%] leading-[1.15]">{typewriter}</span>
            <span className="ml-2 inline-block h-8 w-[0.45ch] flex-shrink-0 animate-pulse rounded-sm bg-neon-green/80 align-middle sm:h-9" />
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="panel max-w-2xl border border-neon-green/18 px-5 py-4"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.16, duration: 0.5 }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-neon-green shadow-[0_0_18px_rgba(34,243,154,0.5)]" />
              <p className="font-display text-[0.52rem] uppercase tracking-[0.24em] text-neon-green">
                Status
              </p>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ice-dim sm:text-base">
              {profile.availability}
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <a className="pixel-button border-neon-green bg-neon-green text-night hover:shadow-neon" href="#quests">
            quest log
          </a>
          <a className="pixel-button border-neon-cyan bg-neon-cyan/10 text-neon-cyan hover:shadow-cyan" href="#github">
            activity log
          </a>
        </motion.div>

        <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              animate="visible"
              className="panel relative overflow-hidden border border-white/10 px-5 py-4"
              custom={index}
              initial="hidden"
              key={stat.label}
              variants={statCardVariants}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-neon-green/70 opacity-70 animate-sweep" />
              <p className="font-display text-sm text-neon-green">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-ice-dim">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="panel relative flex min-h-[22rem] items-center justify-center overflow-hidden border border-neon-gold/25 bg-gradient-to-b from-neon-gold/10 via-panel/70 to-black/50"
        initial={{ opacity: 0, scale: 0.96 }}
        transition={{ delay: 0.12, duration: 0.55 }}
      >
        <div className="absolute inset-6 rounded-full border border-neon-gold/15 bg-neon-gold/5 blur-3xl" />
        <div className="absolute inset-x-10 bottom-8 h-24 rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-5">
          <WrenchfrySprite className="drop-shadow-[0_0_26px_rgba(255,208,0,0.7)]" scale={7} />
          <div className="text-center">
            <p className="font-display text-[0.58rem] uppercase tracking-[0.32em] text-neon-gold">
              {profile.name}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ice-dim">
              {github.status === 'ready'
                ? `${github.data?.publicRepos ?? 0} repos live | ${github.data?.followers ?? 0} followers`
                : 'syncing github telemetry'}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
