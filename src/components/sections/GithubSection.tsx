import { motion } from 'framer-motion'
import { SectionHeading } from '../layout/SectionHeading'
import { formatMonthYear, formatShortNumber } from '../../lib/utils'
import type { useGithubProfile } from '../../hooks/useGithubProfile'

type GithubState = ReturnType<typeof useGithubProfile>

interface GithubSectionProps {
  github: GithubState
}

const statLabels = [
  { key: 'publicRepos', label: 'public repos' },
  { key: 'followers', label: 'followers' },
  { key: 'following', label: 'following' },
  { key: 'totalStars', label: 'stars' },
] as const

export function GithubSection({ github }: GithubSectionProps) {
  return (
    <section className="section-shell" id="github">
      <SectionHeading
        kicker="Activity Log"
        subtitle=""
        title="GitHub activity"
      />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="panel border border-neon-cyan/18 bg-[linear-gradient(180deg,rgba(111,216,255,0.08),rgba(255,255,255,0.02))] p-5">
          <p className="font-display text-[0.56rem] uppercase tracking-[0.24em] text-neon-cyan">
            Signal board
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {statLabels.map((item, index) => (
              <motion.article
                className="rounded-[24px] border border-white/10 bg-black/20 px-4 py-4"
                initial={{ opacity: 0, y: 16 }}
                key={item.key}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-neon-cyan">
                  {github.data
                    ? item.key === 'totalStars'
                      ? formatShortNumber(github.data[item.key])
                      : github.data[item.key]
                    : github.status === 'error'
                      ? 'ERR'
                      : '...'}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ice-dim">
                  {item.label}
                </p>
              </motion.article>
            ))}
          </div>

          {github.status === 'error' ? (
            <p className="mt-6 rounded-[22px] border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-sm leading-6 text-rose-200">
              {github.error}
            </p>
          ) : null}
        </aside>

        <div className="panel overflow-hidden border border-neon-cyan/16 bg-[linear-gradient(180deg,rgba(6,13,26,0.92),rgba(7,9,20,0.98))]">
          <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[0.56rem] uppercase tracking-[0.24em] text-neon-cyan">
                Recent repository activity
              </p>
              <p className="mt-3 text-sm leading-6 text-ice-dim">
                The latest public repos, stack choices, and updates from the live profile feed.
              </p>
            </div>

            {github.data ? (
              <a
                className="rounded-full border border-neon-cyan/30 px-4 py-2 text-xs uppercase tracking-[0.18em] text-neon-cyan transition hover:bg-neon-cyan/10"
                href={github.data.htmlUrl}
                rel="noreferrer"
                target="_blank"
              >
                open github
              </a>
            ) : null}
          </div>

          <div className="divide-y divide-white/8">
            {github.data?.repos.map((repo, index) => (
              <motion.article
                className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_auto]"
                initial={{ opacity: 0, y: 16 }}
                key={repo.id}
                transition={{ delay: 0.03 * index, duration: 0.36 }}
                viewport={{ once: true, amount: 0.15 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-neon-cyan shadow-[0_0_16px_rgba(111,216,255,0.55)]" />
                    <h3 className="font-display text-[0.58rem] uppercase tracking-[0.22em] text-neon-cyan">
                      {repo.name}
                    </h3>
                    {repo.language ? (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ice-dim">
                        {repo.language}
                      </span>
                    ) : null}
                    {repo.homepage ? (
                      <span className="rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-neon-green">
                        live
                      </span>
                    ) : null}
                  </div>

                  <p className="text-base leading-7 text-ice-dim">
                    {repo.description || 'Repository description unavailable.'}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 text-sm text-ice-dim lg:items-end">
                  <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ice">
                    {repo.stars} stars
                  </span>
                  <p>Updated {formatMonthYear(repo.updatedAt)}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      className="rounded-full border border-neon-cyan/30 px-3 py-2 text-xs uppercase tracking-[0.18em] text-neon-cyan transition hover:bg-neon-cyan/10"
                      href={repo.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      repo
                    </a>
                    {repo.homepage ? (
                      <a
                        className="rounded-full border border-neon-green/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-neon-green transition hover:bg-neon-green/10"
                        href={repo.homepage}
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
        </div>
      </div>
    </section>
  )
}
