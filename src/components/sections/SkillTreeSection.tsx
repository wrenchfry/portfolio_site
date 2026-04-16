import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '../layout/SectionHeading'
import { cn } from '../../lib/utils'
import type { SkillBranch, SkillNode } from '../../types/portfolio'

interface SkillTreeSectionProps {
  skills: SkillNode[]
}

type Point = {
  x: number
  y: number
}

const branchTheme: Record<
  SkillBranch,
  {
    stroke: string
    glow: string
    softGlow: string
    ring: string
    label: string
    panel: string
  }
> = {
  languages: {
    stroke: '#6fd8ff',
    glow: 'rgba(111, 216, 255, 0.2)',
    softGlow: 'rgba(111, 216, 255, 0.12)',
    ring: 'ring-[#6fd8ff]/70',
    label: 'text-[#6fd8ff]',
    panel: 'border-[#6fd8ff]/30 bg-[#6fd8ff]/10',
  },
  web: {
    stroke: '#24ff95',
    glow: 'rgba(36, 255, 149, 0.2)',
    softGlow: 'rgba(36, 255, 149, 0.12)',
    ring: 'ring-[#24ff95]/70',
    label: 'text-[#24ff95]',
    panel: 'border-[#24ff95]/30 bg-[#24ff95]/10',
  },
  backend: {
    stroke: '#ffd84a',
    glow: 'rgba(255, 216, 74, 0.22)',
    softGlow: 'rgba(255, 216, 74, 0.12)',
    ring: 'ring-[#ffd84a]/70',
    label: 'text-[#ffd84a]',
    panel: 'border-[#ffd84a]/30 bg-[#ffd84a]/10',
  },
  cloud: {
    stroke: '#c48cff',
    glow: 'rgba(196, 140, 255, 0.22)',
    softGlow: 'rgba(196, 140, 255, 0.12)',
    ring: 'ring-[#c48cff]/70',
    label: 'text-[#c48cff]',
    panel: 'border-[#c48cff]/30 bg-[#c48cff]/10',
  },
  databases: {
    stroke: '#ff9a61',
    glow: 'rgba(255, 154, 97, 0.2)',
    softGlow: 'rgba(255, 154, 97, 0.12)',
    ring: 'ring-[#ff9a61]/70',
    label: 'text-[#ff9a61]',
    panel: 'border-[#ff9a61]/30 bg-[#ff9a61]/10',
  },
  tools: {
    stroke: '#ff6d90',
    glow: 'rgba(255, 109, 144, 0.2)',
    softGlow: 'rgba(255, 109, 144, 0.12)',
    ring: 'ring-[#ff6d90]/70',
    label: 'text-[#ff6d90]',
    panel: 'border-[#ff6d90]/30 bg-[#ff6d90]/10',
  },
  concepts: {
    stroke: '#7fa2ff',
    glow: 'rgba(127, 162, 255, 0.22)',
    softGlow: 'rgba(127, 162, 255, 0.12)',
    ring: 'ring-[#7fa2ff]/70',
    label: 'text-[#7fa2ff]',
    panel: 'border-[#7fa2ff]/30 bg-[#7fa2ff]/10',
  },
}

