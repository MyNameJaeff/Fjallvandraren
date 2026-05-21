import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

type TripDoc = {
  _id: string
  name?: string
  region?: string
  tagline?: string
  difficulty?: string
  days?: number
  distance?: string
  elevation?: string
  season?: string
  description?: string
  highlights?: unknown
  image?: unknown
}

export async function GET() {
  const query = `*[_type == "trip"] | order(_createdAt asc){
    _id,
    name,
    region,
    tagline,
    difficulty,
    days,
    distance,
    elevation,
    season,
    description,
    highlights,
    image
  }`

  const data = await client.fetch<TripDoc[]>(query)

  const mapped = (data ?? []).map((t) => ({
    id: t._id,
    name: t.name ?? '',
    region: t.region ?? 'Sverige',
    tagline: t.tagline ?? '',
    difficulty: t.difficulty ?? 'Medel',
    days: typeof t.days === 'number' ? t.days : null,
    distance: t.distance ?? '–',
    elevation: t.elevation ?? '–',
    season: t.season ?? '–',
    description: t.description ?? '',
    highlights: Array.isArray(t.highlights)
      ? t.highlights.filter((x): x is string => typeof x === 'string')
      : [],
    image: t.image ? urlFor(t.image).width(900).quality(80).url() : '',
  }))

  return NextResponse.json(mapped, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
