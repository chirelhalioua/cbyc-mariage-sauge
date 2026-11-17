import { getDatabase, EVENT_ID } from '../utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; message?: string; website?: string }>(event)
  // Honeypot anti-spam: bots often fill hidden fields.
  if (body?.website) return { success: true }
  const name = String(body?.name || '').trim().slice(0, 80)
  const message = String(body?.message || '').trim().slice(0, 1000)
  if (name.length < 2 || message.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Merci de renseigner votre nom et un message.' })
  }
  const db = await getDatabase()
  await db.collection('guestbook').insertOne({
    eventId: EVENT_ID,
    name,
    message,
    status: 'pending',
    createdAt: new Date()
  })
  return { success: true, message: 'Merci pour votre petit mot ! Il sera publié après validation des mariés.' }
})
