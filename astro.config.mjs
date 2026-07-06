import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import node from "@astrojs/node";
import keystatic from "@keystatic/astro";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
// import critters from "@critters-rs/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap(),
    // critters(), // TODO: Find deps fix
    // aiReadiness({
    //   site: "https://www.summerwoodcountryestate.co.za/",
    //   organization: {
    //     name: "Summerwood Country Estate",
    //     url: "https://www.summerwoodcountryestate.co.za/",
    //     logo: "https://www.summerwoodcountryestate.co.za/logos/summerwood-logo-wide-new.png",
    //     founder: {
    //       name: "Dorothy van der Merwe",
    //       jobTitle: "Founder",
    //       sameAs: [
    //         "https://www.summerwoodcountryestate.co.za/",
    //         "https://www.facebook.com/Summerwood",
    //         "https://www.instagram.com/summerwoodcountryestate/",
    //         "https://www.lekkeslaap.co.za/accommodation/summerwood-country-estate--guesthouse",
    //       ],
    //     },
    //   },
    //   webSite: {
    //     description: "Summerwood Country Estate website",
    //   },
    //   llmsTxt: {
    //     // Optional. When set, the toolkit ships dist/llms.txt at build time.
    //     // Note: `summary` must be single-line — multi-paragraph summaries break
    //     // the llms.txt blockquote shape. Use `body` (free-form markdown) for
    //     // additional prose. Multi-line summary throws at config-validation time.
    //     summary: "Summerwood Country Estate website",
    //     sections: [
    //       {
    //         title: "Home",
    //         links: [
    //           {
    //             title: "Home",
    //             url: "https://www.summerwoodcountryestate.co.za/",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Weddings",
    //         links: [
    //           {
    //             title: "Weddings",
    //             url: "https://www.summerwoodcountryestate.co.za/weddings",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Conferences",
    //         links: [
    //           {
    //             title: "Conferences",
    //             url: "https://www.summerwoodcountryestate.co.za/conferences",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Functions",
    //         links: [
    //           {
    //             title: "Functions",
    //             url: "https://www.summerwoodcountryestate.co.za/functions",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Accommodation",
    //         links: [
    //           {
    //             title: "Accommodation",
    //             url: "https://www.summerwoodcountryestate.co.za/accommodation",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Wine Tasting",
    //         links: [
    //           {
    //             title: "Wine Tasting",
    //             url: "https://www.summerwoodcountryestate.co.za/accommodation",
    //           },
    //           {
    //             title: "Wine Tasting - Contact Us",
    //             url: "https://www.summerwoodcountryestate.co.za/contact-us",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Montello Caterers",
    //         links: [
    //           {
    //             title: "Montello Caterers",
    //             url: "https://www.summerwoodcountryestate.co.za/montello-caterers",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Gallery",
    //         links: [
    //           {
    //             title: "Gallery",
    //             url: "https://www.summerwoodcountryestate.co.za/gallery",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Contact Us",
    //         links: [
    //           {
    //             title: "Contact Us",
    //             url: "https://www.summerwoodcountryestate.co.za/contact-us",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Links",
    //         links: [
    //           {
    //             title: "Summerwood Country Estate - Facebook",
    //             url: "https://www.facebook.com/Summerwood",
    //           },
    //           {
    //             title: "Summerwood Country Estate - Instagram",
    //             url: "https://www.instagram.com/summerwoodcountryestate/",
    //           },
    //           {
    //             title: "Summerwood Country Estate - Lekkeslaap",
    //             url: "https://www.lekkeslaap.co.za/accommodation/summerwood-country-estate--guesthouse",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   agentsMd: {
    //     // Optional. When set, the toolkit ships dist/agents.md at build time.
    //     description:
    //       "Summerwood Country Estate website - for anyone looking for accommodation or host events at Summerwood Country Estate",
    //     audience:
    //       "People looking for accommodation or to host events at Summerwood Country Estate",
    //     contact: "enquiries@summerwoodcountryestate.co.za",
    //     links: [
    //       {
    //         title: "Home",
    //         url: "https://www.summerwoodcountryestate.co.za/",
    //         description: "Home page",
    //       },
    //       {
    //         title: "Weddings",
    //         url: "https://www.summerwoodcountryestate.co.za/weddings",
    //         description:
    //           "A showcase of weddings venues at Summerwood Country Estate",
    //       },
    //       {
    //         title: "Conferences",
    //         url: "https://www.summerwoodcountryestate.co.za/conferences",
    //         description:
    //           "A showcase of conferences and events hosted at Summerwood Country Estate",
    //       },
    //       {
    //         title: "Functions",
    //         url: "https://www.summerwoodcountryestate.co.za/functions",
    //         description:
    //           "A showcase of function/event venues at Summerwood Country Estate",
    //       },
    //       {
    //         title: "Accommodation",
    //         url: "https://www.summerwoodcountryestate.co.za/accommodation",
    //         description:
    //           "A showcase of suites available at Summerwood Country Estate",
    //       },
    //       {
    //         title: "Wine Tasting",
    //         url: "https://www.summerwoodcountryestate.co.za/wine-tasting",
    //         description: "Wine tasting at Summerwood Country Estate",
    //       },
    //       {
    //         title: "Montello Caterers",
    //         url: "https://www.summerwoodcountryestate.co.za/montello-caterers",
    //         description: "A showcase of catering by Montello Caterers",
    //       },
    //       {
    //         title: "Contact Us",
    //         url: "https://www.summerwoodcountryestate.co.za/contact-us",
    //         description: "How to get in contact with Summerwood Country Estate",
    //       },
    //       {
    //         title: "Summerwood Country Estate - Facebook",
    //         url: "https://www.facebook.com/Summerwood",
    //         description: "Summerwood Country Estate - Facebook link",
    //       },
    //       {
    //         title: "Summerwood Country Estate - Instagram",
    //         url: "https://www.instagram.com/summerwoodcountryestate/",
    //         description: "Summerwood Country Estate - Instagram link",
    //       },
    //       {
    //         title: "Summerwood Country Estate - Lekkeslaap",
    //         url: "https://www.lekkeslaap.co.za/accommodation/summerwood-country-estate--guesthouse",
    //         description: "Summerwood Country Estate - Book now on Lekkeslaap",
    //       },
    //     ],
    //   },
    // }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
