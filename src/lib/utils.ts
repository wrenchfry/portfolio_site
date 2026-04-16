export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function formatShortNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatMonthYear(value?: string | null) {
  if (!value) {
    return 'Unknown patch cycle'
  }

  return new Intl.DateTimeFormat('en-ZA', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function daysSince(value?: string | null) {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  const today = new Date()
  const date = new Date(value)
  const difference = today.getTime() - date.getTime()
  return Math.floor(difference / (1000 * 60 * 60 * 24))
}

interface BirthdayStats {
  age: number
  ageProgress: number
  xpProgress: number
  isBirthday: boolean
  daysUntilBirthday: number
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getBirthdayStats(birthDate: string, reference = new Date()): BirthdayStats {
  const birth = new Date(birthDate)
  const today = startOfDay(reference)
  const birthdayThisYear = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  )

  const isBirthday = today.getTime() === birthdayThisYear.getTime()
  const hasHadBirthday = today.getTime() >= birthdayThisYear.getTime()
  const age =
    today.getFullYear() -
    birth.getFullYear() -
    (hasHadBirthday ? 0 : 1)

  const lastBirthday = hasHadBirthday
    ? birthdayThisYear
    : new Date(today.getFullYear() - 1, birth.getMonth(), birth.getDate())

  const upcomingBirthday = hasHadBirthday && !isBirthday
    ? new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate())
    : birthdayThisYear

  const cycleEnd = isBirthday
    ? new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate())
    : upcomingBirthday

  const cycleDuration = cycleEnd.getTime() - lastBirthday.getTime()
  const cycleElapsed = isBirthday
    ? cycleDuration
    : today.getTime() - lastBirthday.getTime()

  return {
    age,
    ageProgress: clamp(age, 0, 100),
    xpProgress: isBirthday
      ? 100
      : clamp(Math.round((cycleElapsed / cycleDuration) * 100), 0, 99),
    isBirthday,
    daysUntilBirthday: isBirthday
      ? 0
      : Math.ceil(
          (upcomingBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        ),
  }
}
