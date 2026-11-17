import { ObjectId } from 'mongodb'
import { getDatabase, EVENT_ID } from '../../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  if (!config.guestbookAdminToken || token !== config.guestbookAdminToken) {
    throw createError({ statusCode: 401, statusMessage: 'Accès non autorisé.' })
  }
  const id = getRouterParam(event, 'id')
  if (!id || !ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide.' })
  }
  const body = await readBody<{ action?: string }>(event)
  const db = await getDatabase()
  if (body?.action === 'delete') {
    await db.collection('guestbook').deleteOne({ _id: new ObjectId(id), eventId: EVENT_ID })
    return { success: true }
  }
  if (body?.action !== 'approve') {
    throw createError({ statusCode: 400, statusMessage: 'Action invalide.' })
  }
  await db.collection('guestbook').updateOne(
    { _id: new ObjectId(id), eventId: EVENT_ID },
    { $set: { status: 'approved', moderatedAt: new Date() } }
  )
  return { success: true }
})
