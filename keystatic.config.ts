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
              "URL-safe identifier. Auto-generated from the property name. DO NOT change after the property goes live — all links will break.",
          },
        }),
        published: fields.checkbox({
          label: "Published",
          description:
            "Tick to make this property visible on the site. Leave unticked while you are still filling in details. Only publish when the property is complete, has a hero image, and has been vetted.",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Featured Property",
          description:
            "Tick to feature this property on the homepage Featured Properties section. Limit to 3–4 properties at a time for best results.",
          defaultValue: false,
        }),
        acosaApproved: fields.object(
          {
            approved: fields.checkbox({
              label: "Acosa Approved™",
              description:
                "Tick only after the property has completed the Acosa vetting assessment. This shows the Acosa Approved™ badge on all cards and the property page.",
              defaultValue: false,
            }),
            score: fields.integer({
              label: "Approval Score (%)",
              description:
                "Overall score from the vetting assessment, 0–100. Only shown on the property page when Acosa Approved™ is ticked. Leave at 0 if not yet assessed.",
              validation: { min: 0, max: 100 },
            }),
          },
          { label: "Acosa Approved™" },
        ),
        province: fields.select({
          label: "Province",
          description:
            "The South African province where the property is located. Used for filtering and for building the page URL.",
          options: PROVINCE_OPTIONS,
          defaultValue: "gauteng",
        }),
        businessNode: fields.relationship({
          label: "Business Node",
          description:
            "The business node (commercial district) this property belongs to. Every property must belong to a node. If the node doesn't exist yet, create it first in the Business Nodes collection.",
          collection: "businessNodes",
        }),
        propertyType: fields.select({
          label: "Property Type",
          description:
            "The category of accommodation. Used for the badge on property cards and for filtering on the properties directory.",
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
          description:
            "Main image shown on property cards and at the top of the property page. Upload landscape images at 1600×900px minimum. This field is required — the property will not display correctly without it.",
          directory: "src/assets/images/properties",
          publicPath: "../../assets/images/properties/",
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({
          label: "Hero Image Alt Text",
          description:
            "Describe the hero image in one sentence for screen readers and search engines. E.g. 'Reception area of Menlyn Boutique Hotel, Pretoria.' Required for accessibility.",
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
              description:
                "Describe what is shown in this photo. E.g. 'Standard en-suite room with work desk at Menlyn Boutique Hotel.' Be specific — this text is read aloud by screen readers.",
            }),
          }),
          {
            label: "Gallery Images",
            description:
              "Additional photos shown in the image carousel on the property page. Add in order: rooms first, then facilities, then location. Minimum 3 recommended, maximum 20.",
            itemLabel: (props) => props.fields.alt.value || "Image",
          },
        ),
        shortDescription: fields.text({
          label: "Short Description",
          description:
            "One or two sentences shown on property cards and in search results. Include the key selling point and the distance to the nearest landmark. Keep under 160 characters. Required.",
          multiline: true,
          validation: { isRequired: true },
        }),
        longDescription: fields.markdoc({
          label: "Long Description",
          description:
            "Full property description shown on the property page. Cover: the property's character, room types, who it suits, what makes it stand out for business travellers, and the Acosa Approved™ assessment if applicable. Aim for 150–300 words.",
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
            description:
              "Select every Business Traveller Essential™ this property genuinely offers. Only tick what is reliably available — these are verified claims shown prominently to guests.",
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
            description:
              "Select all in-room and on-site facilities available at this property. Be comprehensive — guests use this to compare options.",
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
            description:
              "Select nearby conveniences within walking distance or a short drive. Helps business travellers plan their stay.",
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
            description:
              "Select the traveller types and stay scenarios this property suits best. Used for filtering and card context.",
            itemLabel: (props) => props.value ?? "Select…",
          },
        ),
        contact: fields.object(
          {
            contactName: fields.text({
              label: "Contact Person",
              description:
                "Full name of the main contact person at the property. This is who Acosa will contact for operational matters.",
            }),
            email: fields.text({
              label: "Email Address",
              description:
                "Email address for the property contact. Enquiry reply-to emails are sent here.",
            }),
            phone: fields.text({
              label: "Phone Number",
              description:
                "Primary phone number including country code. E.g. +27 12 345 6789. Shown on the property page.",
            }),
            whatsapp: fields.text({
              label: "WhatsApp Number",
              description:
                "WhatsApp number in international format without spaces or +. E.g. 27721234567. This powers the WhatsApp enquiry button on the property page. Required.",
              validation: { isRequired: true },
            }),
            website: fields.url({
              label: "Website",
              description:
                "The property's own website URL. Shown as a direct link on the property page. Leave empty if they don't have one.",
            }),
          },
          { label: "Contact Details" },
        ),
        location: fields.object(
          {
            address: fields.text({
              label: "Street Address",
              description:
                "Full street address. E.g. '15 Aramist Avenue, Menlyn, Pretoria, 0181'. Shown on the property page below the map link.",
              multiline: true,
            }),
            mapUrl: fields.url({
              label: "Google Maps Link",
              description:
                "Google Maps share link for this property's exact location. In Google Maps: click Share → Copy link. Paste the full URL here.",
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
              "URL-safe identifier. Auto-generated from the node name. DO NOT change after the node goes live — all property links that reference this node will break.",
          },
        }),
        published: fields.checkbox({
          label: "Published",
          description:
            "Tick to make this node visible on the site and in search. Leave unticked while setting up. Only publish when the node has a hero image, description, and at least one published property.",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Popular Business Node",
          description:
            "Shown in the Popular Business Nodes section on the homepage and badged as 'Popular' in search results. Limit to 4–6 nodes.",
          defaultValue: false,
        }),
        province: fields.select({
          label: "Province",
          options: PROVINCE_OPTIONS,
          defaultValue: "gauteng",
        }),
        city: fields.text({
          label: "City",
          description:
            "The city or suburb displayed on node cards beneath the node name. Keep short — one or two words. E.g. 'Johannesburg', 'Pretoria', 'Cape Town', 'Durban'.",
        }),
        heroImage: fields.image({
          label: "Hero Image",
          description:
            "Main image shown on node cards and at the top of the node page. Use a photo that represents the district — skyline, landmark, or key building. Upload landscape at 1600×900px minimum. Required.",
          directory: "src/assets/images/nodes",
          publicPath: "../../assets/images/nodes/",
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({
          label: "Hero Image Alt Text",
          description:
            "Describe the hero image in one sentence. E.g. 'Sandton skyline at dusk with office towers and the Gautrain bridge.' Required for accessibility and SEO.",
        }),
        description: fields.markdoc({
          label: "Description",
          description:
            "Full description of the business node shown on the node page. Cover: what the district is known for, who works there, key corporate tenants or landmarks, transport links, and why it attracts business travellers. Aim for 100–200 words.",
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
              description:
                "Short label for this highlight. Keep under 30 characters. E.g. 'Gautrain access', 'Menlyn Maine precinct'.",
              validation: { isRequired: true },
            }),
            detail: fields.text({
              label: "Detail",
              description:
                "One or two sentences expanding on the highlight title. Concrete and factual. E.g. 'Hatfield station is a 12-minute drive, with a direct link to OR Tambo airport.'",
              multiline: true,
            }),
          }),
          {
            label: "Business Highlights",
            description:
              "Key facts about this node shown as highlight cards on the node page. Add 2–4 items. Each should be a concrete, useful fact — not marketing language. E.g. 'Gautrain station', 'JSE offices', 'N1 highway access'.",
            itemLabel: (props) => props.fields.title.value || "Highlight",
          },
        ),
        mapUrl: fields.url({
          label: "Google Maps Link",
          description:
            "Google Maps share link for the centre of this node/district. In Google Maps: navigate to the area, click Share → Copy link.",
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
        reviewer: fields.slug({
          name: {
            label: "Reviewer Name",
            description:
              "Full name of the reviewer as it will appear publicly on the site. E.g. 'Michael D.' or 'Sarah van der Merwe'.",
          },
        }),
        review: fields.text({
          label: "Review",
          description:
            "The full review text. Paste verbatim — do not edit the reviewer's words. Aim for reviews that mention specific features (parking, WiFi, location) rather than generic praise.",
          multiline: true,
          validation: { isRequired: true },
        }),
        rating: fields.integer({
          label: "Rating",
          description:
            "Star rating from 1 to 5 given by the reviewer. Set to 0 to hide the stars and show only the review text.",
          defaultValue: 0,
          validation: { min: 0, max: 5 },
        }),
        property: fields.relationship({
          label: "Property",
          description:
            "The property this review is about. Leave empty for a general Acosa platform testimonial.",
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
        published: fields.checkbox({
          label: "Published",
          description:
            "Tick to show this testimonial on the site. Review the text before publishing — once live it appears on the property page.",
          defaultValue: false,
        }),
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
            secondButtonLabel: fields.text({
              label: "Second Button Label",
              description: "Optional outlined button. Leave empty to hide it.",
            }),
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
          description:
            "Short tagline shown under the Acosa logo in the site footer. Keep under 200 characters.",
          multiline: true,
        }),
        defaultWhatsapp: fields.text({
          label: "Default WhatsApp Number",
          description:
            "The main Acosa WhatsApp number shown on the homepage and contact page. International format, no spaces, no +. E.g. 27721234567.",
          validation: { isRequired: true },
        }),
        enquiryEmail: fields.text({
          label: "Enquiry Email",
          description:
            "All contact form and listing application submissions are sent to this address. Keep it up to date.",
          validation: { isRequired: true },
        }),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({
              label: "Label",
              description:
                "Platform name exactly as shown. E.g. 'LinkedIn', 'Instagram', 'Facebook'. Used to match the correct icon.",
            }),
            url: fields.url({
              label: "URL",
              description:
                "Full URL to the profile page. E.g. 'https://www.linkedin.com/company/acosa'.",
            }),
          }),
          {
            label: "Social Links",
            description:
              "Links to Acosa's social media profiles. Each entry shows as a platform icon in the footer. Supported platforms: LinkedIn, Instagram, Facebook, X, YouTube, TikTok, Pinterest.",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
      },
    }),
  },
});
