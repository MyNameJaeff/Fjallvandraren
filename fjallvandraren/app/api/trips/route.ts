import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url'

type OutingImage = {
  _key?: string
  asset?: unknown
  alt?: string
  caption?: string
}

type OutingDoc = {
  _key?: string
  title?: string
  date?: string
  description?: string
  distance?: string
  elevationGain?: string
  duration?: string
  images?: OutingImage[]
}

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
  outings?: OutingDoc[]
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
    image,
    "outings": coalesce(outings, [])[] {
      _key,
      title,
      date,
      description,
      distance,
      elevationGain,
      duration,
      images
    }
  }`

  const data = await client.fetch<TripDoc[]>(query)

  const mapped = (data ?? []).map((t) => ({
    id: t._id,
    name: t.name ?? '',
    region: t.region ?? 'Sverige',
    tagline: t.tagline ?? '',
    difficulty: t.difficulty ?? 'Medel',
    days: typeof t.days === 'number' ? t.days : null,
    distance: t.distance ?? '',
    elevation: t.elevation ?? '',
    season: t.season ?? '',
    description: t.description ?? '',
    highlights: Array.isArray(t.highlights)
      ? t.highlights.filter((x): x is string => typeof x === 'string')
      : [],
    image: t.image
      ? urlFor(t.image as SanityImageSource).width(1000).quality(82).url()
      : '',
    outings: (t.outings ?? []).map((o) => ({
      key: o._key ?? crypto.randomUUID(),
      title: o.title ?? '',
      date: o.date ?? '',
      description: o.description ?? '',
      distance: o.distance ?? '',
      elevationGain: o.elevationGain ?? '',
      duration: o.duration ?? '',
      images: (o.images ?? [])
        .filter((img): img is OutingImage & { asset: unknown } => !!img?.asset)
        .map((img) => ({
          url: urlFor(img as unknown as SanityImageSource)
            .width(1400)
            .quality(82)
            .url(),
          alt: img.alt ?? '',
          caption: img.caption ?? '',
        })),
    })),
  }))

  return NextResponse.json(mapped, {
    headers: { 'Cache-Control': 'no-store' },
  })
}