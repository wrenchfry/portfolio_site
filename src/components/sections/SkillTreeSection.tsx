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
    root: { x: 120, y: 112 },
    title: { x: 112, y: 186 },
    titleAlign: 'left',
    titleLines: ['Programming', 'Languages'],
    nodes: {
      haxe: { point: { x: 82, y: 48 }, via: [{ x: 110, y: 78 }, { x: 92, y: 56 }] },
      python: { point: { x: 170, y: 54 }, via: [{ x: 128, y: 76 }, { x: 148, y: 58 }] },
      csharp: { point: { x: 258, y: 108 }, via: [{ x: 162, y: 102 }, { x: 212, y: 104 }] },
      java: { point: { x: 76, y: 182 }, via: [{ x: 114, y: 144 }, { x: 88, y: 170 }] },
      javascript: {
        point: { x: 270, y: 178 },
        via: [{ x: 154, y: 142 }, { x: 214, y: 158 }],
      },
      typescript: {
        point: { x: 212, y: 216 },
        via: [{ x: 148, y: 154 }, { x: 186, y: 194 }],
      },
    },
  },
  web: {
    root: { x: 230, y: 236 },
    title: { x: 232, y: 336 },
    titleAlign: 'left',
    titleLines: ['Web Tech &', 'Frameworks'],
    nodes: {
      react: { point: { x: 188, y: 186 }, via: [{ x: 208, y: 208 }] },
      html: { point: { x: 286, y: 182 }, via: [{ x: 248, y: 196 }] },
      css: { point: { x: 346, y: 238 }, via: [{ x: 286, y: 232 }] },
      nodejs: { point: { x: 154, y: 320 }, via: [{ x: 188, y: 286 }] },
      tailwind: { point: { x: 358, y: 314 }, via: [{ x: 296, y: 270 }] },
      mantine: { point: { x: 258, y: 390 }, via: [{ x: 234, y: 306 }] },
    },
  },
  tools: {
    root: { x: 118, y: 474 },
    title: { x: 124, y: 548 },
    titleAlign: 'left',
    titleLines: ['Tools &', 'Platforms'],
    nodes: {
      'git-github': { point: { x: 224, y: 432 }, via: [{ x: 158, y: 452 }] },
      'azure-platform': { point: { x: 210, y: 532 }, via: [{ x: 156, y: 500 }] },
    },
  },
  backend: {
    root: { x: 502, y: 124 },
    title: { x: 500, y: 198 },
    titleAlign: 'center',
    titleLines: ['Backend & API'],
    nodes: {
      'dotnet-core': { point: { x: 438, y: 54 }, via: [{ x: 472, y: 88 }] },
      'aspnet-core': { point: { x: 568, y: 56 }, via: [{ x: 530, y: 84 }] },
      json: { point: { x: 640, y: 116 }, via: [{ x: 576, y: 110 }] },
      'rest-apis': { point: { x: 424, y: 170 }, via: [{ x: 458, y: 144 }] },
      'client-server': { point: { x: 572, y: 182 }, via: [{ x: 528, y: 164 }] },
      'auth-basic': { point: { x: 510, y: 252 }, via: [{ x: 504, y: 176 }] },
    },
  },
  databases: {
    root: { x: 822, y: 118 },
    title: { x: 826, y: 196 },
    titleAlign: 'center',
    titleLines: ['Databases'],
    nodes: {
      sql: { point: { x: 760, y: 56 }, via: [{ x: 792, y: 86 }] },
      'relational-databases': { point: { x: 904, y: 60 }, via: [{ x: 848, y: 84 }] },
      'azure-sql': { point: { x: 748, y: 208 }, via: [{ x: 782, y: 164 }] },
      crud: { point: { x: 904, y: 208 }, via: [{ x: 852, y: 166 }] },
    },
  },
  concepts: {
    root: { x: 520, y: 390 },
    title: { x: 522, y: 480 },
    titleAlign: 'center',
    titleLines: ['Concepts'],
    nodes: {
      oop: { point: { x: 432, y: 288 }, via: [{ x: 472, y: 338 }] },
      debugging: { point: { x: 524, y: 272 }, via: [{ x: 520, y: 332 }] },
      'system-architecture': { point: { x: 650, y: 314 }, via: [{ x: 584, y: 340 }] },
      'data-analytics': { point: { x: 440, y: 548 }, via: [{ x: 482, y: 470 }] },
      'secure-coding': { point: { x: 522, y: 562 }, via: [{ x: 520, y: 492 }] },
      'security-fundamentals': { point: { x: 646, y: 524 }, via: [{ x: 584, y: 470 }] },
    },
  },
  cloud: {
    root: { x: 846, y: 432 },
    title: { x: 850, y: 504 },
    titleAlign: 'center',
    titleLines: ['Cloud & DevOps'],
    nodes: {
      'azure-services': { point: { x: 770, y: 346 }, via: [{ x: 810, y: 396 }] },
      'azure-portal': { point: { x: 926, y: 350 }, via: [{ x: 880, y: 394 }] },
      'deployment-hosting': { point: { x: 926, y: 550 }, via: [{ x: 882, y: 478 }] },
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
                        'absolute flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-black/75 text-center transition duration-300',
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
                        className="font-display text-[0.62rem] uppercase tracking-[0.18em]"
                        style={{ color: branchStyle.accent }}
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
                          'absolute flex h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[rgba(7,9,20,0.95)] transition duration-300',
                          branchDimmed && 'opacity-38',
                        )}
                        key={skill.id}
                        onClick={() => setActiveSkillId(skill.id)}
                        style={{
                          ...positionAsPercent(slot.point),
                          borderColor: isActive ? branchStyle.accent : `${branchStyle.accent}66`,
                          boxShadow: isActive
                            ? `0 0 24px ${branchStyle.glow}`
                            : `0 0 14px rgba(0, 0, 0, 0.38)`,
                        }}
                        type="button"
                      >
                        <span
                          className="font-display text-[0.42rem] uppercase tracking-[0.14em]"
                          style={{ color: isActive ? '#ffffff' : branchStyle.accent }}
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
