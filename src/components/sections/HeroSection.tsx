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
    <section className="section-shell grid gap-8 overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
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
          <h1 className="max-w-3xl font-display text-lg uppercase leading-[1.9] tracking-[0.2em] text-neon-gold sm:text-2xl lg:text-[2rem]">
            {profile.name}
          </h1>
          <p className="text-lg uppercase tracking-[0.24em] text-neon-cyan sm:text-xl">
            {profile.role}
          </p>
          <p className="max-w-2xl text-lg leading-8 text-ice-dim sm:text-xl">
            {profile.headline}
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1 }}
          className="min-h-8 font-mono text-3xl text-neon-green"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          {typewriter}
          <span className="animate-pulse">█</span>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.16, duration: 0.5 }}
        >
          <span className="pixel-frame inline-flex items-center gap-2 border border-neon-green/40 bg-neon-green/10 px-4 py-2 text-sm uppercase tracking-[0.22em] text-neon-green">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-neon-green" />
            {profile.availability}
          </span>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <a className="pixel-button border-neon-green bg-neon-green text-night hover:shadow-neon" href="#quests">
            view quests
          </a>
          <a
            className="pixel-button border-neon-cyan bg-neon-cyan/10 text-neon-cyan hover:shadow-cyan"
            href={profile.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            github log
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
        className="panel relative flex min-h-[26rem] items-center justify-center overflow-hidden border border-neon-gold/25 bg-gradient-to-b from-neon-gold/10 via-panel/70 to-black/50"
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
