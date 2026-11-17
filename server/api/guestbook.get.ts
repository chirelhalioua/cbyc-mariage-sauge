import { getDatabase, EVENT_ID } from '../utils/mongodb'

export default defineEventHandler(async () => {
  const db = await getDatabase()
  const messages = await db.collection('guestbook').find(
    { eventId: EVENT_ID, status: 'approved' },
    { projection: { name: 1, message: 1, createdAt: 1, _id: 0 } }
  ).sort({ createdAt: -1 }).limit(100).toArray()
  return { messages }
})