const layout: Record<string, { root: Point; children: Record<string, Point> }> = {
  'programming-languages': {
    root: { x: 16, y: 18 },
    children: {
      java: { x: 10, y: 30 },
      python: { x: 17, y: 6 },
      csharp: { x: 29, y: 11 },
      javascript: { x: 29, y: 23 },
      typescript: { x: 24, y: 34 },
      haxe: { x: 10, y: 8 },
    },
  },
  'web-tech-frameworks': {
    root: { x: 28, y: 40 },
    children: {
      react: { x: 20, y: 30 },
      nodejs: { x: 14, y: 42 },
      html: { x: 27, y: 26 },
      css: { x: 39, y: 28 },
      tailwind: { x: 40, y: 42 },
      mantine: { x: 31, y: 55 },
    },
  },
  'tools-platforms': {
    root: { x: 12, y: 72 },
    children: {
      'git-github': { x: 6, y: 62 },
      'azure-platform': { x: 25, y: 67 },
    },
  },
  'backend-apis': {
    root: { x: 56, y: 24 },
    children: {
      'dotnet-core': { x: 48, y: 12 },
      'aspnet-core': { x: 61, y: 10 },
      'rest-apis': { x: 46, y: 25 },
      json: { x: 66, y: 22 },
      'client-server': { x: 50, y: 36 },
      'auth-basic': { x: 62, y: 37 },
    },
  },
  databases: {
    root: { x: 83, y: 25 },
    children: {
      sql: { x: 76, y: 15 },
      'relational-databases': { x: 92, y: 14 },
      crud: { x: 90, y: 38 },
      'azure-sql': { x: 76, y: 38 },
    },
  },
  concepts: {
    root: { x: 54, y: 69 },
    children: {
      oop: { x: 47, y: 57 },
      debugging: { x: 56, y: 49 },
      'system-architecture': { x: 66, y: 58 },
      'data-analytics': { x: 44, y: 82 },
      'secure-coding': { x: 54, y: 88 },
      'security-fundamentals': { x: 66, y: 80 },
    },
  },
  'cloud-devops': {
    root: { x: 79, y: 63 },
    children: {
      'azure-services': { x: 71, y: 53 },
      'azure-portal': { x: 85, y: 53 },
      'deployment-hosting': { x: 89, y: 77 },
    },
  },
}

function curvePath(from: Point, to: Point) {
  const direction = to.x >= from.x ? 1 : -1
  const controlOffset = Math.max(Math.abs(to.x - from.x) * 0.35, 4)
  const firstControlX = from.x + controlOffset * direction
  const secondControlX = to.x - controlOffset * direction

  return `M ${from.x} ${from.y} C ${firstControlX} ${from.y}, ${secondControlX} ${to.y}, ${to.x} ${to.y}`
}

