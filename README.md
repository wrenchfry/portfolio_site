<p align="center">
  <img src="./public/favicon.png" alt="Lesego Sindani portfolio icon" width="120" />
</p>

# Lesego Sindani Portfolio

Portfolio site built with React, Vite, Tailwind CSS, Framer Motion, the Canvas API, Supabase, EmailJS, and the GitHub REST API.

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- HTML Canvas API
- Supabase
- EmailJS
- GitHub REST API

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env`.
3. Add your Supabase and EmailJS keys if you want live content and frontend email sending.
4. Start the app:

```bash
npm run dev
```

## Environment variables

```bash
VITE_BASE_PATH=/
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

## Supabase setup

1. Create a free Supabase project.
2. Open the SQL editor.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy the project URL and anon key into `.env`.

If Supabase is not configured, the site uses the built-in portfolio content.

## EmailJS setup

1. Create a free EmailJS account and connect your inbox.
2. Create a service and template.
3. Use these template variables:

```text
from_name
reply_to
message
to_email
```

4. Copy the public key, service ID, and template ID into `.env`.
