import { cms } from "@/cms";
import Link from "next/link";

export async function generateMetadata() {
  const seo = await cms.data.seo.get();

  return {
    title: seo.title,
    description: seo.description
  };
}

export default async function Home() {
  const articles = await cms.data.articles.find({
    include: ["title", "description", "author", "slug"]
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-white">Overcatalysted</h1>
        <h3 className="font-serif text-gray-300">
          A demo blog made with Catalyst CMS
        </h3>
      </div>
      <div className="flex flex-col gap-12">
        {articles.map(article => (
          <Link
            href={`/${article.slug}`}
            key={article.title}
            className="flex flex-col gap-2"
          >
            <h2 className="text-2xl font-black text-pink-300">
              {article.title}
            </h2>
            <span className="font-serif text-gray-200">
              {article.description}
            </span>
            <span className="text-xs text-gray-400">
              by {article.author.fullName}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
