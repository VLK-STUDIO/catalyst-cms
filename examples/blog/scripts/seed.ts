import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const client = new MongoClient(process.env.MONGODB_URI!);

client
  .connect()
  .then(async c => {
    await Promise.all([
      c
        .db()
        .collection("users")
        .updateOne(
          { _id: new ObjectId("644a7b5b9955bfc3c588198e") },
          {
            $set: {
              _id: new ObjectId("644a7b5b9955bfc3c588198e"),
              fullName: "Adam Bravoran",
              role: "admin"
            }
          },
          {
            upsert: true
          }
        ),
      c
        .db()
        .collection("articles")
        .updateOne(
          { _id: new ObjectId("644e87f8de82124fc0388c4f") },
          {
            $set: {
              _id: new ObjectId("644e87f8de82124fc0388c4f"),
              title: "npm audit: Broken by Design",
              description:
                "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
              "content.en":
                "<p>Security is important. Nobody wants to be the person advocating for less security. So nobody wants to say it. But somebody has to say it.</p><p>So I guess I’ll say it.</p><p>The way<strong> </strong><code>npm audit</code> works is broken. Its rollout as a default after every <code>npm install</code> was rushed, inconsiderate, and inadequate for the front-end tooling.</p><p>Have you heard the story about the boy who cried wolf? Spoiler alert: the wolf eats the sheep. If we don’t want our sheep to be eaten, we need better tools.</p><p>As of today, <code>npm audit</code> is a stain on the entire npm ecosystem. The best time to fix it was before rolling it out as a default. The next best time to fix it is now.</p><p>In this post, I will briefly outline how it works, why it’s broken, and what changes I’m hoping to see.</p><hr><p><em>Note: this article is written with a critical and somewhat snarky tone. I understand it’s super hard to maintain massive projects like Node.js/npm, and that mistakes may take a while to become become apparent. I am frustrated only at the situation, not at the people involved. I kept the snarky tone because the level of my frustration has increased over the years, and I don’t want to pretend that the situation isn’t as dire as it really is. Most of all I am frustrated to see all the people for whom this is the first programming experience, as well as all the people who are blocked from deploying their changes due to irrelevant warnings. I am excited that this issue is being considered and I will do my best to provide input on the proposed solutions! 💜</em></p>",
              author: new ObjectId("644a7b5b9955bfc3c588198e"),
              slug: "npm-audit-broken-by-design"
            }
          },
          { upsert: true }
        ),
      c
        .db()
        .collection("seo")
        .updateOne(
          {
            _id: new ObjectId("ca7a1157610ba1ca7a1157ff")
          },
          {
            $set: {
              _id: new ObjectId("ca7a1157610ba1ca7a1157ff"),
              title: "Overcatalysted",
              description: "A demo blog made with Catalyst CMS"
            }
          },
          { upsert: true }
        )
    ]);

    await c.close();

    console.log("Catalyst: blog example seeded!");
  })
  .catch(err => {
    console.log("Example seed error:", err);
  });
