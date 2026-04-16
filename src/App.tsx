import { BootSequence } from './components/layout/BootSequence'
import { SiteHeader } from './components/layout/SiteHeader'
import { AchievementsSection } from './components/sections/AchievementsSection'
import { ContactSection } from './components/sections/ContactSection'
import { GithubSection } from './components/sections/GithubSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProfileSection } from './components/sections/ProfileSection'
import { QuestLogSection } from './components/sections/QuestLogSection'
import { SkillTreeSection } from './components/sections/SkillTreeSection'
import { useBootSequence } from './hooks/useBootSequence'
import { useGithubProfile } from './hooks/useGithubProfile'
import { usePortfolioContent } from './hooks/usePortfolioContent'
import { useTypewriter } from './hooks/useTypewriter'

const bootMessages = [
  '> INITIALIZING PORTFOLIO...',
  '> LOADING PIXEL ENGINE... OK',
  '> MOUNTING SKILL TREE... OK',
  '> CONNECTING GITHUB API... OK',
  '> ALL SYSTEMS NOMINAL',
]

const heroPhrases = [
  'Building cool things for people.',
  'Shipping apps, bots, and side quests.',
  'Turning ideas into something playable.',
  'Commit. Push. Repeat.',
]

function App() {
  const github = useGithubProfile('wrenchfry')
  const { content } = usePortfolioContent(github.data)
  const boot = useBootSequence(bootMessages)
  const typewriter = useTypewriter(heroPhrases)

  return (
    <div className="min-h-screen bg-night text-ice">
      <BootSequence lines={boot.lines} visible={boot.visible} />
      <SiteHeader handle={content.profile.handle} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <HeroSection
          achievementCount={content.achievements.length}
          github={github}
          profile={content.profile}
          questCount={content.quests.length}
          typewriter={typewriter}
        />
        <ProfileSection profile={content.profile} />
        <SkillTreeSection skills={content.skills} />
        <QuestLogSection quests={content.quests} />
        <AchievementsSection achievements={content.achievements} />
        <GithubSection github={github} />
        <ContactSection profile={content.profile} />
      </main>

      <footer className="border-t border-neon-cyan/20 bg-black/40 px-4 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-ice-dim sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[0.55rem] uppercase tracking-[0.32em] text-neon-gold">
            {content.profile.name}
          </p>
          <p>{new Date().getFullYear()} portfolio</p>
        </div>
      </footer>
    </div>
  )
}

export default App
