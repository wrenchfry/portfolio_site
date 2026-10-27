<p align="center">
  <img src="./public/favicon.png" alt="Lesego Sindani portfolio icon" width="120" />
</p>

# Lesego Sindani Portfolio

Retro RPG-inspired portfolio built with React, Vite, Tailwind CSS, Framer Motion, Canvas, EmailJS, and the GitHub REST API.

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- HTML Canvas API
- EmailJS
- GitHub REST API

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env`.
3. Add your EmailJS values if you want the contact form to send messages.
4. Start the app:

```bash
npm run dev
```

## Environment variables

```bash
VITE_BASE_PATH=/
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

## EmailJS setup

1. Create a free EmailJS account and connect your inbox.
2. Create a service and template.
3. Use these template variables:

```text
from_name
reply_to
message
```

4. Copy the public key, service ID, and template ID into `.env`.

For the deployed GitHub Pages site, add the same three values as GitHub Actions secrets named `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, and `VITE_EMAILJS_TEMPLATE_ID`. The workflow passes them to the production build. Without them, the form stays on the site and shows an unavailable message; it never opens a visitor's mail application.
