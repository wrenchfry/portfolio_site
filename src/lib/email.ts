import emailjs from '@emailjs/browser'

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

export const emailJsConfigured = Boolean(publicKey && serviceId && templateId)

interface MessagePayload {
  fromName: string
  replyTo: string
  message: string
  toEmail: string
}

export async function sendPortfolioMessage(payload: MessagePayload) {
  if (emailJsConfigured) {
    await emailjs.send(
      serviceId!,
      templateId!,
      {
        from_name: payload.fromName,
        reply_to: payload.replyTo,
        message: payload.message,
        to_email: payload.toEmail,
      },
      {
        publicKey,
      },
    )

    return 'emailjs'
  }

  const subject = encodeURIComponent(`Portfolio ping from ${payload.fromName}`)
  const body = encodeURIComponent(
    `${payload.message}\n\nFrom: ${payload.fromName}\nReply to: ${payload.replyTo}`,
  )

  window.location.href = `mailto:${payload.toEmail}?subject=${subject}&body=${body}`
  return 'mailto'
}
