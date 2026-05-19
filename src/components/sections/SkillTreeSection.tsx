import { useMemo, useState } from 'react'
import { SectionHeading } from '../layout/SectionHeading'
import { cn } from '../../lib/utils'
import type { SkillBranch, SkillNode, SkillSource } from '../../types/portfolio'

const GRAPH_WIDTH = 980
const GRAPH_HEIGHT = 620

type Point = {
  x: number
  y: number
}

type BranchSlot = {
  point: Point
  via?: Point[]
}

type BranchLayout = {
  root: Point
  nodes: Record<string, BranchSlot>
}

const sourceColors: Record<SkillSource, string> = {
  'Self taught': '#24ff95',
  School: '#6fd8ff',
}

const branchStyles: Record<
  SkillBranch,
  {
    accent: string
    glow: string
  }
> = {
  languages: {
    accent: '#6fd8ff',
    glow: 'rgba(111, 216, 255, 0.28)',
  },
  web: {
    accent: '#24ff95',
    glow: 'rgba(36, 255, 149, 0.24)',
  },
  backend: {
    accent: '#ffd84a',
    glow: 'rgba(255, 216, 74, 0.24)',
  },
  cloud: {
    accent: '#b98cff',
    glow: 'rgba(185, 140, 255, 0.24)',
  },
  databases: {
    accent: '#ff9a61',
    glow: 'rgba(255, 154, 97, 0.24)',
  },
  tools: {
    accent: '#ff7aa2',
    glow: 'rgba(255, 122, 162, 0.22)',
  },
  concepts: {
    accent: '#7fa2ff',
    glow: 'rgba(127, 162, 255, 0.24)',
  },
}

const branchLayouts: Record<SkillBranch, BranchLayout> = {
  languages: {
    root: { x: 138, y: 124 },
    nodes: {
      haxe: { point: { x: 92, y: 64 } },
      python: { point: { x: 176, y: 56 } },
      csharp: { point: { x: 260, y: 116 } },
      java: { point: { x: 74, y: 184 } },
      javascript: { point: { x: 252, y: 178 } },
      typescript: { point: { x: 208, y: 224 } },
    },
  },
  web: {
    root: { x: 248, y: 304 },
    nodes: {
      react: { point: { x: 198, y: 226 } },
      html: { point: { x: 290, y: 222 } },
      css: { point: { x: 364, y: 294 } },
      nodejs: { point: { x: 168, y: 378 } },
      tailwind: { point: { x: 338, y: 372 } },
      mantine: { point: { x: 248, y: 444 } },
    },
  },
  tools: {
    root: { x: 132, y: 520 },
    nodes: {
      'git-github': { point: { x: 232, y: 484 } },
      'azure-platform': { point: { x: 222, y: 566 } },
    },
  },
  backend: {
    root: { x: 504, y: 132 },
    nodes: {
      'dotnet-core': { point: { x: 438, y: 68 } },
      'aspnet-core': { point: { x: 572, y: 70 } },
      json: { point: { x: 646, y: 132 } },
      'rest-apis': { point: { x: 428, y: 202 } },
      'client-server': { point: { x: 584, y: 202 } },
      'auth-basic': { point: { x: 504, y: 282 } },
    },
  },
  databases: {
    root: { x: 824, y: 140 },
    nodes: {
      sql: { point: { x: 760, y: 82 } },
      'relational-databases': { point: { x: 908, y: 82 } },
      'azure-sql': { point: { x: 754, y: 218 } },
      crud: { point: { x: 902, y: 220 } },
    },
  },
  concepts: {
    root: { x: 508, y: 404 },
    nodes: {
      oop: { point: { x: 424, y: 316 } },
      debugging: { point: { x: 506, y: 286 } },
      'system-architecture': { point: { x: 640, y: 336 } },
      'data-analytics': { point: { x: 428, y: 534 } },
      'secure-coding': { point: { x: 506, y: 562 } },
      'security-fundamentals': { point: { x: 648, y: 506 } },
    },
  },
  cloud: {
    root: { x: 836, y: 442 },
    nodes: {
      'azure-services': { point: { x: 754, y: 364 } },
      'azure-portal': { point: { x: 920, y: 366 } },
      'deployment-hosting': { point: { x: 920, y: 556 } },
    },
  },
}

