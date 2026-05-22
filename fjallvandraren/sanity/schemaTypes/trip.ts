import {defineField, defineType} from 'sanity'

export const trip = defineType({
  name: 'trip',
  title: 'Resa',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Namn på resan',
      description: 'T.ex. "Helags 2021" eller "Sarek sommarvandring"',
      type: 'string',
      validation: (Rule) => Rule.required().error('Ange ett namn för resan'),
    }),
    defineField({
      name: 'region',
      title: 'Region / Område',
      description: 'T.ex. "Jämtland", "Lappland" eller "Härjedalen"',
      type: 'string',
      validation: (Rule) => Rule.required().error('Ange region'),
    }),
    defineField({
      name: 'tagline',
      title: 'Kort beskrivning (undertitel)',
      description: 'En mening som sammanfattar resan — visas under rubriken',
      type: 'string',
    }),
    defineField({
      name: 'difficulty',
      title: 'Svårighetsgrad',
      type: 'string',
      options: {
        list: [
          {title: 'Lätt',   value: 'Lätt'},
          {title: 'Medel',  value: 'Medel'},
          {title: 'Svår',   value: 'Svår'},
          {title: 'Expert', value: 'Expert'},
        ],
        layout: 'radio',
      },
      initialValue: 'Medel',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'days',
      title: 'Antal dagar',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'distance',
      title: 'Total sträcka',
      description: 'T.ex. "85 km" eller "ca 40 mil"',
      type: 'string',
    }),
    defineField({
      name: 'elevation',
      title: 'Högsta punkt',
      description: 'T.ex. "1796 m ö.h." (Helags)',
      type: 'string',
    }),
    defineField({
      name: 'season',
      title: 'Säsong',
      description: 'T.ex. "Juli–Augusti" eller "Sommaren 2022"',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivning av resan',
      description: 'Berätta om resan med egna ord — bakgrund, stämning, minnen',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'highlights',
      title: 'Höjdpunkter',
      description: 'Kortord som "Helags glaciär", "Midnattssol", "Renhjord" — visas som taggar',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'image',
      title: 'Huvudbild (profilbild för resan)',
      description: 'Välj ett representativt foto som visas längst upp',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Bildtext (för tillgänglighet)',
          description: 'Beskriv vad som syns på bilden — viktigt för synskadade',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'outings',
      title: 'Utflykter / Dagsturer',
      description: 'Lägg till de enskilda dagarna eller utflykterna under resan. Varje utflykt kan ha egna bilder, stats och beskrivning.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'outing',
          title: 'Utflykt',
          fields: [
            defineField({
              name: 'title',
              title: 'Namn på utflykten',
              description: 'T.ex. "Dag 1: Upp mot Helags" eller "Silverfallet"',
              type: 'string',
              validation: (Rule) => Rule.required().error('Ge utflykten ett namn'),
            }),
            defineField({
              name: 'date',
              title: 'Datum',
              type: 'date',
              options: {dateFormat: 'YYYY-MM-DD'},
            }),
            defineField({
              name: 'description',
              title: 'Beskrivning',
              description: 'Berätta om just denna dag eller utflykt',
              type: 'text',
              rows: 4,
            }),
            defineField({
              name: 'distance',
              title: 'Sträcka',
              description: 'T.ex. "12 km" eller "5,5 mil"',
              type: 'string',
            }),
            defineField({
              name: 'elevationGain',
              title: 'Höjdmeter (uppstigning)',
              description: 'T.ex. "450 m" eller "+620 hm"',
              type: 'string',
            }),
            defineField({
              name: 'duration',
              title: 'Tid',
              description: 'T.ex. "4 timmar" eller "ca 6 h inkl. raster"',
              type: 'string',
            }),
            defineField({
              name: 'images',
              title: 'Bilder från utflykten',
              description: 'Ladda upp foton från just denna dag. Du kan ladda upp flera.',
              type: 'array',
              of: [
                {
                  type: 'image',
                  title: 'Foto',
                  options: {hotspot: true},
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Bildtext (alt-text)',
                      description: 'Beskriv kort vad som syns — t.ex. "Utsikt mot Sylarna"',
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      title: 'Bildtext / Berättelse',
                      description: 'Valfri längre text om bilden — berättas under fotot i galleriet',
                      rows: 3,
                    },
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'date',
              media: 'images.0',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title ?? 'Namnlös utflykt',
                subtitle: subtitle ?? '',
                media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'region', media: 'image'},
  },
})