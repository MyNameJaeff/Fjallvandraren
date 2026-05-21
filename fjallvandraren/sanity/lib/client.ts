import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const token = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: !token, // If using a token (private dataset), disable the CDN
})
