import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PROVINCES, type ProvinceSlug } from "@/lib/provinces";

// ---------------------------------------------------------------------------
// Shared image-context type (structural — no internal Astro imports needed)
// ---------------------------------------------------------------------------
type ImageCtx = { image: () => z.ZodTypeAny };

const validUrlString = z.string().refine(
  (value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Must be a valid URL string" },
);

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
        website: validUrlString.optional().nullable(),
      }),
      location: z
        .object({
          address: z.string().optional().default(""),
          mapUrl: validUrlString.optional().nullable(),
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
      mapUrl: validUrlString.optional().nullable(),
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
        secondaryImage: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      businessNodesSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        backgroundImage: ctx.image().optional().nullable(),
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
        secondaryImage: ctx.image().optional().nullable(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
      }),
      humanAssistanceSection: z.object({
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      propertyOwnersSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
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
        image: ctx.image().optional().nullable(),
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
        image: ctx.image().optional().nullable(),
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
        backgroundImage: ctx.image().optional().nullable(),
        roles: z.array(z.string()).default([]),
      }),
      howAcosaHelpsSection: z.object({
        heading: z.string(),
        backgroundImage: ctx.image().optional().nullable(),
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
      finalCta: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        primaryCta: z.object({ label: z.string(), link: z.string() }),
        secondaryCta: z.object({ label: z.string(), link: z.string() }),
        whatsappCta: z
          .object({ label: z.string(), link: z.string() })
          .optional(),
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
      whoWeWorkWithSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        secondaryImage: ctx.image().optional().nullable(),
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
      curationSection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        image: ctx.image().optional().nullable(),
        secondaryImage: ctx.image().optional().nullable(),
        criteria: z.array(z.string()).default([]),
        approvedHeading: z.string(),
        approvedBody: z.string(),
        cta: z.object({ label: z.string(), link: z.string() }),
      }),
      promotionalVisibilitySection: z.object({
        eyebrow: z.string().optional().default(""),
        heading: z.string(),
        body: z.string(),
        note: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
        cta: z.object({ label: z.string(), link: z.string() }).optional(),
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
        image: ctx.image().optional().nullable(),
        secondaryImage: ctx.image().optional().nullable(),
      }),
      howToJoinSection: z.object({
        eyebrow: z.string().optional().default(""),
        image: ctx.image().optional().nullable(),
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
        image: ctx.image().optional().nullable(),
      }),
      contactRoutes: z
        .array(
          z.object({
            number: z.string(),
            title: z.string(),
            description: z.string(),
            details: z.array(z.string()).default([]),
            note: z.string().optional(),
            learnMoreLabel: z.string().optional(),
            learnMoreLink: z.string().optional(),
            cta: z
              .object({
                label: z.string(),
                link: z.string(),
                prefilledMessage: z.string().optional(),
                subject: z.string().optional(),
                requirementsRequest: z.boolean().optional(),
              })
              .optional(),
            primaryCta: z
              .object({
                label: z.string(),
                link: z.string(),
                prefilledMessage: z.string().optional(),
                subject: z.string().optional(),
                applicationRequest: z.boolean().optional(),
                requirementsRequest: z.boolean().optional(),
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
      directoryCopy: z
        .object({
          businessNodes: z.object({
            title: z.string().default("Business Nodes | ACOSA"),
            description: z
              .string()
              .default(
                "Find accommodation by location across South Africa's key business nodes.",
              ),
            heroHeading: z
              .string()
              .default("Where do you need to do business?"),
            heroBody: z
              .string()
              .default(
                "Start with where you need to be. ACOSA brings together carefully selected accommodation around key South African business areas, helping you find options relevant to your destination rather than searching through hundreds of unrelated stays.",
              ),
            heroEyebrow: z.string().default("Find accommodation by location"),
            heroImage: ctx.image().optional().nullable(),
            primaryCtaLabel: z.string().default("Explore Business Nodes"),
            primaryCtaLink: z.string().default("#directory"),
            directoryEyebrow: z
              .string()
              .default("Explore ACOSA's business nodes"),
            directoryHeading: z
              .string()
              .default("Find accommodation where you need to do business."),
            assistanceEyebrow: z.string().default("Here to help"),
            assistanceHeading: z
              .string()
              .default("Need assistance finding the right area?"),
            assistanceBody: z
              .string()
              .default(
                "Tell us where you need to be and what matters for your stay. ACOSA can help you explore suitable accommodation in the network.",
              ),
            assistanceImage: ctx.image().optional().nullable(),
          }),
          properties: z.object({
            title: z.string().default("All Properties | ACOSA"),
            description: z
              .string()
              .default(
                "Browse vetted business accommodation properties across South Africa.",
              ),
            heading: z.string().default("All Properties"),
            lead: z
              .string()
              .default(
                "Browse business accommodation across South Africa's key corporate nodes.",
              ),
            heroEyebrow: z.string().default("ACOSA Properties"),
            regionLabel: z.string().default("Gauteng"),
            searchNavLabel: z.string().default("Search properties"),
            networkNavLabel: z.string().default("Growing network"),
            networkEyebrow: z.string().default("Growing network"),
            networkHeading: z
              .string()
              .default("ACOSA is growing deliberately."),
            networkBody: z
              .string()
              .default(
                "We're building our accommodation network around quality, not simply quantity. New business nodes and carefully selected properties will be added as the ACOSA network expands.",
              ),
            networkImage: ctx.image().optional().nullable(),
            networkCtaLabel: z.string().default("Explore Business Nodes"),
            networkCtaLink: z.string().default("/business-nodes"),
          }),
        })
        .default(() => ({
          businessNodes: {
            title: "Business Nodes | ACOSA",
            description:
              "Find accommodation by location across South Africa's key business nodes.",
            heroHeading: "Where do you need to do business?",
            heroBody:
              "Start with where you need to be. ACOSA brings together carefully selected accommodation around key South African business areas, helping you find options relevant to your destination rather than searching through hundreds of unrelated stays.",
            heroEyebrow: "Find accommodation by location",
            primaryCtaLabel: "Explore Business Nodes",
            primaryCtaLink: "#directory",
            directoryEyebrow: "Explore ACOSA's business nodes",
            directoryHeading:
              "Find accommodation where you need to do business.",
            assistanceEyebrow: "Here to help",
            assistanceHeading: "Need assistance finding the right area?",
            assistanceBody:
              "Tell us where you need to be and what matters for your stay. ACOSA can help you explore suitable accommodation in the network.",
          },
          properties: {
            title: "All Properties | ACOSA",
            description:
              "Browse vetted business accommodation properties across South Africa.",
            heading: "All Properties",
            lead: "Browse business accommodation across South Africa's key corporate nodes.",
            heroEyebrow: "ACOSA Properties",
            regionLabel: "Gauteng",
            searchNavLabel: "Search properties",
            networkNavLabel: "Growing network",
            networkEyebrow: "Growing network",
            networkHeading: "ACOSA is growing deliberately.",
            networkBody:
              "We're building our accommodation network around quality, not simply quantity. New business nodes and carefully selected properties will be added as the ACOSA network expands.",
            networkCtaLabel: "Explore Business Nodes",
            networkCtaLink: "/business-nodes",
          },
        })),
      uiCopy: z.object({
        home: z.object({
          businessTravelNav: z.string().default("Business travel"),
          businessNodesNav: z.string().default("Find a location"),
          featuredNav: z.string().default("Featured stays"),
          corporateNav: z.string().default("For companies"),
          assistanceNav: z.string().default("Get help"),
          propertiesNav: z.string().default("For properties"),
          viewAllProperties: z.string().default("View all properties"),
        }),
        businessNodes: z.object({
          directoryNav: z.string().default("Business nodes"),
          accommodationNav: z.string().default("Accommodation"),
          assistanceNav: z.string().default("Need assistance?"),
          propertiesNav: z.string().default("View all properties"),
          propertiesEyebrow: z.string().default("ACOSA PROPERTIES"),
          propertiesHeading: z
            .string()
            .default("Accommodation in the ACOSA network."),
          askLabel: z.string().default("Ask ACOSA"),
        }),
        properties: z.object({
          searchNav: z.string().default("Search properties"),
          networkNav: z.string().default("Growing network"),
        }),
        forCompanies: z.object({
          whoWeHelpNav: z.string().default("Who we help"),
          discoveryNav: z.string().default("Find accommodation"),
          teamsNav: z.string().default("Teams & projects"),
          contactNav: z.string().default("Get in touch"),
          selfServiceLabel: z.string().default("Self-service discovery"),
          assistedLabel: z.string().default("Assisted enquiry"),
          teamsEyebrow: z.string().default("Teams & project stays"),
          requirementsIntro: z
            .string()
            .default("To help us understand what you need, please include:"),
        }),
        listYourProperty: z.object({
          whoWeWorkWithNav: z.string().default("Who we work with"),
          includedNav: z.string().default("What's included"),
          standardsNav: z.string().default("Our standards"),
          visibilityNav: z.string().default("Visibility"),
          pricingNav: z.string().default("Pricing"),
          joinNav: z.string().default("How to join"),
          worksWithIntro: z
            .string()
            .default("ACOSA works with properties that:"),
          whyAcosaLabel: z.string().default("Why ACOSA?"),
          whyAcosaLink: z.string().default("/why-acosa#acosa-approved"),
          listingSupportEyebrow: z.string().default("LISTING SUPPORT"),
          joinHeading: z.string().default("How to join ACOSA"),
        }),
        contact: z.object({
          routesEyebrow: z.string().default("Choose the right route"),
          routesHeading: z.string().default("Which option applies to you?"),
          readyHeading: z.string().default("Ready to get in touch?"),
          readyBody: z
            .string()
            .default(
              "Share the relevant details above so we can direct your enquiry appropriately.",
            ),
          bookingCta: z.string().default("Email Your Booking Requirements"),
          applicationCta: z
            .string()
            .default("Request Your Property Application"),
          whatsappCta: z.string().default("WhatsApp ACOSA"),
          linkedinCta: z.string().default("ACOSA on LinkedIn"),
          followHeading: z.string().default("Follow ACOSA"),
        }),
      }),
      navigation: z
        .array(
          z.object({
            label: z.string(),
            link: z.string(),
            subItems: z
              .array(z.object({ label: z.string(), link: z.string() }))
              .default([]),
          }),
        )
        .default([]),
      footerColumns: z
        .array(
          z.object({
            title: z.string(),
            links: z.array(
              z.object({
                label: z.string(),
                link: z.string(),
              }),
            ),
          }),
        )
        .default([]),
      footerDescription: z.string().optional().default(""),
      defaultWhatsapp: z.string(),
      enquiryEmail: z.string(),
      phone: z.string().optional().default(""),
      socialLinks: z
        .array(
          z.object({
            label: z.string(),
            url: validUrlString,
          }),
        )
        .default([]),
      logos: z
        .object({
          light: z.object({
            image: ctx.image(),
            alt: z.string().optional().default("ACOSA"),
          }),
          dark: z.object({
            image: ctx.image(),
            alt: z.string().optional().default("ACOSA"),
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
