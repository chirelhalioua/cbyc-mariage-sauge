import { getDatabase, EVENT_ID } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  if (!config.guestbookAdminToken || token !== config.guestbookAdminToken) {
    throw createError({ statusCode: 401, statusMessage: 'Accès non autorisé.' })
  }
  const db = await getDatabase()
  const messages = await db.collection('guestbook').find(
    { eventId: EVENT_ID },
    { projection: { name: 1, message: 1, status: 1, createdAt: 1 } }
  ).sort({ createdAt: -1 }).limit(200).toArray()
  return { messages }
})
