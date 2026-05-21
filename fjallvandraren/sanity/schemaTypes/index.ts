import { type SchemaTypeDefinition } from 'sanity'
import { trip } from './trip'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [trip],
}
