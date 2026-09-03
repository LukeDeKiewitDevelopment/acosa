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
      imageAlt: z.string().optional().default(""),
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
        website: z.string().url().optional().nullable(),
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
      city: z.string().optional().default(""),
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
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string().optional().default(""),
        subheading: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
        overlayOpacity: z.number().min(0).max(100).optional().default(50),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
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
        secondButtonLabel: z.string().optional().default(""),
      }),
      businessTravelSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      businessNodesSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      featuredPropertiesSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
      }),
      corporateBookersSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      humanAssistanceSection: z.object({
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      propertyOwnersSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      closingSection: z.object({
        eyebrow: z.string().nullable().optional(),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      seo: seoFields(ctx).optional(),
    }),
});

const whyAcosaPage = defineCollection({
  loader: glob({ pattern: "why-acosa.yaml", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      experienceSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
      }),
      curationSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        factorsInclude: z.array(z.string()).default([]),
        highlightStatement: z.string().optional().default(""),
        note: z.string().optional().default(""),
      }),
      approvedSection: z.object({
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      outcomeSection: z.object({
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      seo: seoFields(ctx).optional(),
    }),
});

const forCompaniesPage = defineCollection({
  loader: glob({ pattern: "for-companies.yaml", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      whoWeHelpSection: z.object({
        heading: z.string(),
        body: z.string(),
        roles: z.array(z.string()).default([]),
      }),
      howAcosaHelpsSection: z.object({
        heading: z.string(),
        features: z
          .array(z.object({ title: z.string(), body: z.string() }))
          .default([]),
      }),
      teamsAndProjectsSection: z.object({
        heading: z.string(),
        image: ctx.image().optional().nullable(),
        body: z.string(),
        requirementsList: z.array(z.string()).default([]),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      assistanceSection: z.object({
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      finalCta: z.object({
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
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
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
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
      whoWeWorkWithSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        properties: z.array(z.string()).default([]),
        highlight: z.string().optional().default(""),
        note: z.string().optional().default(""),
      }),
      valueSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        includes: z
          .array(z.object({ title: z.string(), detail: z.string() }))
          .default([]),
      }),
      promotionalVisibilitySection: z.object({
        heading: z.string(),
        body: z.string(),
        note: z.string().optional().default(""),
      }),
      pricingSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        pricing: z
          .array(
            z.object({
              tier: z.string(),
              price: z.string(),
              period: z.string(),
              detail: z.string(),
            }),
          )
          .default([]),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      listingUpdatesSection: z.object({
        heading: z.string(),
        body: z.string(),
        refreshIncludes: z.array(z.string()).default([]),
      }),
      howToJoinSection: z.object({
        eyebrow: z.string().optional().default(""),
        steps: z
          .array(
            z.object({
              number: z.string(),
              title: z.string(),
              detail: z.string(),
            }),
          )
          .default([]),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      finalCta: z.object({
        heading: z.string(),
        body: z.string(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      formIntro: z.string().optional().default(""),
      seo: seoFields(ctx).optional(),
    }),
});

const contactPage = defineCollection({
  loader: glob({ pattern: "contact.yaml", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
      }),
      contactRoutes: z
        .array(
          z.object({
            number: z.string(),
            title: z.string(),
            description: z.string(),
            cta: z
              .object({
                label: z.string(),
                link: z.string(),
                prefilledMessage: z.string().optional(),
                subject: z.string().optional(),
              })
              .optional(),
            primaryCta: z
              .object({
                label: z.string(),
                link: z.string(),
                subject: z.string().optional(),
              })
              .optional(),
            secondaryCta: z
              .object({
                label: z.string(),
                link: z.string(),
                prefilledMessage: z.string().optional(),
              })
              .optional(),
          }),
        )
        .default([]),
      footer: z.object({
        business: z.object({
          heading: z.string(),
          tagline: z.string(),
          description: z.string(),
        }),
        sections: z
          .array(
            z.object({
              title: z.string(),
              links: z.array(z.object({ label: z.string(), link: z.string() })),
            }),
          )
          .default([]),
        legal: z
          .array(z.object({ label: z.string(), link: z.string() }))
          .default([]),
        copyright: z.string().optional().default(""),
      }),
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
