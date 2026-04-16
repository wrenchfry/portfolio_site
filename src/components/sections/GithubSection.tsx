import { motion } from 'framer-motion'
import { SectionHeading } from '../layout/SectionHeading'
import { formatMonthYear } from '../../lib/utils'
import type { useGithubProfile } from '../../hooks/useGithubProfile'

type GithubState = ReturnType<typeof useGithubProfile>

interface GithubSectionProps {
  github: GithubState
}

const statLabels = [
  { key: 'publicRepos', label: 'repos' },
  { key: 'followers', label: 'followers' },
  { key: 'following', label: 'following' },
  { key: 'totalStars', label: 'stars' },
] as const

export function GithubSection({ github }: GithubSectionProps) {
  return (
    <section className="section-shell" id="github">
      <SectionHeading
        kicker="GitHub Activity"
        subtitle="Live stats and repository activity pulled directly from the GitHub REST API."
        title="Activity log"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statLabels.map((item, index) => (
          <motion.article
            className="panel border border-white/10 px-5 py-4 text-center"
            initial={{ opacity: 0, y: 16 }}
            key={item.key}
            transition={{ delay: 0.05 * index, duration: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-sm text-neon-cyan">
              {github.data ? github.data[item.key] : github.status === 'error' ? 'ERR' : '...'}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ice-dim">
              {item.label}
            </p>
          </motion.article>
        ))}
      </div>

      {github.status === 'error' ? (
        <p className="mt-6 text-base leading-7 text-rose-300">{github.error}</p>
      ) : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {github.data?.repos.map((repo, index) => (
          <motion.a
            className="panel group border border-white/10 p-5 transition hover:-translate-y-1 hover:border-neon-cyan/40 hover:shadow-cyan"
            href={repo.url}
            initial={{ opacity: 0, y: 16 }}
            key={repo.id}
            rel="noreferrer"
            target="_blank"
            transition={{ delay: 0.03 * index, duration: 0.36 }}
            viewport={{ once: true, amount: 0.15 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[0.58rem] uppercase tracking-[0.22em] text-neon-cyan">
                  {repo.name}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-ice-dim">
                  {repo.language || 'repo'} | updated {formatMonthYear(repo.updatedAt)}
                </p>
              </div>
              <span className="rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neon-green">
                * {repo.stars}
              </span>
            </div>
            <p className="mt-4 text-base leading-7 text-ice-dim">
              {repo.description || 'Repository description unavailable.'}
            </p>
            {repo.homepage ? (
              <span className="mt-4 inline-flex text-sm uppercase tracking-[0.2em] text-neon-gold group-hover:text-neon-cyan">
                live deploy online
              </span>
            ) : null}
          </motion.a>
        ))}
      </div>
    </section>
  )
}
