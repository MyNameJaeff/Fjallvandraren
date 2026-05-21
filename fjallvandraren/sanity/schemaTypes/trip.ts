import {defineField, defineType} from 'sanity'

export const trip = defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          {title: 'Lätt', value: 'Lätt'},
          {title: 'Medel', value: 'Medel'},
          {title: 'Svår', value: 'Svår'},
          {title: 'Expert', value: 'Expert'},
        ],
        layout: 'radio',
      },
      initialValue: 'Medel',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'days',
      title: 'Days',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({name: 'distance', title: 'Distance', type: 'string'}),
    defineField({name: 'elevation', title: 'Elevation', type: 'string'}),
    defineField({name: 'season', title: 'Season', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'region', media: 'image'},
  },
})