export function SkillTreeSection({ skills }: SkillTreeSectionProps) {
  const rootNodes = skills.filter((skill) => skill.kind === 'root')
  const skillNodes = skills.filter((skill) => skill.kind === 'skill')
  const [activeSkillId, setActiveSkillId] = useState('')

  const activeSkill = skillNodes.find((skill) => skill.id === activeSkillId)
  const activeRoot = rootNodes.find((root) => root.id === activeSkill?.parentId)

  return (
    <section className="section-shell" id="skill-tree">
      <SectionHeading
        kicker="Skill Tree"
        subtitle="Click a node to inspect how that branch was learned and how comfortable I am using it."
        title="Skill Tree"
      />

      <div className="hidden gap-6 lg:grid">
        <div className="relative min-h-[52rem] overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_18%_28%,rgba(36,255,149,0.1),transparent_24%),radial-gradient(circle_at_55%_18%,rgba(255,216,74,0.1),transparent_26%),radial-gradient(circle_at_82%_24%,rgba(255,154,97,0.12),transparent_24%),radial-gradient(circle_at_56%_74%,rgba(127,162,255,0.12),transparent_26%),linear-gradient(180deg,rgba(8,10,22,0.95),rgba(5,6,15,0.97))] px-6 py-8">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {rootNodes.map((root) => {
              const rootLayout = layout[root.id]

              if (!rootLayout) {
                return null
              }

              return (
                <g key={root.id}>
                  {Object.entries(rootLayout.children).map(([childId, childPoint]) => {
                    const child = skillNodes.find((skill) => skill.id === childId)

                    if (!child) {
                      return null
                    }

                    return (
                      <motion.path
                        animate={{ opacity: 1, pathLength: 1 }}
                        d={curvePath(rootLayout.root, childPoint)}
                        fill="none"
                        initial={{ opacity: 0, pathLength: 0 }}
                        key={`${root.id}-${child.id}`}
                        stroke={branchTheme[root.branch].stroke}
                        strokeLinecap="round"
                        strokeWidth={activeSkill?.id === child.id ? 0.95 : 0.72}
                        transition={{ duration: 0.55 }}
                      />
                    )
                  })}
                </g>
              )
            })}
          </svg>

          <div className="relative h-[52rem] w-full">
            {rootNodes.map((root) => {
              const rootLayout = layout[root.id]

              if (!rootLayout) {
                return null
              }

              return (
                <div key={root.id}>
                  <div
                    className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{
                      left: `${rootLayout.root.x}%`,
                      top: `${rootLayout.root.y}%`,
                      backgroundColor: branchTheme[root.branch].softGlow,
                    }}
                  />
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{ left: `${rootLayout.root.x}%`, top: `${rootLayout.root.y}%` }}
                  >
                    <div
                      className="grid h-[4.75rem] w-[4.75rem] place-items-center rounded-full border bg-black/55 text-[0.72rem] font-display uppercase tracking-[0.18em] text-ice backdrop-blur"
                      style={{
                        borderColor: `${branchTheme[root.branch].stroke}55`,
                        boxShadow: `0 0 26px ${branchTheme[root.branch].glow}`,
                      }}
                    >
                      {root.icon}
                    </div>
                    <div className="mt-4 max-w-[12rem]">
                      <p className={cn('text-[0.64rem] uppercase tracking-[0.28em]', branchTheme[root.branch].label)}>
                        {root.name}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {skillNodes.map((skill, index) => {
              const parentLayout = skill.parentId ? layout[skill.parentId] : null
              const point = skill.parentId ? parentLayout?.children[skill.id] : null

              if (!point) {
                return null
              }

              return (
                <motion.button
                  className={cn(
                    'absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-black/70 text-[0.56rem] font-display uppercase tracking-[0.14em] text-ice backdrop-blur transition',
                    activeSkill?.id === skill.id ? `ring-4 ${branchTheme[skill.branch].ring}` : '',
                  )}
                  initial={{ opacity: 0, scale: 0.82 }}
                  key={skill.id}
                  onClick={() => setActiveSkillId(skill.id)}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    borderColor: `${branchTheme[skill.branch].stroke}55`,
                    boxShadow:
                      activeSkill?.id === skill.id
                        ? `0 0 24px ${branchTheme[skill.branch].glow}`
                        : `0 0 18px rgba(0, 0, 0, 0.28)`,
                  }}
                  transition={{ delay: index * 0.02, duration: 0.28 }}
                  type="button"
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {skill.shortLabel || skill.icon}
                </motion.button>
              )
            })}
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35 }}
        >
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">Selected node</p>
            {activeSkill ? (
              <>
                <h3 className="mt-4 font-display text-[0.78rem] uppercase leading-6 tracking-[0.18em] text-ice">
                  {activeSkill.name}
                </h3>
                <p className={cn('mt-4 text-sm uppercase tracking-[0.22em]', branchTheme[activeSkill.branch].label)}>
                  {activeSkill.source}
                </p>
                <p className="mt-4 text-base leading-7 text-ice">
                  {activeSkill.experience}
                </p>
              </>
            ) : (
              <p className="mt-4 text-base leading-7 text-ice-dim">
                Click a node in the tree to inspect the skill details.
              </p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">Branch overview</p>
            {activeRoot ? (
              <>
                <h3 className="mt-4 font-display text-[0.78rem] uppercase leading-6 tracking-[0.18em] text-ice">
                  {activeRoot.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-ice">
                  {activeRoot.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {skillNodes
                    .filter((skill) => skill.parentId === activeRoot.id)
                    .map((skill) => (
                      <span
                        className={cn(
                          'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] text-ice',
                          branchTheme[skill.branch].panel,
                        )}
                        key={skill.id}
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-base leading-7 text-ice-dim">
                Choose a node to load the matching branch summary.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {rootNodes.map((root) => {
          const branchSkills = skillNodes.filter((skill) => skill.parentId === root.id)

          return (
            <article
              className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
              key={root.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={cn('text-xs uppercase tracking-[0.22em]', branchTheme[root.branch].label)}>
                    {root.name}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ice-dim">{root.description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-ice">
                  {root.icon}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {branchSkills.map((skill) => (
                  <button
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] text-ice transition',
                      branchTheme[skill.branch].panel,
                    )}
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    type="button"
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </article>
          )
        })}

        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">Selected node</p>
          {activeSkill ? (
            <>
              <h3 className="mt-4 font-display text-[0.74rem] uppercase leading-6 tracking-[0.18em] text-ice">
                {activeSkill.name}
              </h3>
              <p className={cn('mt-4 text-xs uppercase tracking-[0.22em]', branchTheme[activeSkill.branch].label)}>
                {activeSkill.source}
              </p>
              <p className="mt-4 text-base leading-7 text-ice">{activeSkill.experience}</p>
            </>
          ) : (
            <p className="mt-4 text-base leading-7 text-ice-dim">
              Tap a node to inspect the skill details.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
