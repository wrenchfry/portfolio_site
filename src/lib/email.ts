import emailjs from '@emailjs/browser'

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

export const emailJsConfigured = Boolean(publicKey && serviceId && templateId)

export interface MessagePayload {
  fromName: string
  replyTo: string
  message: string
}

export async function sendPortfolioMessage(payload: MessagePayload) {
  if (!emailJsConfigured) {
    throw new Error('The contact form is not configured yet.')
  }

  try {
    await emailjs.send(
      serviceId!,
      templateId!,
      {
        from_name: payload.fromName,
        reply_to: payload.replyTo,
        message: payload.message,
      },
      {
        publicKey,
      }
    )

    return 'emailjs'
  } catch (error) {
    console.error('EmailJS error:', error)
    throw new Error('Failed to send email via EmailJS')
  }
}
