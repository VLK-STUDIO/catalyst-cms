import { createCatalyst } from "catalyst-cms";

export const cms = createCatalyst({
  collections: {
    articles: {
      previewUrl: "http://localhost:3000/",
      label: "Articles",
      fields: {
        title: {
          type: "text",
          label: "Title",
        },
        content: {
          type: "richtext",
          label: "Content",
          localised: true,
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
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
  auth: {
    fields: {
      fullName: {
        type: "text",
        label: "Full name",
      },
    },
  },
});
