import { useEffect, useState } from 'react'
import { buildFallbackPortfolio } from '../data/fallbackPortfolio'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { GithubProfile, PortfolioContent, SkillNode } from '../types/portfolio'

type PortfolioState = {
  content: PortfolioContent
  error: string | null
  status: 'loading' | 'ready' | 'fallback'
}

type ProfileRow = {
  name: string | null
  handle: string | null
  role: string | null
  headline: string | null
  bio: string[] | string | null
  location: string | null
  email: string | null
  github_username: string | null
  github_url: string | null
  birth_date: string | null
  availability: string | null
  hp: number | null
  xp: number | null
  level: number | null
  tags: string[] | null
}

type SkillRow = {
  id: string
  node_key: string
  name: string
  branch: SkillNode['branch']
  kind: SkillNode['kind']
  mastery: number
  description: string
  icon: string
  short_label: string | null
  source: SkillNode['source']
  experience: string | null
  parent_key: string | null
}

type QuestRow = {
  id: string
  title: string
  summary: string
  status: 'ongoing' | 'completed' | 'available'
  level: number
  stack: string[] | null
  repo_url: string | null
  live_url: string | null
  xp: number
  updated_at: string | null
}

type AchievementRow = {
  id: string
  title: string
  issuer: string
  earned_at: string
  summary: string
  icon: string
  link: string | null
}

export function usePortfolioContent(github: GithubProfile | null): PortfolioState {
  const client = supabase
  const fallback = buildFallbackPortfolio(github)
  const [state, setState] = useState<PortfolioState>({
    content: fallback,
    error: null,
    status: hasSupabaseConfig ? 'loading' : 'fallback',
  })

  useEffect(() => {
    const nextFallback = buildFallbackPortfolio(github)

    // If Supabase decides to take a tea break, the portfolio still has to clock in.
    if (!hasSupabaseConfig || !client) {
      return
    }

    const supabaseClient = client
    let cancelled = false

    async function loadSupabaseContent() {
      try {
        const [profileResult, skillsResult, questsResult, achievementsResult] = await Promise.all([
          supabaseClient.from('profiles').select('*').eq('slug', 'main').maybeSingle(),
          supabaseClient
            .from('skills')
            .select('*')
            .eq('profile_slug', 'main')
            .order('kind', { ascending: true })
            .order('mastery', { ascending: false }),
          supabaseClient
            .from('quests')
            .select('*')
            .eq('profile_slug', 'main')
            .order('level', { ascending: false }),
          supabaseClient
            .from('achievements')
            .select('*')
            .eq('profile_slug', 'main')
            .order('earned_at', { ascending: false }),
        ])

        if (cancelled) {
          return
        }

        const profile = profileResult.data as ProfileRow | null
        const skills = (skillsResult.data as SkillRow[] | null)?.map((skill) => ({
          id: skill.node_key || skill.id,
          name: skill.name,
          branch: skill.branch,
          kind: skill.kind,
          mastery: skill.mastery,
          description: skill.description,
          icon: skill.icon,
          shortLabel: skill.short_label || undefined,
          source: skill.source || undefined,
          experience: skill.experience || undefined,
          parentId: skill.parent_key || undefined,
        }))

        const quests = (questsResult.data as QuestRow[] | null)?.map((quest) => ({
          id: quest.id,
          title: quest.title,
          summary: quest.summary,
          status: quest.status,
          level: quest.level,
          stack: quest.stack ?? [],
          repoUrl: quest.repo_url || undefined,
          liveUrl: quest.live_url || undefined,
          xp: quest.xp,
          updatedAt: quest.updated_at || undefined,
          source: 'supabase' as const,
        }))

        const achievements = (achievementsResult.data as AchievementRow[] | null)?.map(
          (achievement) => ({
            id: achievement.id,
            title: achievement.title,
            issuer: achievement.issuer,
            earnedAt: achievement.earned_at,
            summary: achievement.summary,
            icon: achievement.icon,
            link: achievement.link || undefined,
          }),
        )

        setState({
          content: {
            profile: {
              ...nextFallback.profile,
              ...(profile
                ? {
                    name: profile.name || nextFallback.profile.name,
                    handle: profile.handle || nextFallback.profile.handle,
                    role: profile.role || nextFallback.profile.role,
                    headline: profile.headline || nextFallback.profile.headline,
                    bio:
                      typeof profile.bio === 'string'
                        ? profile.bio.split(/\r?\n|\|/).filter(Boolean)
                        : profile.bio || nextFallback.profile.bio,
                    location: profile.location || nextFallback.profile.location,
                    email: profile.email || nextFallback.profile.email,
                    githubUsername:
                      profile.github_username || nextFallback.profile.githubUsername,
                    githubUrl: profile.github_url || nextFallback.profile.githubUrl,
                    birthDate: profile.birth_date || nextFallback.profile.birthDate,
                    availability: profile.availability || nextFallback.profile.availability,
                    stats: {
                      hp: profile.hp ?? nextFallback.profile.stats.hp,
                      xp: profile.xp ?? nextFallback.profile.stats.xp,
                      level: profile.level ?? nextFallback.profile.stats.level,
                    },
                    tags: profile.tags || nextFallback.profile.tags,
                  }
                : {}),
            },
            skills: skills?.length ? skills : nextFallback.skills,
            quests: quests?.length ? quests : nextFallback.quests,
            achievements: achievements?.length ? achievements : nextFallback.achievements,
          },
          error: null,
          status: 'ready',
        })
      } catch (error) {
        if (!cancelled) {
          setState({
            content: nextFallback,
            error:
              error instanceof Error
                ? error.message
                : 'Supabase was unavailable, so fallback content took the wheel.',
            status: 'fallback',
          })
        }
      }
    }

    loadSupabaseContent()

    return () => {
      cancelled = true
    }
  }, [client, github])

  return {
    ...state,
    content: state.status === 'ready' ? state.content : fallback,
  }
}
