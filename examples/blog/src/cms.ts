import { createCatalyst } from "catalyst-cms";
import slugify from "slugify";

export const cms = createCatalyst(
  {
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
        previewUrl: "http://localhost:3000/:_id",
        label: "Articles",
        fields: {
          title: {
            type: "text",
            label: "Title"
          },
          description: {
            type: "text",
            label: "Description"
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
    i18n: {
      locales: ["en", "de"],
      defaultLocale: "en"
    }
  },
  {
    users: [
      {
        _id: {
          $oid: "644a7b5b9955bfc3c588198e"
        },
        email: "test@example.com",
        fullName: "Adam Bravoran"
      }
    ],
    articles: [
      {
        _id: {
          $oid: "644e87f8de82124fc0388c4f"
        },
        title: "npm audit: Broken by Design",
        description:
          "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
        content: {
          en: "<p>Security is important. Nobody wants to be the person advocating for less security. So nobody wants to say it. But somebody has to say it.</p><p>So I guess I’ll say it.</p><p>The way<strong> </strong><code>npm audit</code> works is broken. Its rollout as a default after every <code>npm install</code> was rushed, inconsiderate, and inadequate for the front-end tooling.</p><p>Have you heard the story about the boy who cried wolf? Spoiler alert: the wolf eats the sheep. If we don’t want our sheep to be eaten, we need better tools.</p><p>As of today, <code>npm audit</code> is a stain on the entire npm ecosystem. The best time to fix it was before rolling it out as a default. The next best time to fix it is now.</p><p>In this post, I will briefly outline how it works, why it’s broken, and what changes I’m hoping to see.</p><hr><p><em>Note: this article is written with a critical and somewhat snarky tone. I understand it’s super hard to maintain massive projects like Node.js/npm, and that mistakes may take a while to become become apparent. I am frustrated only at the situation, not at the people involved. I kept the snarky tone because the level of my frustration has increased over the years, and I don’t want to pretend that the situation isn’t as dire as it really is. Most of all I am frustrated to see all the people for whom this is the first programming experience, as well as all the people who are blocked from deploying their changes due to irrelevant warnings. I am excited that this issue is being considered and I will do my best to provide input on the proposed solutions! 💜</em></p>"
        },
        author: {
          $oid: "644a7b5b9955bfc3c588198e"
        },
        slug: "npm-audit-broken-by-design"
      },
      {
        _id: {
          $oid: "64524126440fc027907ee4c7"
        },
        title: "Before You memo()",
        description: "Rendering optimizations that come naturally.",
        content: {
          en: "<p>There are many articles written about React performance optimizations. In general, if some state update is slow, you need to:</p><ol><li><p>Verify you’re running a production build. (Development builds are intentionally slower, in extreme cases even by an order of magnitude.)</p></li><li><p>Verify that you didn’t put the state higher in the tree than necessary. (For example, putting input state in a centralized store might not be the best idea.)</p></li><li><p>Run React DevTools Profiler to see what gets re-rendered, and wrap the most expensive subtrees with <code>memo()</code>. (And add <code>useMemo()</code> where needed.)</p></li></ol><p>This last step is annoying, especially for components in between, and ideally a compiler would do it for you. In the future, it might.</p><p><strong>In this post, I want to share two different techniques.</strong> They’re surprisingly basic, which is why people rarely realize they improve rendering performance.</p><p><strong>These techniques are complementary to what you already know!</strong> They don’t replace <code>memo</code> or <code>useMemo</code>, but they’re often good to try first.</p>"
        },
        author: {
          $oid: "644a7b5b9955bfc3c588198e"
        },
        slug: "before-you-memo"
      }
    ],
    seo: {
      _id: {
        $oid: "ca7a1157610ba1ca7a1157ff"
      },
      description: "A demo blog made with Catalyst CMS",
      title: "Overcatalysted"
    }
  }
);
