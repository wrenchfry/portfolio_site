import { clamp, daysSince } from '../lib/utils'
import type {
  AchievementCard,
  GithubProfile,
  PortfolioContent,
  QuestCard,
  QuestStatus,
  RepoSummary,
  SkillBranch,
  SkillNode,
  SkillSource,
} from '../types/portfolio'

type SkillSeed = {
  id: string
  name: string
  branch: SkillBranch
  shortLabel: string
  mastery: number
  source: SkillSource
  experience: string
}

function branchRoot(
  id: string,
  name: string,
  branch: SkillBranch,
  icon: string,
  description: string,
): SkillNode {
  return {
    id,
    name,
    branch,
    kind: 'root',
    mastery: 100,
    icon,
    description,
  }
}

function skillNode(parentId: string, skill: SkillSeed): SkillNode {
  return {
    id: skill.id,
    name: skill.name,
    branch: skill.branch,
    kind: 'skill',
    mastery: skill.mastery,
    icon: skill.shortLabel,
    shortLabel: skill.shortLabel,
    description: skill.experience,
    source: skill.source,
    experience: skill.experience,
    parentId,
  }
}

function buildSkillTree(): SkillNode[] {
  const roots = [
    branchRoot(
      'programming-languages',
      'Programming Languages',
      'languages',
      'PL',
      'Languages I use across coursework, experiments, and practical application builds.',
    ),
    branchRoot(
      'web-tech-frameworks',
      'Web Tech & Frameworks',
      'web',
      'WEB',
      'UI foundations and frontend tools I reach for when I want the interface to feel intentional.',
    ),
    branchRoot(
      'backend-apis',
      'Backend & APIs',
      'backend',
      'API',
      'Server-side fundamentals, app communication, and backend patterns I am actively growing.',
    ),
    branchRoot(
      'cloud-devops',
      'Cloud & DevOps',
      'cloud',
      'CLD',
      'Deployment, hosting, and cloud platform experience centered around Azure.',
    ),
    branchRoot(
      'databases',
      'Databases',
      'databases',
      'DB',
      'Relational data fundamentals, CRUD flows, and the database side of app development.',
    ),
    branchRoot(
      'tools-platforms',
      'Tools & Platforms',
      'tools',
      'OPS',
      'The platforms and day-to-day tooling that keep projects moving and versioned properly.',
    ),
    branchRoot(
      'concepts',
      'Concepts',
      'concepts',
      'SYS',
      'Foundational ideas that shape how I design, debug, and reason about software.',
    ),
  ]

  const skills = [
    skillNode('programming-languages', {
      id: 'java',
      name: 'Java',
      branch: 'languages',
      shortLabel: 'JV',
      mastery: 82,
      source: 'School',
      experience:
        'Comfortable with object-oriented programming and have used Java for coursework and practical class projects.',
    }),
    skillNode('programming-languages', {
      id: 'python',
      name: 'Python',
      branch: 'languages',
      shortLabel: 'PY',
      mastery: 86,
      source: 'Self taught',
      experience:
        'Very familiar and have used Python for scripting, problem solving, automation, and small application work.',
    }),
    skillNode('programming-languages', {
      id: 'csharp',
      name: 'C#',
      branch: 'languages',
      shortLabel: 'C#',
      mastery: 76,
      source: 'School',
      experience:
        'Comfortable with the fundamentals and have built coursework projects with C# in class.',
    }),
    skillNode('programming-languages', {
      id: 'javascript',
      name: 'JavaScript',
      branch: 'languages',
      shortLabel: 'JS',
      mastery: 90,
      source: 'Self taught',
      experience:
        'Very comfortable and have used JavaScript across interactive frontend projects and web experiments.',
    }),
    skillNode('programming-languages', {
      id: 'typescript',
      name: 'TypeScript',
      branch: 'languages',
      shortLabel: 'TS',
      mastery: 88,
      source: 'Self taught',
      experience:
        'Comfortable building typed frontend applications and enjoy the structure it adds to growing codebases.',
    }),
    skillNode('programming-languages', {
      id: 'haxe',
      name: 'Haxe',
      branch: 'languages',
      shortLabel: 'HX',
      mastery: 62,
      source: 'Self taught',
      experience:
        'Relatively new, but I am comfortable experimenting with it and learning how it fits different build workflows.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'react',
      name: 'React',
      branch: 'web',
      shortLabel: 'RE',
      mastery: 90,
      source: 'Self taught',
      experience:
        'Comfortable and have built several application interfaces with React, especially for interactive web projects.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'nodejs',
      name: 'Node.js',
      branch: 'web',
      shortLabel: 'ND',
      mastery: 78,
      source: 'Self taught',
      experience:
        'Comfortable building simple backend services and project tooling, and still expanding into more advanced patterns.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'html',
      name: 'HTML',
      branch: 'web',
      shortLabel: 'HT',
      mastery: 86,
      source: 'School',
      experience:
        'Very comfortable structuring interfaces and building clean semantic page layouts from scratch.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'css',
      name: 'CSS',
      branch: 'web',
      shortLabel: 'CS',
      mastery: 82,
      source: 'School',
      experience:
        'Comfortable styling responsive interfaces and refining layout details so the UI feels polished.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'tailwind',
      name: 'Tailwind',
      branch: 'web',
      shortLabel: 'TW',
      mastery: 88,
      source: 'Self taught',
      experience:
        'Very comfortable building polished interfaces quickly with Tailwind and layering in custom visuals when needed.',
    }),
    skillNode('web-tech-frameworks', {
      id: 'mantine',
      name: 'Mantine UI',
      branch: 'web',
      shortLabel: 'MU',
      mastery: 68,
      source: 'Self taught',
      experience:
        'Relatively new, but comfortable using Mantine UI to speed up clean, modern interface work.',
    }),
    skillNode('backend-apis', {
      id: 'dotnet-core',
      name: '.NET (Core)',
      branch: 'backend',
      shortLabel: '.N',
      mastery: 74,
      source: 'School',
      experience:
        'Comfortable with the core foundations and have used it in class to understand structured backend development.',
    }),
    skillNode('backend-apis', {
      id: 'aspnet-core',
      name: 'ASP.NET Core',
      branch: 'backend',
      shortLabel: 'AS',
      mastery: 72,
      source: 'School',
      experience:
        'Comfortable building coursework projects with ASP.NET Core and learning common web application patterns.',
    }),
    skillNode('backend-apis', {
      id: 'rest-apis',
      name: 'RESTful APIs',
      branch: 'backend',
      shortLabel: 'RS',
      mastery: 79,
      source: 'School',
      experience:
        'Comfortable designing and consuming API endpoints for applications that need clear client-server communication.',
    }),
    skillNode('backend-apis', {
      id: 'json',
      name: 'JSON',
      branch: 'backend',
      shortLabel: 'JSN',
      mastery: 84,
      source: 'School',
      experience:
        'Very comfortable working with JSON for API payloads, configuration, and general data exchange.',
    }),
    skillNode('backend-apis', {
      id: 'client-server',
      name: 'Client-Server Architecture',
      branch: 'backend',
      shortLabel: 'C/S',
      mastery: 71,
      source: 'School',
      experience:
        'Comfortable with the basic architecture and how responsibilities are split between the client and backend.',
    }),
    skillNode('backend-apis', {
      id: 'auth-basic',
      name: 'Authentication (basic)',
      branch: 'backend',
      shortLabel: 'AU',
      mastery: 63,
      source: 'School',
      experience:
        'Familiar with basic authentication flows and the fundamentals of protecting routes and access points.',
    }),
    skillNode('cloud-devops', {
      id: 'azure-services',
      name: 'Microsoft Azure',
      branch: 'cloud',
      shortLabel: 'AZ',
      mastery: 77,
      source: 'School',
      experience:
        'Comfortable working with Azure App Services, Azure SQL Database, resource groups, and deployment basics in class.',
    }),
    skillNode('cloud-devops', {
      id: 'azure-portal',
      name: 'Azure Portal Management',
      branch: 'cloud',
      shortLabel: 'AP',
      mastery: 73,
      source: 'School',
      experience:
        'Comfortable navigating the Azure Portal and managing the services needed to keep student projects deployed.',
    }),
    skillNode('cloud-devops', {
      id: 'deployment-hosting',
      name: 'Deployment & Hosting',
      branch: 'cloud',
      shortLabel: 'DH',
      mastery: 70,
      source: 'School',
      experience:
        'Comfortable with the basics of publishing applications and understanding the hosting flow from build to deploy.',
    }),
    skillNode('databases', {
      id: 'sql',
      name: 'SQL (basic)',
      branch: 'databases',
      shortLabel: 'SQL',
      mastery: 70,
      source: 'School',
      experience:
        'Comfortable with basic SQL queries, table relationships, and working with structured relational data.',
    }),
    skillNode('databases', {
      id: 'relational-databases',
      name: 'Relational Databases',
      branch: 'databases',
      shortLabel: 'RDB',
      mastery: 68,
      source: 'School',
      experience:
        'Comfortable with core relational database ideas and how records, tables, and relationships fit together.',
    }),
    skillNode('databases', {
      id: 'crud',
      name: 'CRUD Operations',
      branch: 'databases',
      shortLabel: 'CR',
      mastery: 76,
      source: 'School',
      experience:
        'Comfortable building create, read, update, and delete flows as part of application coursework and practice work.',
    }),
    skillNode('databases', {
      id: 'azure-sql',
      name: 'Azure SQL',
      branch: 'databases',
      shortLabel: 'ASQ',
      mastery: 64,
      source: 'School',
      experience:
        'Familiar with Azure SQL and comfortable working with it in guided academic projects.',
    }),
    skillNode('tools-platforms', {
      id: 'git-github',
      name: 'Git/GitHub',
      branch: 'tools',
      shortLabel: 'GIT',
      mastery: 84,
      source: 'School',
      experience:
        'Comfortable using Git and GitHub for version control, project collaboration, and keeping work organised.',
    }),
    skillNode('tools-platforms', {
      id: 'azure-platform',
      name: 'Azure',
      branch: 'tools',
      shortLabel: 'AZR',
      mastery: 71,
      source: 'School',
      experience:
        'Comfortable using Azure as a working platform for deployment, management, and cloud-focused coursework.',
    }),
    skillNode('concepts', {
      id: 'oop',
      name: 'Object-Oriented Programming',
      branch: 'concepts',
      shortLabel: 'OOP',
      mastery: 83,
      source: 'School',
      experience:
        'Comfortable applying OOP concepts in class projects and using them to structure code more cleanly.',
    }),
    skillNode('concepts', {
      id: 'debugging',
      name: 'Debugging',
      branch: 'concepts',
      shortLabel: 'DBG',
      mastery: 84,
      source: 'School',
      experience:
        'Comfortable tracing issues, narrowing down causes, and fixing problems methodically instead of guessing.',
    }),
    skillNode('concepts', {
      id: 'system-architecture',
      name: 'System Architecture (basic)',
      branch: 'concepts',
      shortLabel: 'ARC',
      mastery: 66,
      source: 'School',
      experience:
        'Comfortable with the basics of system architecture and how larger application pieces connect to each other.',
    }),
    skillNode('concepts', {
      id: 'data-analytics',
      name: 'Data Analytics',
      branch: 'concepts',
      shortLabel: 'DAT',
      mastery: 69,
      source: 'School',
      experience:
        'Comfortable with foundational data analysis thinking and using data to support clearer technical decisions.',
    }),
    skillNode('concepts', {
      id: 'secure-coding',
      name: 'Secure Coding Practices',
      branch: 'concepts',
      shortLabel: 'SEC',
      mastery: 67,
      source: 'School',
      experience:
        'Comfortable with the fundamentals of writing safer code and paying attention to common security pitfalls.',
    }),
    skillNode('concepts', {
      id: 'security-fundamentals',
      name: 'Security Fundamentals',
      branch: 'concepts',
      shortLabel: 'SF',
      mastery: 65,
      source: 'School',
      experience:
        'Familiar with core security concepts and continuing to build that knowledge through coursework and practice.',
    }),
  ]

  return [...roots, ...skills]
}

