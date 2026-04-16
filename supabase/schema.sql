create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null default 'main',
  name text not null,
  handle text not null,
  role text not null,
  headline text not null,
  bio jsonb not null default '[]'::jsonb,
  location text not null default 'South Africa',
  email text not null,
  github_username text not null,
  github_url text not null,
  birth_date date not null default date '2006-05-26',
  availability text not null,
  hp integer not null default 92 check (hp between 0 and 100),
  xp integer not null default 0 check (xp between 0 and 100),
  level integer not null default 19 check (level between 1 and 100),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_slug text not null default 'main',
  node_key text,
  name text not null,
  branch text not null,
  kind text not null default 'skill',
  mastery integer not null check (mastery between 0 and 100),
  short_label text,
  icon text not null,
  source text,
  experience text,
  description text not null,
  parent_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  profile_slug text not null default 'main',
  title text not null,
  summary text not null,
  status text not null check (status in ('ongoing', 'completed', 'available')),
  level integer not null check (level between 1 and 10),
  stack text[] not null default '{}',
  repo_url text,
  live_url text,
  xp integer not null default 100,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_slug text not null default 'main',
  title text not null,
  issuer text not null,
  earned_at text not null,
  summary text not null,
  icon text not null,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists birth_date date not null default date '2006-05-26';

alter table public.skills
  add column if not exists node_key text,
  add column if not exists kind text not null default 'skill',
  add column if not exists short_label text,
  add column if not exists source text,
  add column if not exists experience text,
  add column if not exists parent_key text;

alter table public.skills
  drop column if exists x,
  drop column if exists y,
  drop column if exists parent_id;

alter table public.skills
  drop constraint if exists skills_branch_check,
  drop constraint if exists skills_kind_check,
  drop constraint if exists skills_source_check;

alter table public.skills
  add constraint skills_branch_check
  check (branch in ('languages', 'web', 'backend', 'cloud', 'databases', 'tools', 'concepts'));

alter table public.skills
  add constraint skills_kind_check
  check (kind in ('root', 'skill'));

alter table public.skills
  add constraint skills_source_check
  check (source is null or source in ('Self taught', 'School'));

create unique index if not exists skills_node_key_key on public.skills (node_key);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

drop trigger if exists skills_touch_updated_at on public.skills;
create trigger skills_touch_updated_at
before update on public.skills
for each row execute procedure public.touch_updated_at();

drop trigger if exists quests_touch_updated_at on public.quests;
create trigger quests_touch_updated_at
before update on public.quests
for each row execute procedure public.touch_updated_at();

drop trigger if exists achievements_touch_updated_at on public.achievements;
create trigger achievements_touch_updated_at
before update on public.achievements
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.quests enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read"
on public.profiles
for select
using (true);

drop policy if exists "skills public read" on public.skills;
create policy "skills public read"
on public.skills
for select
using (true);

drop policy if exists "quests public read" on public.quests;
create policy "quests public read"
on public.quests
for select
using (true);

drop policy if exists "achievements public read" on public.achievements;
create policy "achievements public read"
on public.achievements
for select
using (true);

insert into public.profiles (
  slug,
  name,
  handle,
  role,
  headline,
  bio,
  location,
  email,
  github_username,
  github_url,
  birth_date,
  availability,
  hp,
  xp,
  level,
  tags
) values (
  'main',
  'Lesego Sindani',
  '@wrenchfry',
  'Software engineer and third-year student',
  'South African student developer building cool things for people with a game-inspired edge.',
  '["I''m a South African third-year student and software engineer, aspiring to make cool things for people.","I enjoy building software that feels useful, thoughtful, and a little more alive than the average interface.","Most of my recent work lives between frontend development, API-driven apps, and product ideas that solve practical problems."]'::jsonb,
  'South Africa',
  'lesegoindani@gmail.com',
  'wrenchfry',
  'https://github.com/wrenchfry',
  date '2006-05-26',
  'Available for internships, graduate opportunities, freelance work, and interesting collaborations.',
  92,
  0,
  19,
  '{"Interactive Frontends","API-Driven Apps","Cloud Learning","Product Thinking","Practical Problem Solving","Playful Visual Design"}'
) on conflict (slug) do update
set
  name = excluded.name,
  handle = excluded.handle,
  role = excluded.role,
  headline = excluded.headline,
  bio = excluded.bio,
  location = excluded.location,
  email = excluded.email,
  github_username = excluded.github_username,
  github_url = excluded.github_url,
  birth_date = excluded.birth_date,
  availability = excluded.availability,
  hp = excluded.hp,
  xp = excluded.xp,
  level = excluded.level,
  tags = excluded.tags;