function linePath(start: Point, end: Point) {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

function positionAsPercent(point: Point) {
  return {
    left: `${(point.x / GRAPH_WIDTH) * 100}%`,
    top: `${(point.y / GRAPH_HEIGHT) * 100}%`,
  }
}

export function SkillTreeSection({ skills }: { skills: SkillNode[] }) {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(
    () => skills.find((skill) => skill.id === 'react')?.id ?? skills[0]?.id ?? null,
  )

  const skillMap = useMemo(
    () => new Map(skills.map((skill) => [skill.id, skill])),
    [skills],
  )

  const rootsByBranch = useMemo(() => {
    const entries = skills
      .filter((skill) => skill.kind === 'root')
      .map((skill) => [skill.branch, skill] as const)

    return new Map(entries)
  }, [skills])

  const skillsByBranch = useMemo(() => {
    const grouped = new Map<SkillBranch, SkillNode[]>()

    skills
      .filter((skill) => skill.kind === 'skill')
      .forEach((skill) => {
        const existing = grouped.get(skill.branch) ?? []
        existing.push(skill)
        grouped.set(skill.branch, existing)
      })

    return grouped
  }, [skills])

  const activeSkill = activeSkillId ? skillMap.get(activeSkillId) ?? null : null
  const activeBranch = activeSkill?.branch ?? null
  const activeRoot = activeBranch ? rootsByBranch.get(activeBranch) ?? null : null
  const activeBranchSkills = activeBranch ? skillsByBranch.get(activeBranch) ?? [] : []

  const renderableBranches = Object.keys(branchLayouts) as SkillBranch[]

  return (
    <section className="section-shell" id="skill-tree">
      <SectionHeading
        kicker="Skill Tree"
        subtitle="A Bloom-inspired skill graph with clear clusters, larger nodes, and direct relationships."
        title="Skill map"
      />

      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_42%),linear-gradient(180deg,rgba(7,9,20,0.98),rgba(4,6,16,1))] px-4 py-5">
          {renderableBranches.map((branch) => {
            const layout = branchLayouts[branch]
            const branchStyle = branchStyles[branch]

            return (
              <div
                className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[82px]"
                key={`${branch}-glow`}
                style={{
                  ...positionAsPercent(layout.root),
                  background: branchStyle.glow,
                  opacity: activeBranch && activeBranch !== branch ? 0.14 : 0.34,
                }}
              />
            )
          })}

          <svg
            aria-hidden="true"
            className="relative z-10 h-auto w-full"
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          >
            {renderableBranches.map((branch) => {
              const layout = branchLayouts[branch]
              const branchSkills = skillsByBranch.get(branch) ?? []
              const dimmed = activeBranch !== null && activeBranch !== branch

              return branchSkills.map((skill) => {
                const slot = layout.nodes[skill.id]

                if (!slot) {
                  return null
                }

                const path = linePath(layout.root, slot.point)

                return (
                  <g key={skill.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={activeBranch === branch ? 3.25 : 2.4}
                      style={{
                        opacity: dimmed ? 0.22 : 0.68,
                      }}
                    />
                  </g>
                )
              })
            })}
          </svg>

          <div className="absolute inset-0 z-20">
            {renderableBranches.map((branch) => {
              const layout = branchLayouts[branch]
              const branchStyle = branchStyles[branch]
              const root = rootsByBranch.get(branch)
              const branchSkills = skillsByBranch.get(branch) ?? []
              const branchDimmed = activeBranch !== null && activeBranch !== branch

              return (
                <div key={branch}>
                  {root ? (
                    <button
                      aria-pressed={activeSkillId === root.id}
                      className={cn(
                        'absolute flex h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition duration-300',
                        branchDimmed && 'opacity-45',
                      )}
                      onClick={() => setActiveSkillId(root.id)}
                      style={{
                        ...positionAsPercent(layout.root),
                        borderColor: `${branchStyle.accent}88`,
                        boxShadow:
                          activeSkillId === root.id
                            ? `0 0 32px ${branchStyle.glow}`
                            : `0 0 20px ${branchStyle.glow}`,
                      }}
                      type="button"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className="flex h-[88px] w-[88px] items-center justify-center rounded-full border text-center font-display text-[0.7rem] uppercase tracking-[0.12em] shadow-[0_10px_36px_rgba(0,0,0,0.35)]"
                          style={{
                            color: '#ffffff',
                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), ${branchStyle.accent})`,
                            borderColor: 'rgba(255,255,255,0.58)',
                          }}
                        >
                          {root.icon}
                        </span>
                        <span
                          className="mt-3 max-w-[9rem] text-center font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/88"
                          style={{
                            textShadow: `0 0 18px ${branchStyle.glow}`,
                          }}
                        >
                          {root.name}
                        </span>
                      </div>
                    </button>
                  ) : null}

                  {branchSkills.map((skill) => {
                    const slot = layout.nodes[skill.id]

                    if (!slot) {
                      return null
                    }

                    const isActive = activeSkillId === skill.id

                    return (
                      <button
                        aria-pressed={isActive}
                        className={cn(
                          'absolute flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition duration-300',
                          branchDimmed && 'opacity-38',
                        )}
                        key={skill.id}
                        onClick={() => setActiveSkillId(skill.id)}
                        style={{
                          ...positionAsPercent(slot.point),
                          boxShadow: isActive
                            ? `0 0 24px ${branchStyle.glow}`
                            : `0 0 14px rgba(0, 0, 0, 0.38)`,
                        }}
                        type="button"
                      >
                        <div className="flex flex-col items-center">
                          <span
                            className="flex h-[54px] w-[54px] items-center justify-center rounded-full border font-display text-[0.5rem] uppercase tracking-[0.1em] shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
                            style={{
                              color: '#ffffff',
                              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), ${branchStyle.accent})`,
                              borderColor: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.34)',
                            }}
                          >
                            {skill.shortLabel ?? skill.icon}
                          </span>
                          <span
                            className="mt-2 max-w-[7rem] text-center font-sans text-[0.63rem] font-medium uppercase leading-4 tracking-[0.1em] text-white/78"
                            style={{
                              opacity: branchDimmed ? 0.5 : 1,
                            }}
                          >
                            {skill.name}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {renderableBranches.map((branch) => {
          const root = rootsByBranch.get(branch)
          const branchSkills = skillsByBranch.get(branch) ?? []
          const branchStyle = branchStyles[branch]

          if (!root) {
            return null
          }

          return (
            <article
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
              key={branch}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="font-display text-[0.58rem] uppercase tracking-[0.24em]"
                    style={{ color: branchStyle.accent }}
                  >
                    {root.name}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ice-dim">{root.description}</p>
                </div>
                <button
                  className="rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em]"
                  onClick={() => setActiveSkillId(root.id)}
                  style={{
                    borderColor: `${branchStyle.accent}66`,
                    color: branchStyle.accent,
                  }}
                  type="button"
                >
                  {root.icon}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {branchSkills.map((skill) => (
                  <button
                    className="rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] transition"
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    style={{
                      borderColor:
                        activeSkillId === skill.id
                          ? branchStyle.accent
                          : `${branchStyle.accent}44`,
                      background:
                        activeSkillId === skill.id
                          ? `${branchStyle.accent}22`
                          : 'rgba(255,255,255,0.03)',
                      color: activeSkillId === skill.id ? '#ffffff' : branchStyle.accent,
                    }}
                    type="button"
                  >
                    {skill.shortLabel ?? skill.icon}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">
            Selected node
          </p>

          {activeSkill ? (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h3
                  className="font-display text-[0.74rem] uppercase tracking-[0.18em]"
                  style={{ color: branchStyles[activeSkill.branch].accent }}
                >
                  {activeSkill.name}
                </h3>

                {activeSkill.kind === 'skill' && activeSkill.source ? (
                  <span
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]"
                    style={{
                      borderColor: `${sourceColors[activeSkill.source]}66`,
                      color: sourceColors[activeSkill.source],
                    }}
                  >
                    {activeSkill.source}
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ice-dim">
                    Branch root
                  </span>
                )}
              </div>

              {activeSkill.kind === 'skill' ? (
                <>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${activeSkill.mastery}%`,
                        background: `linear-gradient(90deg, ${branchStyles[activeSkill.branch].accent}, rgba(255,255,255,0.92))`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-ice-dim">
                    comfort level {activeSkill.mastery} / 100
                  </p>
                </>
              ) : null}

              <p className="mt-5 text-base leading-7 text-ice-dim">
                {activeSkill.kind === 'root'
                  ? activeSkill.description
                  : activeSkill.experience ?? activeSkill.description}
              </p>
            </>
          ) : (
            <p className="mt-4 text-base leading-7 text-ice-dim">
              Select a branch or skill node to inspect the details.
            </p>
          )}
        </article>

        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">
            Branch overview
          </p>

          {activeRoot ? (
            <>
              <h3
                className="mt-4 font-display text-[0.72rem] uppercase tracking-[0.18em]"
                style={{ color: branchStyles[activeRoot.branch].accent }}
              >
                {activeRoot.name}
              </h3>
              <p className="mt-5 text-base leading-7 text-ice-dim">
                {activeRoot.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeBranchSkills.map((skill) => (
                  <button
                    className="rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] transition"
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    style={{
                      borderColor:
                        activeSkillId === skill.id
                          ? branchStyles[skill.branch].accent
                          : `${branchStyles[skill.branch].accent}44`,
                      background:
                        activeSkillId === skill.id
                          ? `${branchStyles[skill.branch].accent}24`
                          : 'rgba(255,255,255,0.02)',
                      color:
                        activeSkillId === skill.id
                          ? '#ffffff'
                          : branchStyles[skill.branch].accent,
                    }}
                    type="button"
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-base leading-7 text-ice-dim">
              Pick a branch to inspect the skills attached to it.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}