function inferQuestStatus(repo: RepoSummary): QuestStatus {
  if (repo.size === 0) {
    return 'available'
  }

  if (daysSince(repo.pushedAt) <= 90) {
    return 'ongoing'
  }

  return 'completed'
}

function buildQuestFromRepo(repo: RepoSummary): QuestCard {
  const fallbackSummary =
    repo.size === 0
      ? 'Early-stage concept with the objective defined and the build still taking shape.'
      : 'Live repository pulled from GitHub.'

  return {
    id: String(repo.id),
    title: repo.name.replace(/-/g, ' '),
    summary: repo.description ?? fallbackSummary,
    status: inferQuestStatus(repo),
    level: clamp(Math.round(Math.max(repo.size, 180) / 520), 1, 10),
    stack: [repo.language, repo.homepage ? 'Deployed' : null, repo.fork ? 'Collaboration' : null]
      .filter(Boolean)
      .slice(0, 4) as string[],
    repoUrl: repo.url,
    liveUrl: repo.homepage || undefined,
    xp: clamp(Math.round(Math.max(repo.size, 120) / 22), 25, 320),
    updatedAt: repo.pushedAt,
    source: 'github',
  }
}

function buildFallbackQuests(github: GithubProfile | null): QuestCard[] {
  if (github?.repos.length) {
    return github.repos
      .filter((repo) => !repo.archived)
      .map(buildQuestFromRepo)
  }

  return [
    {
      id: 'community-safety-app',
      title: 'Community Safety App',
      summary:
        'A public-safety concept focused on helping people feel more informed, aware, and connected.',
      status: 'available',
      level: 5,
      stack: ['Planning', 'Product Thinking'],
      repoUrl: 'https://github.com/wrenchfry/Community-Safety-App',
      xp: 180,
      source: 'github',
    },
  ]
}

