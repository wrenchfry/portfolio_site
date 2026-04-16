import { useEffect, useState } from 'react'
import { fetchGithubProfile } from '../lib/github'
import type { GithubProfile } from '../types/portfolio'

interface GithubState {
  data: GithubProfile | null
  error: string | null
  status: 'loading' | 'ready' | 'error'
}

export function useGithubProfile(username: string) {
  const [state, setState] = useState<GithubState>({
    data: null,
    error: null,
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadGithubProfile() {
      try {
        const data = await fetchGithubProfile(username)

        if (!controller.signal.aborted) {
          setState({
            data,
            error: null,
            status: 'ready',
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : 'Failed to load GitHub data.',
            status: 'error',
          })
        }
      }
    }

    loadGithubProfile()

    return () => controller.abort()
  }, [username])

  return state
}
