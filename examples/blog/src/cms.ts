import { GoogleProvider, createCatalyst } from "catalyst-cms";
import slugify from "slugify";

export const cms = createCatalyst({
  collections: {
    users: {
      label: "Users",
      fields: {
        fullName: {
          type: "text",
          label: "Full name"
        },
        role: {
          type: "select",
          label: "Role",
          options: [
            {
              label: "Admin",
              value: "admin"
            },
            {
              label: "Editor",
              value: "editor"
            }
          ]
        }
      }
    },
    articles: {
      previewUrl: "http://localhost:3000/:slug",
      label: "Articles",
      fields: {
        title: {
          type: "text",
          label: "Title"
        },
        description: {
          type: "text",
          label: "Description",
          validate: v =>
            v.length > 64
              ? "Description must be less than 64 characters long"
              : null,
          optional: true
        },
        content: {
          type: "richtext",
          label: "Content",
          localized: true
        },
        author: {
          type: "reference",
          label: "Author",
          collection: "users",
          exposedColumn: "fullName"
        },
        slug: {
          type: "derived",
          label: "Slug",
          getter: doc => slugify(doc.title, { strict: true, lower: true })
        }
      }
    }
  },
  globals: {
    seo: {
      label: "SEO",
      fields: {
        title: {
          type: "text",
          label: "Title"
        },
        description: {
          type: "text",
          label: "Description"
        }
      }
    }
  },
  auth: {
    whitelist: {
      collection: "users",
      field: "email"
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ]
  }
});
