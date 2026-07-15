import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PROVINCES, type ProvinceSlug } from "@/lib/provinces";

// ---------------------------------------------------------------------------
// Shared image-context type (structural — no internal Astro imports needed)
// ---------------------------------------------------------------------------
type ImageCtx = { image: () => z.ZodTypeAny };

function seoFields({ image }: ImageCtx) {
  return z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    ogImage: image().optional().nullable(),
  });
}

// ---------------------------------------------------------------------------
// Province / property-type lookup maps (exported for use in routes + lib)
// ---------------------------------------------------------------------------
export { PROVINCES, type ProvinceSlug };

export const PROPERTY_TYPES = {
  guesthouse: "Guesthouse",
  "boutique-hotel": "Boutique Hotel",
  "executive-stay": "Executive Stay",
  "serviced-apartment": "Serviced Apartment",
} as const;

export type PropertyTypeSlug = keyof typeof PROPERTY_TYPES;

// ---------------------------------------------------------------------------
// Tag taxonomies
// ---------------------------------------------------------------------------
const tagSchema = z.object({
  name: z.string(),
  icon: z.string().optional().default(""),
});

const tagCollection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: `./src/content/tags/${dir}` }),
    schema: tagSchema,
  });

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------
const properties = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/properties" }),
  schema: (ctx) =>
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
      province: z.enum(
        Object.keys(PROVINCES) as [ProvinceSlug, ...ProvinceSlug[]],
      ),
      businessNode: reference("businessNodes"),
      propertyType: z.enum(
        Object.keys(PROPERTY_TYPES) as [
          PropertyTypeSlug,
          ...PropertyTypeSlug[],
        ],
      ),
      heroImage: ctx.image(),
      gallery: z
        .array(
          z.object({
            image: ctx.image(),
            alt: z.string().optional().default(""),
          }),
        )
        .default([]),
      shortDescription: z.string(),
      essentials: z.array(reference("essentials")).default([]),
      facilities: z.array(reference("facilities")).default([]),
      nearbyConvenience: z.array(reference("nearbyConvenience")).default([]),
      perfectFor: z.array(reference("perfectFor")).default([]),
      contact: z.object({
        contactName: z.string().optional().default(""),
        email: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        whatsapp: z.string(),
      }),
      location: z
        .object({
          address: z.string().optional().default(""),
          mapUrl: z.string().url().optional().nullable(),
        })
        .default({ address: "", mapUrl: null }),
      seo: seoFields(ctx).optional(),
    }),
});

// ---------------------------------------------------------------------------
// Business Nodes
// ---------------------------------------------------------------------------
const businessNodes = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/business-nodes" }),
  schema: (ctx) =>
    z.object({
      name: z.string(),
      published: z.boolean().default(false),
      featured: z.boolean().default(false),
      province: z.enum(
        Object.keys(PROVINCES) as [ProvinceSlug, ...ProvinceSlug[]],
      ),
      heroImage: ctx.image(),
      imageAlt: z.string().optional().default(""),
      businessHighlights: z
        .array(
          z.object({
            title: z.string(),
            detail: z.string().optional().default(""),
          }),
        )
        .default([]),
      mapUrl: z.string().url().optional().nullable(),
      seo: seoFields(ctx).optional(),
    }),
});

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/testimonials" }),
  schema: z.object({
    reviewer: z.string(),
    review: z.string(),
    rating: z.number().min(0).max(5).default(0),
    property: reference("properties").optional().nullable(),
    reviewType: z.enum([
      "corporate-traveller",
      "booking-decision-maker",
      "property-owner",
    ]),
    published: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------------
// Page singletons
// ---------------------------------------------------------------------------
const homePage = defineCollection({
  loader: glob({ pattern: "home.yaml", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        heading: z.string(),
        subheading: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
        overlayOpacity: z.number().min(0).max(100).optional().default(50),
      }),
      founderStrip: z.object({
        heading: z.string().optional().default(""),
        body: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
      }),
      whyAcosaPreview: z.object({
        heading: z.string().optional().default(""),
        body: z.string().optional().default(""),
      }),
      ownerCta: z.object({
        heading: z.string().optional().default(""),
        body: z.string().optional().default(""),
        buttonLabel: z.string().optional().default(""),
      }),
      seo: seoFields(ctx).optional(),
    }),
});

const whyAcosaPage = defineCollection({
  loader: glob({ pattern: "why-acosa.mdoc", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      heroHeading: z.string().optional().default(""),
      heroImage: ctx.image().optional().nullable(),
      seo: seoFields(ctx).optional(),
    }),
});

const forCompaniesPage = defineCollection({
  loader: glob({ pattern: "for-companies.mdoc", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      heroHeading: z.string().optional().default(""),
      heroImage: ctx.image().optional().nullable(),
      seo: seoFields(ctx).optional(),
    }),
});

const listYourPropertyPage = defineCollection({
  loader: glob({
    pattern: "list-your-property.yaml",
    base: "./src/content/pages",
  }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        heading: z.string(),
        subheading: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
      }),
      whoWeWorkWith: z.object({
        heading: z.string().optional().default(""),
        body: z.string().optional().default(""),
      }),
      benefits: z
        .array(
          z.object({
            title: z.string(),
            detail: z.string().optional().default(""),
          }),
        )
        .default([]),
      acosaStandards: z.object({
        heading: z.string().optional().default(""),
        body: z.string().optional().default(""),
      }),
      formIntro: z.string().optional().default(""),
      seo: seoFields(ctx).optional(),
    }),
});

const contactPage = defineCollection({
  loader: glob({ pattern: "contact.yaml", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      heroHeading: z.string().optional().default(""),
      intro: z.string().optional().default(""),
      showMap: z.boolean().default(false),
      mapUrl: z.string().url().optional().nullable(),
      seo: seoFields(ctx).optional(),
    }),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: "site.yaml", base: "./src/content/settings" }),
  schema: (ctx) =>
    z.object({
      footerDescription: z.string().optional().default(""),
      defaultWhatsapp: z.string(),
      enquiryEmail: z.string(),
      socialLinks: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
          }),
        )
        .default([]),
      logos: z
        .object({
          light: z.object({
            image: ctx.image(),
            alt: z.string().optional().default("Acosa"),
          }),
          dark: z.object({
            image: ctx.image(),
            alt: z.string().optional().default("Acosa"),
          }),
        })
        .optional()
        .nullable(),
    }),
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const collections = {
  properties,
  businessNodes,
  testimonials,
  essentials: tagCollection("essentials"),
  facilities: tagCollection("facilities"),
  nearbyConvenience: tagCollection("nearby-convenience"),
  perfectFor: tagCollection("perfect-for"),
  homePage,
  whyAcosaPage,
  forCompaniesPage,
  listYourPropertyPage,
  contactPage,
  siteSettings,
};