delete from public.skills where profile_slug = 'main';

insert into public.skills (
  profile_slug,
  node_key,
  name,
  branch,
  kind,
  mastery,
  short_label,
  icon,
  source,
  experience,
  description,
  parent_key
) values
('main', 'programming-languages', 'Programming Languages', 'languages', 'root', 100, null, 'PL', null, null, 'Languages I use across coursework, experiments, and practical application builds.', null),
('main', 'web-tech-frameworks', 'Web Tech & Frameworks', 'web', 'root', 100, null, 'WEB', null, null, 'UI foundations and frontend tools I reach for when I want the interface to feel intentional.', null),
('main', 'backend-apis', 'Backend & APIs', 'backend', 'root', 100, null, 'API', null, null, 'Server-side fundamentals, app communication, and backend patterns I am actively growing.', null),
('main', 'cloud-devops', 'Cloud & DevOps', 'cloud', 'root', 100, null, 'CLD', null, null, 'Deployment, hosting, and cloud platform experience centered around Azure.', null),
('main', 'databases', 'Databases', 'databases', 'root', 100, null, 'DB', null, null, 'Relational data fundamentals, CRUD flows, and the database side of app development.', null),
('main', 'tools-platforms', 'Tools & Platforms', 'tools', 'root', 100, null, 'OPS', null, null, 'The platforms and day-to-day tooling that keep projects moving and versioned properly.', null),
('main', 'concepts', 'Concepts', 'concepts', 'root', 100, null, 'SYS', null, null, 'Foundational ideas that shape how I design, debug, and reason about software.', null),
('main', 'java', 'Java', 'languages', 'skill', 82, 'JV', 'JV', 'School', 'Comfortable with object-oriented programming and have used Java for coursework and practical class projects.', 'Comfortable with object-oriented programming and have used Java for coursework and practical class projects.', 'programming-languages'),
('main', 'python', 'Python', 'languages', 'skill', 86, 'PY', 'PY', 'Self taught', 'Very familiar and have used Python for scripting, problem solving, automation, and small application work.', 'Very familiar and have used Python for scripting, problem solving, automation, and small application work.', 'programming-languages'),
('main', 'csharp', 'C#', 'languages', 'skill', 76, 'C#', 'C#', 'School', 'Comfortable with the fundamentals and have built coursework projects with C# in class.', 'Comfortable with the fundamentals and have built coursework projects with C# in class.', 'programming-languages'),
('main', 'javascript', 'JavaScript', 'languages', 'skill', 90, 'JS', 'JS', 'Self taught', 'Very comfortable and have used JavaScript across interactive frontend projects and web experiments.', 'Very comfortable and have used JavaScript across interactive frontend projects and web experiments.', 'programming-languages'),
('main', 'typescript', 'TypeScript', 'languages', 'skill', 88, 'TS', 'TS', 'Self taught', 'Comfortable building typed frontend applications and enjoy the structure it adds to growing codebases.', 'Comfortable building typed frontend applications and enjoy the structure it adds to growing codebases.', 'programming-languages'),
('main', 'haxe', 'Haxe', 'languages', 'skill', 62, 'HX', 'HX', 'Self taught', 'Relatively new, but I am comfortable experimenting with it and learning how it fits different build workflows.', 'Relatively new, but I am comfortable experimenting with it and learning how it fits different build workflows.', 'programming-languages'),
('main', 'react', 'React', 'web', 'skill', 90, 'RE', 'RE', 'Self taught', 'Comfortable and have built several application interfaces with React, especially for interactive web projects.', 'Comfortable and have built several application interfaces with React, especially for interactive web projects.', 'web-tech-frameworks'),
('main', 'nodejs', 'Node.js', 'web', 'skill', 78, 'ND', 'ND', 'Self taught', 'Comfortable building simple backend services and project tooling, and still expanding into more advanced patterns.', 'Comfortable building simple backend services and project tooling, and still expanding into more advanced patterns.', 'web-tech-frameworks'),
('main', 'html', 'HTML', 'web', 'skill', 86, 'HT', 'HT', 'School', 'Very comfortable structuring interfaces and building clean semantic page layouts from scratch.', 'Very comfortable structuring interfaces and building clean semantic page layouts from scratch.', 'web-tech-frameworks'),
('main', 'css', 'CSS', 'web', 'skill', 82, 'CS', 'CS', 'School', 'Comfortable styling responsive interfaces and refining layout details so the UI feels polished.', 'Comfortable styling responsive interfaces and refining layout details so the UI feels polished.', 'web-tech-frameworks'),
('main', 'tailwind', 'Tailwind', 'web', 'skill', 88, 'TW', 'TW', 'Self taught', 'Very comfortable building polished interfaces quickly with Tailwind and layering in custom visuals when needed.', 'Very comfortable building polished interfaces quickly with Tailwind and layering in custom visuals when needed.', 'web-tech-frameworks'),
('main', 'mantine', 'Mantine UI', 'web', 'skill', 68, 'MU', 'MU', 'Self taught', 'Relatively new, but comfortable using Mantine UI to speed up clean, modern interface work.', 'Relatively new, but comfortable using Mantine UI to speed up clean, modern interface work.', 'web-tech-frameworks'),
('main', 'dotnet-core', '.NET (Core)', 'backend', 'skill', 74, '.N', '.N', 'School', 'Comfortable with the core foundations and have used it in class to understand structured backend development.', 'Comfortable with the core foundations and have used it in class to understand structured backend development.', 'backend-apis'),
('main', 'aspnet-core', 'ASP.NET Core', 'backend', 'skill', 72, 'AS', 'AS', 'School', 'Comfortable building coursework projects with ASP.NET Core and learning common web application patterns.', 'Comfortable building coursework projects with ASP.NET Core and learning common web application patterns.', 'backend-apis'),
('main', 'rest-apis', 'RESTful APIs', 'backend', 'skill', 79, 'RS', 'RS', 'School', 'Comfortable designing and consuming API endpoints for applications that need clear client-server communication.', 'Comfortable designing and consuming API endpoints for applications that need clear client-server communication.', 'backend-apis'),
('main', 'json', 'JSON', 'backend', 'skill', 84, 'JSN', 'JSN', 'School', 'Very comfortable working with JSON for API payloads, configuration, and general data exchange.', 'Very comfortable working with JSON for API payloads, configuration, and general data exchange.', 'backend-apis'),
('main', 'client-server', 'Client-Server Architecture', 'backend', 'skill', 71, 'C/S', 'C/S', 'School', 'Comfortable with the basic architecture and how responsibilities are split between the client and backend.', 'Comfortable with the basic architecture and how responsibilities are split between the client and backend.', 'backend-apis'),
('main', 'auth-basic', 'Authentication (basic)', 'backend', 'skill', 63, 'AU', 'AU', 'School', 'Familiar with basic authentication flows and the fundamentals of protecting routes and access points.', 'Familiar with basic authentication flows and the fundamentals of protecting routes and access points.', 'backend-apis'),
('main', 'azure-services', 'Microsoft Azure', 'cloud', 'skill', 77, 'AZ', 'AZ', 'School', 'Comfortable working with Azure App Services, Azure SQL Database, resource groups, and deployment basics in class.', 'Comfortable working with Azure App Services, Azure SQL Database, resource groups, and deployment basics in class.', 'cloud-devops'),
('main', 'azure-portal', 'Azure Portal Management', 'cloud', 'skill', 73, 'AP', 'AP', 'School', 'Comfortable navigating the Azure Portal and managing the services needed to keep student projects deployed.', 'Comfortable navigating the Azure Portal and managing the services needed to keep student projects deployed.', 'cloud-devops'),
('main', 'deployment-hosting', 'Deployment & Hosting', 'cloud', 'skill', 70, 'DH', 'DH', 'School', 'Comfortable with the basics of publishing applications and understanding the hosting flow from build to deploy.', 'Comfortable with the basics of publishing applications and understanding the hosting flow from build to deploy.', 'cloud-devops'),
('main', 'sql', 'SQL (basic)', 'databases', 'skill', 70, 'SQL', 'SQL', 'School', 'Comfortable with basic SQL queries, table relationships, and working with structured relational data.', 'Comfortable with basic SQL queries, table relationships, and working with structured relational data.', 'databases'),
('main', 'relational-databases', 'Relational Databases', 'databases', 'skill', 68, 'RDB', 'RDB', 'School', 'Comfortable with core relational database ideas and how records, tables, and relationships fit together.', 'Comfortable with core relational database ideas and how records, tables, and relationships fit together.', 'databases'),
('main', 'crud', 'CRUD Operations', 'databases', 'skill', 76, 'CR', 'CR', 'School', 'Comfortable building create, read, update, and delete flows as part of application coursework and practice work.', 'Comfortable building create, read, update, and delete flows as part of application coursework and practice work.', 'databases'),
('main', 'azure-sql', 'Azure SQL', 'databases', 'skill', 64, 'ASQ', 'ASQ', 'School', 'Familiar with Azure SQL and comfortable working with it in guided academic projects.', 'Familiar with Azure SQL and comfortable working with it in guided academic projects.', 'databases'),
('main', 'git-github', 'Git/GitHub', 'tools', 'skill', 84, 'GIT', 'GIT', 'School', 'Comfortable using Git and GitHub for version control, project collaboration, and keeping work organised.', 'Comfortable using Git and GitHub for version control, project collaboration, and keeping work organised.', 'tools-platforms'),
('main', 'azure-platform', 'Azure', 'tools', 'skill', 71, 'AZR', 'AZR', 'School', 'Comfortable using Azure as a working platform for deployment, management, and cloud-focused coursework.', 'Comfortable using Azure as a working platform for deployment, management, and cloud-focused coursework.', 'tools-platforms'),
('main', 'oop', 'Object-Oriented Programming', 'concepts', 'skill', 83, 'OOP', 'OOP', 'School', 'Comfortable applying OOP concepts in class projects and using them to structure code more cleanly.', 'Comfortable applying OOP concepts in class projects and using them to structure code more cleanly.', 'concepts'),
('main', 'debugging', 'Debugging', 'concepts', 'skill', 84, 'DBG', 'DBG', 'School', 'Comfortable tracing issues, narrowing down causes, and fixing problems methodically instead of guessing.', 'Comfortable tracing issues, narrowing down causes, and fixing problems methodically instead of guessing.', 'concepts'),
('main', 'system-architecture', 'System Architecture (basic)', 'concepts', 'skill', 66, 'ARC', 'ARC', 'School', 'Comfortable with the basics of system architecture and how larger application pieces connect to each other.', 'Comfortable with the basics of system architecture and how larger application pieces connect to each other.', 'concepts'),
('main', 'data-analytics', 'Data Analytics', 'concepts', 'skill', 69, 'DAT', 'DAT', 'School', 'Comfortable with foundational data analysis thinking and using data to support clearer technical decisions.', 'Comfortable with foundational data analysis thinking and using data to support clearer technical decisions.', 'concepts'),
('main', 'secure-coding', 'Secure Coding Practices', 'concepts', 'skill', 67, 'SEC', 'SEC', 'School', 'Comfortable with the fundamentals of writing safer code and paying attention to common security pitfalls.', 'Comfortable with the fundamentals of writing safer code and paying attention to common security pitfalls.', 'concepts'),
('main', 'security-fundamentals', 'Security Fundamentals', 'concepts', 'skill', 65, 'SF', 'SF', 'School', 'Familiar with core security concepts and continuing to build that knowledge through coursework and practice.', 'Familiar with core security concepts and continuing to build that knowledge through coursework and practice.', 'concepts');

delete from public.achievements where profile_slug = 'main';

insert into public.achievements (profile_slug, title, issuer, earned_at, summary, icon, link) values
('main', 'Third-Year Software Engineering', 'Academic milestone', '2026', 'Currently progressing through third-year software engineering while continuing to build outside the classroom.', 'AC', null),
('main', 'Portfolio Relaunch', 'Personal project', '2026', 'Rebuilt the portfolio into a live project space for showcasing work, progress, and future accomplishments.', 'PF', null),
('main', 'Public Project Work', 'Development milestone', 'Ongoing', 'Maintaining visible project work while growing through class projects, experiments, and personal builds.', 'PR', null);
