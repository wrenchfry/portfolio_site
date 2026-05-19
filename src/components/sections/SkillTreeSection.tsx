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
  title: Point
  titleAlign: 'left' | 'center' | 'right'
  titleLines: string[]
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
    root: { x: 124, y: 116 },
    title: { x: 104, y: 198 },
    titleAlign: 'left',
    titleLines: ['Programming', 'Languages'],
    nodes: {
      haxe: { point: { x: 78, y: 54 }, via: [{ x: 142, y: 104 }, { x: 126, y: 78 }] },
      python: { point: { x: 168, y: 50 }, via: [{ x: 146, y: 102 }, { x: 164, y: 74 }] },
      csharp: { point: { x: 258, y: 110 }, via: [{ x: 152, y: 116 }, { x: 208, y: 112 }] },
      java: { point: { x: 76, y: 186 }, via: [{ x: 144, y: 132 }, { x: 126, y: 166 }] },
      javascript: {
        point: { x: 270, y: 178 },
        via: [{ x: 148, y: 136 }, { x: 208, y: 158 }],
      },
      typescript: {
        point: { x: 216, y: 220 },
        via: [{ x: 148, y: 140 }, { x: 184, y: 196 }],
      },
    },
  },
  web: {
    root: { x: 238, y: 242 },
    title: { x: 228, y: 348 },
    titleAlign: 'left',
    titleLines: ['Web Tech &', 'Frameworks'],
    nodes: {
      react: { point: { x: 188, y: 186 }, via: [{ x: 236, y: 220 }, { x: 208, y: 194 }] },
      html: { point: { x: 286, y: 184 }, via: [{ x: 266, y: 220 }, { x: 294, y: 194 }] },
      css: { point: { x: 350, y: 238 }, via: [{ x: 278, y: 246 }, { x: 324, y: 240 }] },
      nodejs: { point: { x: 150, y: 320 }, via: [{ x: 232, y: 266 }, { x: 188, y: 300 }] },
      tailwind: { point: { x: 358, y: 314 }, via: [{ x: 280, y: 260 }, { x: 328, y: 298 }] },
      mantine: { point: { x: 260, y: 396 }, via: [{ x: 252, y: 284 }, { x: 256, y: 362 }] },
    },
  },
  tools: {
    root: { x: 126, y: 474 },
    title: { x: 110, y: 548 },
    titleAlign: 'left',
    titleLines: ['Tools &', 'Platforms'],
    nodes: {
      'git-github': { point: { x: 226, y: 434 }, via: [{ x: 160, y: 468 }, { x: 196, y: 446 }] },
      'azure-platform': { point: { x: 212, y: 532 }, via: [{ x: 156, y: 486 }, { x: 188, y: 518 }] },
    },
  },
  backend: {
    root: { x: 502, y: 124 },
    title: { x: 500, y: 204 },
    titleAlign: 'center',
    titleLines: ['Backend & API'],
    nodes: {
      'dotnet-core': { point: { x: 436, y: 54 }, via: [{ x: 484, y: 104 }, { x: 454, y: 72 }] },
      'aspnet-core': { point: { x: 568, y: 56 }, via: [{ x: 520, y: 104 }, { x: 548, y: 72 }] },
      json: { point: { x: 640, y: 118 }, via: [{ x: 530, y: 124 }, { x: 608, y: 124 }] },
      'rest-apis': { point: { x: 424, y: 172 }, via: [{ x: 478, y: 146 }, { x: 446, y: 164 }] },
      'client-server': { point: { x: 572, y: 182 }, via: [{ x: 524, y: 152 }, { x: 556, y: 176 }] },
      'auth-basic': { point: { x: 510, y: 252 }, via: [{ x: 502, y: 162 }, { x: 506, y: 224 }] },
    },
  },
  databases: {
    root: { x: 820, y: 118 },
    title: { x: 822, y: 196 },
    titleAlign: 'center',
    titleLines: ['Databases'],
    nodes: {
      sql: { point: { x: 760, y: 58 }, via: [{ x: 794, y: 98 }, { x: 768, y: 70 }] },
      'relational-databases': { point: { x: 904, y: 60 }, via: [{ x: 846, y: 98 }, { x: 886, y: 72 }] },
      'azure-sql': { point: { x: 748, y: 208 }, via: [{ x: 794, y: 146 }, { x: 758, y: 192 }] },
      crud: { point: { x: 904, y: 208 }, via: [{ x: 842, y: 148 }, { x: 890, y: 190 }] },
    },
  },
  concepts: {
    root: { x: 520, y: 390 },
    title: { x: 522, y: 488 },
    titleAlign: 'center',
    titleLines: ['Concepts'],
    nodes: {
      oop: { point: { x: 432, y: 288 }, via: [{ x: 488, y: 348 }, { x: 446, y: 302 }] },
      debugging: { point: { x: 524, y: 272 }, via: [{ x: 520, y: 340 }, { x: 524, y: 288 }] },
      'system-architecture': { point: { x: 650, y: 314 }, via: [{ x: 560, y: 350 }, { x: 624, y: 324 }] },
      'data-analytics': { point: { x: 440, y: 548 }, via: [{ x: 492, y: 430 }, { x: 450, y: 526 }] },
      'secure-coding': { point: { x: 522, y: 562 }, via: [{ x: 520, y: 438 }, { x: 522, y: 540 }] },
      'security-fundamentals': { point: { x: 646, y: 524 }, via: [{ x: 552, y: 430 }, { x: 620, y: 510 }] },
    },
  },
  cloud: {
    root: { x: 844, y: 432 },
    title: { x: 850, y: 504 },
    titleAlign: 'center',
    titleLines: ['Cloud & DevOps'],
    nodes: {
      'azure-services': { point: { x: 772, y: 346 }, via: [{ x: 812, y: 396 }, { x: 786, y: 360 }] },
      'azure-portal': { point: { x: 926, y: 350 }, via: [{ x: 876, y: 398 }, { x: 910, y: 360 }] },
      'deployment-hosting': { point: { x: 926, y: 550 }, via: [{ x: 874, y: 454 }, { x: 912, y: 530 }] },
    },
  },
}

