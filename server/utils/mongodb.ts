import { MongoClient, type Db } from 'mongodb'

let clientPromise: Promise<MongoClient> | undefined

export async function getDatabase(): Promise<Db> {
  const config = useRuntimeConfig()
  if (!config.mongodbUri) {
    throw createError({ statusCode: 503, statusMessage: 'La base de données MongoDB n’est pas configurée.' })
  }
  if (!clientPromise) {
    const client = new MongoClient(config.mongodbUri)
    clientPromise = client.connect()
  }
  const client = await clientPromise
  return client.db(config.mongodbDbName || 'cbyc_invitations')
}

export const EVENT_ID = 'elise-antoine-2027'
