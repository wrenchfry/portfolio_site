import { useState, useMemo, useRef, useEffect } from 'react';
import { SectionHeading } from '../layout/SectionHeading';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3-force';
import type { SkillNode } from '../../types/portfolio';

const branchColors: Record<string, string> = {
  languages: '#6fd8ff',
  web: '#24ff95',
  backend: '#ffd84a',
  cloud: '#c48cff',
  databases: '#ff9a61',
  tools: '#ff6d90',
  concepts: '#7fa2ff',
};

const sourceColors: Record<string, string> = {
  'self-taught': '#00ffd0',
  school: '#ff4d6d',
};

type GraphNode = SkillNode & {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type GraphLink = {
  source: string;
  target: string;
};

export function SkillTreeSection({ skills }: { skills: SkillNode[] }) {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  // Resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  
  const graphData = useMemo(() => {
    const branches = Array.from(new Set(skills.map(s => s.branch)));
    const radius = 220;

    const branchPositions: Record<string, { x: number; y: number }> = {};
    const branchCounts: Record<string, number> = {};

    branches.forEach((branch, index) => {
      const angle = (index / Math.max(branches.length, 1)) * 2 * Math.PI;
      branchPositions[branch] = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
      branchCounts[branch] = 0;
    });

    const nodes: GraphNode[] = skills.map(skill => {
      const base = branchPositions[skill.branch] ?? { x: 0, y: 0 };
      const indexInBranch = branchCounts[skill.branch] ?? 0;
      branchCounts[skill.branch] = indexInBranch + 1;

      const ring = Math.floor(indexInBranch / 5);
      const angle = ((indexInBranch % 5) * 2 * Math.PI) / 5;

      return {
        ...skill,
        id: skill.id,
        x: base.x + Math.cos(angle) * (40 + ring * 28),
        y: base.y + Math.sin(angle) * (40 + ring * 28),
      };
    });

    const links: GraphLink[] = skills
      .filter(s => s.parentId)
      .map(s => ({
        source: s.parentId as string,
        target: s.id,
      }));

    return { nodes, links };
  }, [skills]);

  
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    fg.d3Force(
      'charge',
      d3.forceManyBody()
        .strength(-90)
        .distanceMin(20)
        .distanceMax(120)
    );

    fg.d3Force('link')
      .distance(85)
      .strength(0.6);

    fg.d3Force('center')
      .strength(0.015);

    fg.d3Force(
      'collision',
      d3.forceCollide(26)
        .strength(1)
        .iterations(2)
    );
  }, []);

  const activeSkill = skills.find(s => s.id === activeSkillId);

  return (
    <section className="section-shell" id="skill-tree">
      <SectionHeading
        kicker="Skill Tree"
        subtitle="Click a node to inspect how that branch was learned and how comfortable I am using it."
        title="Skill Tree"
      />

      <div
        ref={containerRef}
        className="w-full h-[700px] bg-black/60 rounded-2xl border border-white/10 overflow-hidden"
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeId="id"
          width={size.width}
          height={size.height}
          backgroundColor="rgba(8,10,22,0.95)"

          
          d3AlphaDecay={0.12}
          d3VelocityDecay={0.97}
          cooldownTicks={300}

          
          onNodeDrag={(node: any) => {
            node.fx = node.x;
            node.fy = node.y;
            fgRef.current?.d3AlphaTarget(0.15);
          }}

          onNodeDragEnd={(node: any) => {
            node.fx = null;
            node.fy = null;
            fgRef.current?.d3AlphaTarget(0);
          }}

          onNodeClick={(node: any) => {
            setActiveSkillId(node.id);
          }}

          nodeCanvasObject={(node: any, ctx) => {
            if (node.x == null || node.y == null) return;

            const label = node.name || node.id;
            const branchColor = branchColors[node.branch] ?? '#fff';
            const isActive = node.id === activeSkillId;

            ctx.beginPath();
            ctx.arc(node.x, node.y, isActive ? 20 : 12, 0, 2 * Math.PI);

            ctx.fillStyle = isActive ? '#232946' : `${branchColor}22`;
            ctx.shadowColor = branchColor;
            ctx.shadowBlur = isActive ? 20 : 6;
            ctx.fill();

            ctx.lineWidth = isActive ? 3 : 1.5;
            ctx.strokeStyle = branchColor;
            ctx.stroke();

            ctx.shadowBlur = 0;

            ctx.font = `${isActive ? 14 : 11}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(label, node.x, node.y);
          }}

          linkColor={(d: any) => {
            const target = d.target;
            const branch =
              typeof target === 'object' ? target.branch : undefined;
            return branchColors[branch ?? ''] || '#fff';
          }}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-ice-dim">
            Selected node
          </p>

          {activeSkill ? (
            <>
              <h3
                className="mt-4 font-display text-[0.78rem] uppercase tracking-[0.18em]"
                style={{
                  color: branchColors[activeSkill.branch ?? ''] ?? '#ffffff',
                }}
              >
                {activeSkill.name}
              </h3>

              <p
                className="mt-4 text-sm uppercase tracking-[0.22em]"
                style={{
                  color: sourceColors[activeSkill.source ?? ''] ?? '#ffffff',
                }}
              >
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
      </div>
    </section>
  );
}