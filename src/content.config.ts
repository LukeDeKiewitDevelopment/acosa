import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

export const PROVINCES = {
  gauteng: 'Gauteng',
  'western-cape': 'Western Cape',
  'kwazulu-natal': 'KwaZulu-Natal',
  'eastern-cape': 'Eastern Cape',
  'free-state': 'Free State',
  limpopo: 'Limpopo',
  mpumalanga: 'Mpumalanga',
  'north-west': 'North West',
  'northern-cape': 'Northern Cape',
} as const;

export type ProvinceSlug = keyof typeof PROVINCES;

const provinceEnum = z.enum(
  Object.keys(PROVINCES) as [ProvinceSlug, ...ProvinceSlug[]]
);

export const PROPERTY_TYPES = {
  guesthouse: 'Guesthouse',
  'boutique-hotel': 'Boutique Hotel',
  'executive-stay': 'Executive Stay',
  'serviced-apartment': 'Serviced Apartment',
} as const;

const propertyTypeEnum = z.enum(
  Object.keys(PROPERTY_TYPES) as [
    keyof typeof PROPERTY_TYPES,
    ...(keyof typeof PROPERTY_TYPES)[],
  ]
);

const seoSchema = ({ image }: { image: any }) =>
  z.object({
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    ogImage: image().optional().nullable(),
  });

const tagSchema = z.object({
  name: z.string(),
  icon: z.string().optional().default(''),
});

// A tag taxonomy collection (Essentials, Facilities, etc.)
const tagCollection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: `./src/content/tags/${dir}` }),
    schema: tagSchema,
  });

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const properties = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/properties' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      published: z.boolean().default(false),
      featured: z.boolean().default(false),
      acosaApproved: z
        .object({
          approved: z.boolean().default(false),
          score: z.number().min(0).max(100).default(0),
        })
        .default({ approved: false, score: 0 }),
      province: provinceEnum,
      businessNode: reference('businessNodes'),
      propertyType: propertyTypeEnum,
      heroImage: image(),
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string().optional().default(''),
          })
        )
        .default([]),
      shortDescription: z.string(),
      essentials: z.array(reference('essentials')).default([]),
      facilities: z.array(reference('facilities')).default([]),
      nearbyConvenience: z.array(reference('nearbyConvenience')).default([]),
      perfectFor: z.array(reference('perfectFor')).default([]),
      contact: z.object({
        contactName: z.string().optional().default(''),
        email: z.string().optional().default(''),
        phone: z.string().optional().default(''),
        whatsapp: z.string(),
      }),
      location: z
        .object({
          address: z.string().optional().default(''),
          mapUrl: z.string().url().optional().nullable(),
        })
        .default({ address: '', mapUrl: null }),
      seo: seoSchema({ image }).optional(),
    }),
});

const businessNodes = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/business-nodes' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      featured: z.boolean().default(false),
      province: provinceEnum,
      heroImage: image(),
      businessHighlights: z
        .array(
          z.object({
            title: z.string(),
            detail: z.string().optional().default(''),
          })
        )
        .default([]),
      mapUrl: z.string().url().optional().nullable(),
      seo: seoSchema({ image }).optional(),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    reviewer: z.string(),
    review: z.string(),
    rating: z.number().min(0).max(5).default(0),
    property: reference('properties').nullable().optional(),
    reviewType: z.enum([
      'corporate-traveller',
      'booking-decision-maker',
      'property-owner',
    ]),
    published: z.boolean().default(false),
  }),
});

const essentials = tagCollection('essentials');
const facilities = tagCollection('facilities');
const nearbyConvenience = tagCollection('nearby-convenience');
const perfectFor = tagCollection('perfect-for');

// ---------------------------------------------------------------------------
// Page singletons (each collection matches exactly one file)
// ---------------------------------------------------------------------------

const homePage = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      hero: z.object({
        heading: z.string(),
        subheading: z.string().optional().default(''),
        image: image().optional().nullable(),
      }),
      founderStrip: z.object({
        heading: z.string().optional().default(''),
        body: z.string().optional().default(''),
        image: image().optional().nullable(),
      }),
      whyAcosaPreview: z.object({
        heading: z.string().optional().default(''),
        body: z.string().optional().default(''),
      }),
      ownerCta: z.object({
        heading: z.string().optional().default(''),
        body: z.string().optional().default(''),
        buttonLabel: z.string().optional().default(''),
      }),
      seo: seoSchema({ image }).optional(),
    }),
});

const whyAcosaPage = defineCollection({
  loader: glob({ pattern: 'why-acosa.mdoc', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      heroHeading: z.string().optional().default(''),
      heroImage: image().optional().nullable(),
      seo: seoSchema({ image }).optional(),
    }),
});

const forCompaniesPage = defineCollection({
  loader: glob({ pattern: 'for-companies.mdoc', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      heroHeading: z.string().optional().default(''),
      heroImage: image().optional().nullable(),
      seo: seoSchema({ image }).optional(),
    }),
});

const listYourPropertyPage = defineCollection({
  loader: glob({
    pattern: 'list-your-property.yaml',
    base: './src/content/pages',
  }),
  schema: ({ image }) =>
    z.object({
      hero: z.object({
        heading: z.string(),
        subheading: z.string().optional().default(''),
        image: image().optional().nullable(),
      }),
      whoWeWorkWith: z.object({
        heading: z.string().optional().default(''),
        body: z.string().optional().default(''),
      }),
      benefits: z
        .array(
          z.object({
            title: z.string(),
            detail: z.string().optional().default(''),
          })
        )
        .default([]),
      acosaStandards: z.object({
        heading: z.string().optional().default(''),
        body: z.string().optional().default(''),
      }),
      formIntro: z.string().optional().default(''),
      seo: seoSchema({ image }).optional(),
    }),
});

const contactPage = defineCollection({
  loader: glob({ pattern: 'contact.yaml', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      heroHeading: z.string().optional().default(''),
      intro: z.string().optional().default(''),
      showMap: z.boolean().default(false),
      mapUrl: z.string().url().optional().nullable(),
      seo: seoSchema({ image }).optional(),
    }),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content/settings' }),
  schema: z.object({
    defaultWhatsapp: z.string(),
    enquiryEmail: z.string(),
    socialLinks: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
  }),
});

export const collections = {
  properties,
  businessNodes,
  testimonials,
  essentials,
  facilities,
  nearbyConvenience,
  perfectFor,
  homePage,
  whyAcosaPage,
  forCompaniesPage,
  listYourPropertyPage,
  contactPage,
  siteSettings,
};