function buildAchievements(): AchievementCard[] {
  return [
    {
      id: 'third-year-milestone',
      title: 'Third-Year Software Engineering',
      issuer: 'Academic milestone',
      earnedAt: '2026',
      summary:
        'Currently progressing through third-year software engineering while continuing to build outside the classroom.',
      icon: 'AC',
    },
    {
      id: 'portfolio-launch',
      title: 'Portfolio Relaunch',
      issuer: 'Personal project',
      earnedAt: '2026',
      summary:
        'Rebuilt the portfolio into a live project space for showcasing work, progress, and future accomplishments.',
      icon: 'PF',
    },
    {
      id: 'public-project-work',
      title: 'Public Project Work',
      issuer: 'Development milestone',
      earnedAt: 'Ongoing',
      summary:
        'Maintaining visible project work while growing through class projects, experiments, and personal builds.',
      icon: 'PR',
    },
  ]
}

export function buildFallbackPortfolio(github: GithubProfile | null): PortfolioContent {
  return {
    profile: {
      name: 'Lesego Sindani',
      handle: '@wrenchfry',
      role: 'Software engineer and third-year student',
      headline:
        'South African student developer building cool things for people with a game-inspired edge.',
      bio: [
        "I'm a South African third-year student and software engineer, aspiring to make cool things for people.",
        'I enjoy building software that feels useful, thoughtful, and a little more alive than the average interface.',
        'Most of my recent work lives between frontend development, API-driven apps, and product ideas that solve practical problems.',
      ],
      location: github?.location || 'South Africa',
      email: 'lesegoindani@gmail.com',
      githubUsername: github?.login || 'wrenchfry',
      githubUrl: github?.htmlUrl || 'https://github.com/wrenchfry',
      birthDate: '2006-05-26',
      availability: 'Available for internships, graduate opportunities, freelance work, and interesting collaborations.',
      stats: {
        hp: 92,
        xp: 0,
        level: 19,
      },
      tags: [
        'Interactive Frontends',
        'API-Driven Apps',
        'Cloud Learning',
        'Product Thinking',
        'Practical Problem Solving',
        'Playful Visual Design',
      ],
    },
    skills: buildSkillTree(),
    quests: buildFallbackQuests(github),
    achievements: buildAchievements(),
  }
}
