const navItems = [
  { href: '#about', label: 'about' },
  { href: '#skill-tree', label: 'skill tree' },
  { href: '#quests', label: 'quests' },
  { href: '#achievements', label: 'achievements' },
  { href: '#github', label: 'github' },
  { href: '#contact', label: 'contact' },
]

interface SiteHeaderProps {
  handle: string
}

export function SiteHeader({ handle }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-neon-green/20 bg-night/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="font-display text-[0.55rem] uppercase tracking-[0.34em] text-neon-green">
            Lesego Sindani
          </p>
          <p className="truncate text-xs uppercase tracking-[0.24em] text-ice-dim">
            {handle}
          </p>
        </div>
        <nav className="flex max-w-[70vw] gap-2 overflow-x-auto pb-1 text-xs uppercase tracking-[0.24em] text-ice-dim">
          {navItems.map((item) => (
            <a
              className="rounded-full border border-transparent px-3 py-2 transition hover:border-neon-green/30 hover:text-neon-green"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
