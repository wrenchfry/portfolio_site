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

      await sendPortfolioMessage({
        fromName: formState.name,
        replyTo: formState.email,
        message: formState.message,
      })

      setFormState({
        name: '',
        email: '',
        message: '',
      })

      setNotice('Message sent successfully.')
    } catch (error) {
      console.error('EmailJS error:', error)
      setNotice('The message could not be sent right now.')
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
              key={label}
              className="panel flex items-center justify-between gap-4 border border-white/10 px-5 py-4"
            >
              <span className="text-sm uppercase tracking-[0.24em] text-ice-dim">
                {label}
              </span>
              <span className="text-right text-base text-ice">
                {value}
              </span>
            </div>
          ))}

          <div className="panel border border-white/10 p-5 text-base leading-7 text-ice-dim">
            Hi, welcome. If you have any questions, opportunities, or ideas you would like to discuss, you are welcome to email me.
          </div>
        </div>

        <motion.form
          className="panel border border-white/10 p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4">
            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Name
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                placeholder="Your name"
                value={formState.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </label>

            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                placeholder="your@email.com"
                value={formState.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </label>

            <label className="text-sm uppercase tracking-[0.22em] text-ice-dim">
              Message
              <textarea
                className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-ice outline-none transition focus:border-neon-green/50"
                placeholder="Tell me about the project, role, or idea."
                value={formState.message}
                onChange={(e) => updateField('message', e.target.value)}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSending}
              className="pixel-button border-neon-green bg-neon-green text-night hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? 'sending...' : 'send message'}
            </button>

            {notice && (
              <p className="text-sm leading-6 text-ice-dim">
                {notice}
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}