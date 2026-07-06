export interface AstroSEO {
  title?: string;
  titleTemplate?: string;
  titleDefault?: string;
  charset?: string;
  description?: string;
  canonical?: URL | string;
  nofollow?: boolean;
  noindex?: boolean;
  noarchive?: boolean;
  nocache?: boolean;
  robotsExtras?: string;
  languageAlternates?: {
    href: URL | string;
    hrefLang: string;
  }[];
  openGraph?: {
    basic: {
      title: string;
      type: string;
      image: string;
      url?: URL | string;
    };
    optional?: {
      audio?: string;
      description?: string;
      determiner?: string;
      locale?: string;
      localeAlternate?: string[];
      siteName?: string;
      video?: string;
    };
    image?: {
      url?: URL | string;
      secureUrl?: URL | string;
      type?: string;
      width?: number;
      height?: number;
      alt?: string;
    };
    article?: {
      publishedTime?: string;
      modifiedTime?: string;
      expirationTime?: string;
      authors?: string[];
      section?: string;
      tags?: string[];
    };
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: URL | string;
    imageAlt?: string;
  };
  extend?: {
    link?: Partial<Link>[];
    meta?: Partial<Meta>[];
  };
  removeTrailingSlashForRoot?: boolean;
  surpressWarnings?: boolean;
  jsonLd?: {
    "@context"?: string;
    "@type"?: string;
    name?: string;
    url?: string;
    description?: string;
    jobTitle?: string;
    email?: string;
    sameAs?: string[];
    knowsAbout?: string[];
    address?: {
      "@type": string;
      streetAddress?: string;
      postalCode?: string;
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
    author?: {
      "@type": string;
      name?: string;
      url?: string;
      email?: string;
      sameAs?: string[];
      knowsAbout?: string[];
      address?: {
        "@type": string;
        streetAddress?: string;
        postalCode?: string;
        addressLocality?: string;
        addressRegion?: string;
        addressCountry?: string;
      };
    };
    [key: string]: any;
  };
}

interface Link extends Omit<HTMLLinkElement, "sizes"> {
  prefetch: boolean;
  crossorigin: string;
  sizes: string;
}

interface Meta extends HTMLMetaElement {
  property: string;
}

export const homePageSEO: AstroSEO = {
  title: "Home",
  titleTemplate: "Summerwood Country Estate | %s",
  description:
    "Experience tranquil Free State country charm just 4.5km outside Bloemfontein. Summerwood Country Estate offers premier venues and catering for weddings, conferences, accommodation, and corporate events.",
  canonical: "https://www.summerwoodcountryestate.co.za/",
  openGraph: {
    basic: {
      title:
        "Summerwood Country Estate | Weddings, Conferences & Accommodation",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate - Bloemfontein Venue and Guesthouse",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Summerwood Country Estate, Bloemfontein wedding venue, Free State conference venue, guest house Bloemfontein, Montello Caterers, function venue Bloemfontein, accommodation Free State",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/",
    description:
      "A renowned Free State venue established in 1999, specializing in weddings, corporate functions, conferences, and luxury country accommodation.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
      "https://www.lekkeslaap.co.za/accommodation/summerwood-country-estate--guesthouse",
    ],
    knowsAbout: [
      "Wedding Venue",
      "Conference Center",
      "Catering Services",
      "Event Planning",
      "Guesthouse Accommodation",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const weddingsPageSEO: AstroSEO = {
  title: "Weddings",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Host your dream wedding at Summerwood Country Estate. Accommodating 20 to 500 guests across 5 stunning venues, including our Forest Chapel, elegant Hall, and unique White Marquee Tent.",
  canonical: "https://www.summerwoodcountryestate.co.za/weddings",
  openGraph: {
    basic: {
      title: "Dream Wedding Venues & Chapels in Bloemfontein | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/weddings",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate Wedding Venues",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Bloemfontein wedding venues, forest chapel Free State, garden wedding Bloemfontein, marquee tent wedding, wedding venue hire, intimate wedding venues, farm wedding Free State",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/weddings",
    description:
      "A premier collection of 5 wedding venues and chapels in Bloemfontein. Offering full-service catering, wedding planning, and coordination for up to 500 guests.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Wedding Ceremonies",
      "Wedding Receptions",
      "Outdoor Chapel Hire",
      "Marquee Tent Events",
      "Event Catering",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const conferencesPageSEO: AstroSEO = {
  title: "Conferences",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Host productive corporate events away from the city hustle. Summerwood offers flexible conference venues in Bloemfontein for 20 to 500 people, with full-day, half-day, and breakfast packages.",
  canonical: "https://www.summerwoodcountryestate.co.za/conferences",
  openGraph: {
    basic: {
      title: "Conference & Corporate Event Venues Bloemfontein | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/conferences",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate Conference Venues",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Bloemfontein conference venues, corporate event spaces Free State, half day conference packages, cinema style seating venue, business seminar locations, corporate catering Bloemfontein",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/conferences",
    description:
      "Professional corporate function and conference venues just outside Bloemfontein. Accommodating 20 to 500 delegates with secure parking, custom seating layouts, and full catering packages.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Corporate Conferences",
      "Business Seminars",
      "Half-day Conference Packages",
      "Full-day Conference Packages",
      "Corporate Catering",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const functionsPageSEO: AstroSEO = {
  title: "Functions",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Celebrate your special events at Summerwood Country Estate. Explore 6 versatile function venues in Bloemfontein, from an intimate underground Wine Cellar to our grand Marquee Tent.",
  canonical: "https://www.summerwoodcountryestate.co.za/functions",
  openGraph: {
    basic: {
      title: "Private Functions & Gala Event Venues Bloemfontein | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/functions",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate Private Function Venues",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "private function venues Bloemfontein, year-end function spaces Free State, birthday party venues, intimate dining room hire, underground wine cellar event, gala dinner venue Bloemfontein",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/functions",
    description:
      "A premium range of event venues for birthday parties, private dinners, anniversary celebrations, and year-end functions. Hosting intimate groups of 10 up to large events of 500.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Private Parties",
      "Year-End Functions",
      "Gala Dinners",
      "Wine Tastings",
      "Private Event Catering",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const accommodationPageSEO: AstroSEO = {
  title: "Accommodation",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Tranquil country guesthouse accommodation just 4.5km outside Bloemfontein on the R700. Enjoy comfortable suites, a family unit, and peaceful garden surroundings with easy N1 access.",
  canonical: "https://www.summerwoodcountryestate.co.za/accommodation",
  openGraph: {
    basic: {
      title: "Country Guesthouse & Suites in Bloemfontein | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/accommodation",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate & Guesthouse Accommodation",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Bloemfontein accommodation, guesthouse Free State, country stay R700 Bloemfontein, honeymoon suite venue, bridal preparation room, family holiday accommodation, N1 overnight stay",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/accommodation",
    description:
      "Comfortable country guesthouse accommodation featuring individual double suites, an executive presidential suite, and a family unit. Located close to the N1 highway on the R700.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
      "https://www.lekkeslaap.co.za/accommodation/summerwood-country-estate--guesthouse",
    ],
    knowsAbout: [
      "Guesthouse Accommodation",
      "Honeymoon Suites",
      "Bridal Preparation",
      "Family Suites",
      "Country Retreats",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const wineTastingPageSEO: AstroSEO = {
  title: "Wine Tasting",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Add a touch of sophistication to your corporate or private function with a premium, personalized wine-tasting experience in our underground wine cellar.",
  canonical: "https://www.summerwoodcountryestate.co.za/wine-tasting",
  openGraph: {
    basic: {
      title: "Private & Corporate Wine Tasting Experiences | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/wine-tasting",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate Wine Cellar and Tastings",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "wine tasting Bloemfontein, private wine tasting events, corporate wine tasting Free State, underground wine cellar, team building wine events, custom function packages",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/wine-tasting",
    description:
      "Bespoke private and corporate wine-tasting experiences hosted at Summerwood Country Estate. Complete with snack platters, formal pairings, and personalized event styling.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Wine Tastings",
      "Wine Pairings",
      "Corporate Hospitality",
      "Private Functions",
      "Event Planning",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const montelloPageSEO: AstroSEO = {
  title: "Montello Caterers",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Established in 1994 by Dorothy van der Merwe-Strydom, Montello Caterers is one of Bloemfontein's premier catering companies and the culinary foundation behind Summerwood Country Estate.",
  canonical: "https://www.summerwoodcountryestate.co.za/montello-caterers",
  openGraph: {
    basic: {
      title: "Montello Caterers | Elite Event & Wedding Catering Bloemfontein",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/montello-caterers",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Montello Caterers - Event, Wedding and Corporate Catering",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Montello Caterers, Bloemfontein catering companies, wedding caterers Free State, corporate event catering, Dorothy van der Merwe, platteland wedding catering, large scale congress catering",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Montello Caterers",
    url: "https://www.summerwoodcountryestate.co.za/montello-caterers",
    description:
      "Renowned professional catering service specializing in large-scale corporate events, university congresses, and elegant country weddings for up to 500 people across the Free State and beyond.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Event Catering",
      "Wedding Catering",
      "Corporate Hospitality",
      "Large Scale Congresses",
      "Buffet and Banquet Services",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};

export const galleryPageSEO: AstroSEO = {
  title: "Gallery",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Browse through our photo gallery featuring Summerwood Country Estate's wedding and function venues, luxury accommodation suites, and premium catering setups by Montello Caterers.",
  canonical: "https://www.summerwoodcountryestate.co.za/gallery",
  openGraph: {
    basic: {
      title: "Photo Gallery | Venues, Accommodation & Catering | Summerwood",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/gallery",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Summerwood Country Estate and Montello Caterers Gallery",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "Summerwood gallery, Bloemfontein wedding photos, country estate setup, guesthouse interior photography, event catering pictures, function layouts Free State",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Summerwood Country Estate Photo Gallery",
    url: "https://www.summerwoodcountryestate.co.za/gallery",
    description:
      "A curated collection of photos showcasing our beautiful event venues, tranquil country suites, and professional catering presentations.",
    sourceOrganization: {
      "@type": "LocalBusiness",
      name: "Summerwood Country Estate",
      address: {
        "@type": "PostalAddress",
        streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
        addressLocality: "Bloemfontein",
        addressRegion: "Free State",
        postalCode: "9300",
        addressCountry: "ZA",
      },
    },
  },
};

export const contactPageSEO: AstroSEO = {
  title: "Contact Us",
  titleTemplate: "%s | Summerwood Country Estate",
  description:
    "Get in touch with Summerwood Country Estate & Guesthouse. Find our phone number, email address, physical location, and GPS coordinates for our venue in Bloemfontein.",
  canonical: "https://www.summerwoodcountryestate.co.za/contact-us",
  openGraph: {
    basic: {
      title:
        "Contact Summerwood Country Estate | Bloemfontein Venue & Guesthouse",
      type: "website",
      image:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      url: "https://www.summerwoodcountryestate.co.za/contact-us",
    },
    optional: {
      siteName: "Summerwood Country Estate",
      locale: "en_ZA",
    },
    image: {
      url: "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      secureUrl:
        "https://www.summerwoodcountryestate.co.za/summerwood_og_image.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Contact Summerwood Country Estate",
    },
  },
  extend: {
    meta: [
      {
        name: "keywords",
        content:
          "contact Summerwood, Summerwood Bloemfontein phone number, Mimosa Park address, Summerwood directions, event booking Bloemfontein, hospitality enquiries Free State",
      },
    ],
  },
  removeTrailingSlashForRoot: true,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Summerwood Country Estate",
    url: "https://www.summerwoodcountryestate.co.za/contact-us",
    description:
      "Contact information, directions, and physical address for Summerwood Country Estate & Guesthouse located in Mimosa Park, Bloemfontein.",
    email: "enquiries@summerwoodcountryestate.co.za",
    sameAs: [
      "https://www.instagram.com/summerwoodcountryestate/",
      "https://www.facebook.com/Summerwood",
    ],
    knowsAbout: [
      "Event Venue Hire",
      "Guesthouse Bookings",
      "Function Quotes",
      "Catering Inquiries",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Mimosa Park, Mimosa Park Small Holdings",
      addressLocality: "Bloemfontein",
      addressRegion: "Free State",
      postalCode: "9300",
      addressCountry: "ZA",
    },
  },
};
