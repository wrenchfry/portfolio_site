import type { GithubProfile, RepoSummary } from '../types/portfolio'

interface GithubUserResponse {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  location: string | null
  followers: number
  following: number
  public_repos: number
  hireable: boolean | null
}

interface GithubRepoResponse {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
  pushed_at: string
  archived: boolean
  fork: boolean
  size: number
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function parseGithubError(response: Response) {
  let message = `GitHub API request failed (${response.status}).`

  try {
    const payload = (await response.json()) as { message?: string }

    if (response.status === 404) {
      return 'GitHub profile not found.'
    }

    if (
      response.status === 403 &&
      response.headers.get('x-ratelimit-remaining') === '0'
    ) {
      return 'GitHub rate limit reached. Please try again shortly.'
    }

    if (payload.message) {
      message = `GitHub API request failed: ${payload.message}`
    }
  } catch {
    return message
  }

  return message
}

export async function fetchGithubProfile(username: string): Promise<GithubProfile> {
  const [userResponse, repoResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, {
      cache: 'no-store',
      headers,
    }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`, {
      cache: 'no-store',
      headers,
    }),
  ])

  if (!userResponse.ok) {
    throw new Error(await parseGithubError(userResponse))
  }

  if (!repoResponse.ok) {
    throw new Error(await parseGithubError(repoResponse))
  }

  const user = (await userResponse.json()) as GithubUserResponse
  const repos = (await repoResponse.json()) as GithubRepoResponse[]

  const mappedRepos: RepoSummary[] = repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url,
    homepage: repo.homepage,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    archived: repo.archived,
    fork: repo.fork,
    size: repo.size,
  }))

  return {
    login: user.login,
    name: user.name ?? user.login,
    bio: user.bio ?? '',
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    location: user.location ?? 'South Africa',
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars: mappedRepos.reduce((total, repo) => total + repo.stars, 0),
    hireable: Boolean(user.hireable),
    repos: mappedRepos,
  }
}
