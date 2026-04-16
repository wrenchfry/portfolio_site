import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendPortfolioMessage } from '../../lib/email'
import { SectionHeading } from '../layout/SectionHeading'
import type { SiteProfile } from '../../types/portfolio'
import type { FormEvent } from 'react'

interface ContactSectionProps {
  profile: SiteProfile
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [notice, setNotice] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const updateField = (field: 'name' | 'email' | 'message', value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name || !formState.email || !formState.message) {
      setNotice('Please fill in all the fields before sending your message.')
      return
    }

    try {
      setIsSending(true)
      const provider = await sendPortfolioMessage({
        fromName: formState.name,
        replyTo: formState.email,
        message: formState.message,
        toEmail: profile.email,
      })

      setFormState({
        name: '',
        email: '',
        message: '',
      })
      setNotice(
        provider === 'emailjs'
          ? 'Message sent successfully.'
          : 'Your mail app should open so you can finish sending the message.',
      )
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'The message could not be sent right now.',
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="section-shell" id="contact">
      <SectionHeading
        kicker="Send Message"
        subtitle="If you have any questions or would like to contact me, feel free to send a message or email me directly."
        title="Get in touch"
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {[
            ['email', profile.email],
            ['github', profile.githubUrl.replace('https://', '')],
            ['location', profile.location],
          ].map(([label, value]) => (
            <div
              className="panel flex items-center justify-between gap-4 border border-white/10 px-5 py-4"
              key={label}
            >
              <span className="text-sm uppercase tracking-[0.24em] text-ice-dim">{label}</span>
              <span className="text-right text-base text-ice">{value}</span>
            </div>
          ))}

          <div className="panel border border-white/10 p-5 text-base leading-7 text-ice-dim">
            Hi, welcome. If you have any questions, opportunities, or ideas you would like to discuss, you are welcome to email me.
          </div>
        </div>

        <motion.form
          className="panel border border-white/10 p-6"
          initial={{ opacity: 0, y: 16 }}
          onSubmit={handleSubmit}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="grid gap-4">
            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Name
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Your name"
                value={formState.name}
              />
            </label>
            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Email
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="your@email.com"
                type="email"
                value={formState.email}
              />
            </label>
            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Message
              <textarea
                className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Tell me about the project, role, or ridiculously cool idea."
                value={formState.message}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="pixel-button border-neon-green bg-neon-green text-night hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSending}
              type="submit"
            >
              {isSending ? 'sending...' : 'send message'}
            </button>
            {notice ? <p className="text-sm leading-6 text-ice-dim">{notice}</p> : null}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
