import { createCatalyst } from "catalyst-cms";

export const cms = createCatalyst({
  collections: {
    users: {
      label: "Users",
      fields: {
        fullName: {
          type: "text",
          label: "Full name",
        },
      },
    },
    articles: {
      previewUrl: "http://localhost:3000/",
      label: "Articles",
      fields: {
        title: {
          type: "text",
          label: "Title",
        },
        description: {
          type: "text",
          label: "Description",
        },
        content: {
          type: "richtext",
          label: "Content",
          localized: true,
        },
        author: {
          type: "reference",
          label: "Author",
          collection: "users",
          exposedColumn: "fullName",
        },
      },
    },
  },
  globals: {
    seo: {
      label: "SEO",
      fields: {
        title: {
          type: "text",
          label: "Title",
        },
        description: {
          type: "text",
          label: "Description",
        },
      },
    },
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
});
