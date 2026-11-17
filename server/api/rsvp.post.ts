import { getDatabase, EVENT_ID } from '../utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; attendance?: string; guests?: string; note?: string; website?: string }>(event)
  if (body?.website) return { success: true }
  const name = String(body?.name || '').trim().slice(0, 100)
  const email = String(body?.email || '').trim().toLowerCase().slice(0, 200)
  const attendance = body?.attendance === 'non' ? 'non' : body?.attendance === 'oui' ? 'oui' : ''
  const guests = Math.min(4, Math.max(1, Number.parseInt(String(body?.guests || '1'), 10) || 1))
  const note = String(body?.note || '').trim().slice(0, 1000)
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !attendance) {
    throw createError({ statusCode: 400, statusMessage: 'Vérifiez les informations saisies.' })
  }
  const db = await getDatabase()
  await db.collection('rsvps').updateOne(
    { eventId: EVENT_ID, email },
    { $set: { eventId: EVENT_ID, name, email, attendance, guests, note, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  return { success: true, message: 'Votre réponse a bien été enregistrée. Merci !' }
})
