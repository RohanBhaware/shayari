import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

async function connect() {
  const url = process.env.MONGODB_URL || process.env.NEXT_PUBLIC_MONGODB_URL
  if (!url) throw new Error('MONGODB_URL not set')
  const client = new MongoClient(url)
  await client.connect()
  const dbName = process.env.MONGODB_DB || 'shayari'
  return { client, db: client.db(dbName) }
}

export async function GET(req: Request, { params }: { params: { collection: string } }) {
  try {
    const { db, client } = await connect()
    const collection = params.collection

    const url = new URL(req.url)
    const fields = url.searchParams.get('fields')
    const filterParam = url.searchParams.get('filter')
    const filter = filterParam ? JSON.parse(filterParam) : {}

    const coll = db.collection(collection)
    let cursor = coll.find(filter || {})
    if (fields) {
      try {
        const parsed = fields
        const projFields = parsed.split(',').reduce((acc: any, f: string) => { acc[f.trim()] = 1; return acc }, {})
        cursor = cursor.project(projFields)
      } catch {}
    }
    const data = await cursor.toArray()
    await client.close()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { collection: string } }) {
  try {
    const { db, client } = await connect()
    const collection = params.collection
    const body = await req.json()
    const coll = db.collection(collection)
    if (Array.isArray(body.doc)) {
      const res = await coll.insertMany(body.doc)
      await client.close()
      return NextResponse.json({ insertedCount: res.insertedCount, insertedIds: res.insertedIds })
    }
    const res = await coll.insertOne(body.doc)
    await client.close()
    return NextResponse.json({ insertedId: res.insertedId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { collection: string } }) {
  try {
    const { db, client } = await connect()
    const collection = params.collection
    const body = await req.json()
    const coll = db.collection(collection)
    const filter = body?.filter || {}
    const res = await coll.deleteMany(filter)
    await client.close()
    return NextResponse.json({ deletedCount: res.deletedCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { collection: string } }) {
  try {
    const { db, client } = await connect()
    const collection = params.collection
    const body = await req.json()
    const coll = db.collection(collection)
    const filter = body?.filter || {}
    const update = body?.update || {}
    const res = await coll.updateMany(filter, { $set: update })
    await client.close()
    return NextResponse.json({ modifiedCount: res.modifiedCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
