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
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-display text-[0.55rem] uppercase tracking-[0.34em] text-neon-green">
            Lesego Sindani
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-ice-dim">
            {handle}
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-ice-dim md:max-w-[70vw] md:justify-end md:text-xs md:tracking-[0.24em]">
          {navItems.map((item) => (
            <a
              className="rounded-full border border-transparent px-2.5 py-1.5 transition hover:border-neon-green/30 hover:text-neon-green md:px-3 md:py-2"
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
