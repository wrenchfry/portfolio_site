interface SectionHeadingProps {
  kicker: string
  title: string
  subtitle: string
}

export function SectionHeading({ kicker, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <p className="section-title">{kicker}</p>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-3xl font-display text-sm uppercase tracking-[0.22em] text-ice sm:text-base">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-6 text-ice-dim sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}
