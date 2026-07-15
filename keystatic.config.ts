import { config, fields, collection, singleton } from "@keystatic/core";
import { PROVINCE_OPTIONS } from "./src/lib/provinces";

// ---------------------------------------------------------------------------
// Shared field helpers
// ---------------------------------------------------------------------------

const seoFields = fields.object(
  {
    title: fields.text({
      label: "SEO Title",
      description: "Overrides the page <title>. Aim for under 60 characters.",
    }),
    description: fields.text({
      label: "SEO Description",
      description: "Meta description. Aim for 120–160 characters.",
      multiline: true,
    }),
    ogImage: fields.image({
      label: "Social Share Image (Open Graph)",
      description: "Recommended 1200×630. Falls back to hero image if empty.",
      directory: "src/assets/images/og",
      publicPath: "../../assets/images/og/",
    }),
  },
  { label: "SEO" },
);

// A simple reusable "tag" collection factory: label + slug (+ optional icon).
const tagCollection = (label: string, path: string) =>
  collection({
    label,
    slugField: "name",
    path: `src/content/${path}/*`,
    schema: {
      name: fields.slug({ name: { label: "Name" } }),
      icon: fields.text({
        label: "Icon",
        description:
          'Optional lucide icon name, e.g. "wifi", "car", "coffee". See lucide.dev/icons',
      }),
    },
  });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default config({
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: "acosa/acosa",
  },

  ui: {
    brand: { name: "Acosa" },
    navigation: {
      Content: ["properties", "businessNodes", "testimonials"],
      Tags: ["essentials", "facilities", "nearbyConvenience", "perfectFor"],
      Pages: [
        "home",
        "whyAcosa",
        "forCompanies",
        "listYourProperty",
        "contact",
      ],
      Settings: ["siteSettings"],
    },
  },

  collections: {
    // -----------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------
    properties: collection({
      label: "Properties",
      slugField: "name",
      path: "src/content/properties/*",
      entryLayout: "form",
      format: { contentField: "longDescription" },
      schema: {
        name: fields.slug({
          name: { label: "Property Name" },
          slug: {
            label: "Slug",
            description:
              "Used in the URL. Do NOT change after publishing — links and references will break.",
          },
        }),
        published: fields.checkbox({
          label: "Published",
          description: "Untick to keep as a draft (hidden from the live site).",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Featured Property",
          description:
            "Show in the Featured Properties section on the homepage.",
          defaultValue: false,
        }),
        acosaApproved: fields.object(
          {
            approved: fields.checkbox({
              label: "Acosa Approved™",
              description: "Property has passed the Acosa vetting assessment.",
              defaultValue: false,
            }),
            score: fields.integer({
              label: "Approval Score (%)",
              description:
                "Score from the vetting assessment, 0–100. Only shown when Acosa Approved™ is ticked.",
              validation: { min: 0, max: 100 },
            }),
          },
          { label: "Acosa Approved™" },
        ),
        province: fields.select({
          label: "Province",
          options: PROVINCE_OPTIONS,
          defaultValue: "gauteng",
        }),
        businessNode: fields.relationship({
          label: "Business Node",
          description: "The business node this property belongs to.",
          collection: "businessNodes",
        }),
        propertyType: fields.select({
          label: "Property Type",
          options: [
            { label: "Guesthouse", value: "guesthouse" },
            { label: "Boutique Hotel", value: "boutique-hotel" },
            { label: "Executive Stay", value: "executive-stay" },
            { label: "Serviced Apartment", value: "serviced-apartment" },
          ],
          defaultValue: "guesthouse",
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/properties",
          publicPath: "../../assets/images/properties/",
          validation: { isRequired: true },
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "src/assets/images/properties",
              publicPath: "../../assets/images/properties/",
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: "Alt text",
              description: "Describe the image for accessibility and SEO.",
            }),
          }),
          {
            label: "Gallery Images",
            itemLabel: (props) => props.fields.alt.value || "Image",
          },
        ),
        shortDescription: fields.text({
          label: "Short Description",
          description:
            "Shown on property cards and search results. 1–2 sentences.",
          multiline: true,
          validation: { isRequired: true },
        }),
        longDescription: fields.markdoc({
          label: "Long Description",
          options: {
            image: {
              directory: "src/assets/images/properties",
              publicPath: "../../assets/images/properties/",
            },
          },
        }),
        essentials: fields.array(
          fields.relationship({
            label: "Business Traveller Essential",
            collection: "essentials",
          }),
          {
            label: "Business Traveller Essentials™",
            itemLabel: (props) => props.value ?? "Select…",
          },
        ),
        facilities: fields.array(
          fields.relationship({
            label: "Facility",
            collection: "facilities",
          }),
          {
            label: "Facilities",
            itemLabel: (props) => props.value ?? "Select…",
          },
        ),
        nearbyConvenience: fields.array(
          fields.relationship({
            label: "Nearby Convenience",
            collection: "nearbyConvenience",
          }),
          {
            label: "Nearby Convenience",
            itemLabel: (props) => props.value ?? "Select…",
          },
        ),
        perfectFor: fields.array(
          fields.relationship({
            label: "Perfect For",
            collection: "perfectFor",
          }),
          {
            label: "Perfect For",
            itemLabel: (props) => props.value ?? "Select…",
          },
        ),
        contact: fields.object(
          {
            contactName: fields.text({ label: "Contact Person" }),
            email: fields.text({ label: "Email Address" }),
            phone: fields.text({ label: "Phone Number" }),
            whatsapp: fields.text({
              label: "WhatsApp Number",
              description:
                "International format without spaces or +, e.g. 27721234567. Used for the WhatsApp enquiry button.",
              validation: { isRequired: true },
            }),
          },
          { label: "Contact Details" },
        ),
        location: fields.object(
          {
            address: fields.text({ label: "Street Address", multiline: true }),
            mapUrl: fields.url({
              label: "Google Maps Link",
              description: "Share link from Google Maps for the map embed.",
            }),
          },
          { label: "Location" },
        ),
        seo: seoFields,
      },
    }),

    // -----------------------------------------------------------------------
    // Business Nodes
    // -----------------------------------------------------------------------
    businessNodes: collection({
      label: "Business Nodes",
      slugField: "name",
      path: "src/content/business-nodes/*",
      entryLayout: "form",
      format: { contentField: "description" },
      schema: {
        name: fields.slug({
          name: { label: "Node Name" },
          slug: {
            label: "Slug",
            description:
              "Do NOT change after publishing — property references will break.",
          },
        }),
        published: fields.checkbox({
          label: "Published",
          description: "Untick to keep as a draft (hidden from the live site).",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Popular Business Node",
          description:
            "Shown in the homepage Popular Business Nodes section and badged as Popular in search results.",
          defaultValue: false,
        }),
        province: fields.select({
          label: "Province",
          options: PROVINCE_OPTIONS,
          defaultValue: "gauteng",
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/nodes",
          publicPath: "../../assets/images/nodes/",
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({
          label: "Hero Image Alt Text",
          description: "Describe the image for accessibility and SEO.",
        }),
        description: fields.markdoc({
          label: "Description",
          options: {
            image: {
              directory: "src/assets/images/nodes",
              publicPath: "../../assets/images/nodes/",
            },
          },
        }),
        businessHighlights: fields.array(
          fields.object({
            title: fields.text({
              label: "Highlight",
              validation: { isRequired: true },
            }),
            detail: fields.text({ label: "Detail", multiline: true }),
          }),
          {
            label: "Business Highlights",
            description:
              "E.g. major corporate offices, conference venues, transport links.",
            itemLabel: (props) => props.fields.title.value || "Highlight",
          },
        ),
        mapUrl: fields.url({
          label: "Google Maps Link",
          description: "Share link from Google Maps for the node map embed.",
        }),
        seo: seoFields,
      },
    }),

    // -----------------------------------------------------------------------
    // Testimonials
    // -----------------------------------------------------------------------
    testimonials: collection({
      label: "Testimonials",
      slugField: "reviewer",
      path: "src/content/testimonials/*",
      schema: {
        reviewer: fields.slug({ name: { label: "Reviewer Name" } }),
        review: fields.text({
          label: "Review",
          multiline: true,
          validation: { isRequired: true },
        }),
        rating: fields.integer({
          label: "Rating",
          description:
            "Star rating from 1 to 5. Leave at 0 to hide the rating.",
          defaultValue: 0,
          validation: { min: 0, max: 5 },
        }),
        property: fields.relationship({
          label: "Property",
          description: "Leave empty for a general Acosa testimonial.",
          collection: "properties",
        }),
        reviewType: fields.select({
          label: "Review Type",
          options: [
            { label: "Corporate Traveller", value: "corporate-traveller" },
            {
              label: "Booking Decision Maker",
              value: "booking-decision-maker",
            },
            { label: "Property Owner", value: "property-owner" },
          ],
          defaultValue: "corporate-traveller",
        }),
        published: fields.checkbox({ label: "Published", defaultValue: false }),
      },
    }),

    // -----------------------------------------------------------------------
    // Tag taxonomies (reusable across properties)
    // -----------------------------------------------------------------------
    essentials: tagCollection(
      "Business Traveller Essentials™",
      "tags/essentials",
    ),
    facilities: tagCollection("Facilities", "tags/facilities"),
    nearbyConvenience: tagCollection(
      "Nearby Convenience",
      "tags/nearby-convenience",
    ),
    perfectFor: tagCollection("Perfect For", "tags/perfect-for"),
  },

  // ---------------------------------------------------------------------------
  // Editable pages (singletons)
  // ---------------------------------------------------------------------------
  singletons: {
    home: singleton({
      label: "Home Page",
      path: "src/content/pages/home",
      entryLayout: "form",
      schema: {
        hero: fields.object(
          {
            heading: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            subheading: fields.text({ label: "Subheading", multiline: true }),
            image: fields.image({
              label: "Hero Image",
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            }),
            overlayOpacity: fields.integer({
              label: "Overlay Opacity (%)",
              description:
                "Darkness of the overlay on top of the hero image, 0 (none) to 100 (solid). Keeps the heading readable over busy photos.",
              defaultValue: 50,
              validation: { min: 0, max: 100 },
            }),
          },
          { label: "Hero" },
        ),
        founderStrip: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "Body", multiline: true }),
            image: fields.image({
              label: "Founder Photo",
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            }),
          },
          { label: "Founder Trust Strip" },
        ),
        trustStrip: fields.array(
          fields.object({
            icon: fields.text({
              label: "Icon",
              description:
                'Lucide icon name, e.g. "briefcase-business", "shield". See lucide.dev/icons',
            }),
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            detail: fields.text({ label: "Detail", multiline: true }),
          }),
          {
            label: "Trust Strip",
            description: "The icon strip under the hero (4 items recommended).",
            itemLabel: (props) => props.fields.title.value || "Item",
          },
        ),
        whyAcosaPreview: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "Body", multiline: true }),
          },
          { label: "Why Acosa Preview" },
        ),
        ownerCta: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "Body", multiline: true }),
            buttonLabel: fields.text({ label: "Button Label" }),
          },
          { label: "Property Owner CTA" },
        ),
        seo: seoFields,
      },
    }),

    whyAcosa: singleton({
      label: "Why Acosa Page",
      path: "src/content/pages/why-acosa",
      entryLayout: "form",
      format: { contentField: "body" },
      schema: {
        heroHeading: fields.text({ label: "Hero Heading" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/pages",
          publicPath: "../../assets/images/pages/",
        }),
        body: fields.markdoc({
          label: "Page Content",
          description:
            "Founder story, the problem, our difference, Acosa Approved™, Essentials™.",
          options: {
            image: {
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            },
          },
        }),
        seo: seoFields,
      },
    }),

    forCompanies: singleton({
      label: "For Companies Page",
      path: "src/content/pages/for-companies",
      entryLayout: "form",
      format: { contentField: "body" },
      schema: {
        heroHeading: fields.text({ label: "Hero Heading" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/pages",
          publicPath: "../../assets/images/pages/",
        }),
        body: fields.markdoc({
          label: "Page Content",
          options: {
            image: {
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            },
          },
        }),
        seo: seoFields,
      },
    }),

    contact: singleton({
      label: "Contact Page",
      path: "src/content/pages/contact",
      entryLayout: "form",
      schema: {
        heroHeading: fields.text({ label: "Hero Heading" }),
        intro: fields.text({ label: "Intro Text", multiline: true }),
        showMap: fields.checkbox({ label: "Show Map", defaultValue: false }),
        mapUrl: fields.url({ label: "Google Maps Link" }),
        seo: seoFields,
      },
    }),

    listYourProperty: singleton({
      label: "List Your Property Page",
      path: "src/content/pages/list-your-property",
      entryLayout: "form",
      schema: {
        hero: fields.object(
          {
            heading: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            subheading: fields.text({ label: "Subheading", multiline: true }),
            image: fields.image({
              label: "Hero Image",
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            }),
          },
          { label: "Hero" },
        ),
        whoWeWorkWith: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "Body", multiline: true }),
          },
          { label: "Who We Work With" },
        ),
        benefits: fields.array(
          fields.object({
            title: fields.text({
              label: "Benefit",
              validation: { isRequired: true },
            }),
            detail: fields.text({ label: "Detail", multiline: true }),
          }),
          {
            label: "Benefits",
            itemLabel: (props) => props.fields.title.value || "Benefit",
          },
        ),
        acosaStandards: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "Body", multiline: true }),
          },
          { label: "Acosa Standards" },
        ),
        formIntro: fields.text({
          label: "Application Form Intro",
          description: "Short text shown above the application form.",
          multiline: true,
        }),
        seo: seoFields,
      },
    }),

    siteSettings: singleton({
      label: "Site Settings",
      path: "src/content/settings/site",
      schema: {
        logos: fields.object(
          {
            light: fields.object(
              {
                image: fields.image({
                  label: "Light Logo",
                  description:
                    "Logo for light backgrounds (e.g. white navbar). SVG or PNG with transparency.",
                  directory: "src/assets/images/brand",
                  publicPath: "../../assets/images/brand/",
                  validation: { isRequired: true },
                }),
                alt: fields.text({ label: "Alt Text", defaultValue: "Acosa" }),
              },
              { label: "Light Mode Logo" },
            ),
            dark: fields.object(
              {
                image: fields.image({
                  label: "Dark Logo",
                  description:
                    "Logo for dark backgrounds (e.g. navy navbar and footer). SVG or PNG with transparency.",
                  directory: "src/assets/images/brand",
                  publicPath: "../../assets/images/brand/",
                  validation: { isRequired: true },
                }),
                alt: fields.text({ label: "Alt Text", defaultValue: "Acosa" }),
              },
              { label: "Dark Mode Logo" },
            ),
          },
          { label: "Logos" },
        ),
        footerDescription: fields.text({
          label: "Footer Description",
          description: "Short blurb shown under the logo in the site footer.",
          multiline: true,
        }),
        defaultWhatsapp: fields.text({
          label: "Default WhatsApp Number",
          description:
            "International format without spaces or +, e.g. 27721234567. Used for the persistent WhatsApp button on the homepage and contact page.",
          validation: { isRequired: true },
        }),
        enquiryEmail: fields.text({
          label: "Enquiry Email",
          description: "All form submissions are sent to this address.",
          validation: { isRequired: true },
        }),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: fields.url({ label: "URL" }),
          }),
          {
            label: "Social Links",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
      },
    }),
  },
});