function smoothPath(points: Point[]) {
  if (points.length < 2) {
    return ''
  }

  if (points.length === 2) {
    const [start, end] = points
    const control = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    }

    return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`
  }

  const [start, ...rest] = points
  let path = `M ${start.x} ${start.y}`

  for (let index = 0; index < rest.length - 1; index += 1) {
    const current = rest[index]
    const next = rest[index + 1]
    const midpoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    }

    if (index === rest.length - 2) {
      path += ` Q ${current.x} ${current.y} ${next.x} ${next.y}`
      continue
    }

    path += ` Q ${current.x} ${current.y} ${midpoint.x} ${midpoint.y}`
  }

  return path
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
        subtitle="A clean branch map of the tools, foundations, and languages I keep building with."
        title="Skill map"
      />

      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%),linear-gradient(180deg,rgba(8,10,24,0.92),rgba(4,6,16,0.97))] px-4 py-5">
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
              const branchStyle = branchStyles[branch]
              const branchSkills = skillsByBranch.get(branch) ?? []
              const dimmed = activeBranch !== null && activeBranch !== branch

              return branchSkills.map((skill) => {
                const slot = layout.nodes[skill.id]

                if (!slot) {
                  return null
                }

                const path = smoothPath([layout.root, ...(slot.via ?? []), slot.point])

                return (
                  <g key={skill.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(11, 14, 29, 0.96)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={17}
                    />
                    <path
                      d={path}
                      fill="none"
                      opacity={dimmed ? 0.24 : 0.88}
                      stroke={branchStyle.accent}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={activeBranch === branch ? 6 : 5}
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
                        'absolute flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition duration-300',
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
                      <span
                        className="flex h-[76px] w-[76px] items-center justify-center rounded-full border bg-black/80 font-display text-[0.62rem] uppercase tracking-[0.18em]"
                        style={{
                          color: branchStyle.accent,
                          borderColor: `${branchStyle.accent}88`,
                        }}
                      >
                        {root.icon}
                      </span>
                    </button>
                  ) : null}

                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    style={positionAsPercent(layout.title)}
                  >
                    <div
                      className={cn(
                        'space-y-1',
                        layout.titleAlign === 'center' && 'text-center',
                        layout.titleAlign === 'left' && 'text-left',
                        layout.titleAlign === 'right' && 'text-right',
                      )}
                    >
                      {layout.titleLines.map((line) => (
                        <p
                          className="font-display text-[0.48rem] uppercase tracking-[0.28em]"
                          key={`${branch}-${line}`}
                          style={{
                            color: branchStyle.accent,
                            opacity: branchDimmed ? 0.46 : 0.92,
                          }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

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
                          'absolute flex h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition duration-300',
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
                        <span
                          className="flex h-[44px] w-[44px] items-center justify-center rounded-full border bg-[rgba(7,9,20,0.95)] font-display text-[0.42rem] uppercase tracking-[0.14em]"
                          style={{
                            color: isActive ? '#ffffff' : branchStyle.accent,
                            borderColor: isActive ? branchStyle.accent : `${branchStyle.accent}66`,
                          }}
                        >
                          {skill.shortLabel ?? skill.icon}
                        </span>
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
