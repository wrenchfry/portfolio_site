export type QuestStatus = 'ongoing' | 'completed' | 'available'

export interface SiteProfile {
  name: string
  handle: string
  role: string
  headline: string
  bio: string[]
  location: string
  email: string
  githubUsername: string
  githubUrl: string
  birthDate: string
  availability: string
  stats: {
    hp: number
    xp: number
    level: number
  }
  tags: string[]
}

export type SkillBranch =
  | 'languages'
  | 'web'
  | 'backend'
  | 'cloud'
  | 'databases'
  | 'tools'
  | 'concepts'

export type SkillSource = 'Self taught' | 'School'

export interface SkillNode {
  id: string
  name: string
  branch: SkillBranch
  kind: 'root' | 'skill'
  mastery: number
  description: string
  icon: string
  shortLabel?: string
  source?: SkillSource
  experience?: string
  parentId?: string
}

export interface QuestCard {
  id: string
  title: string
  summary: string
  status: QuestStatus
  level: number
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  xp: number
  updatedAt?: string
  source: 'supabase' | 'github'
}

export interface AchievementCard {
  id: string
  title: string
  issuer: string
  earnedAt: string
  summary: string
  icon: string
  link?: string
}

export interface RepoSummary {
  id: number
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  homepage: string | null
  updatedAt: string
  pushedAt: string
  archived: boolean
  fork: boolean
  size: number
}

export interface GithubProfile {
  login: string
  name: string
  bio: string
  avatarUrl: string
  htmlUrl: string
  location: string
  followers: number
  following: number
  publicRepos: number
  totalStars: number
  hireable: boolean
  repos: RepoSummary[]
}

export interface PortfolioContent {
  profile: SiteProfile
  skills: SkillNode[]
  quests: QuestCard[]
  achievements: AchievementCard[]
}
