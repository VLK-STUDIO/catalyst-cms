import { cms } from "@/cms";
import Link from "next/link";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ArticlePage({ params }: Props) {
  const article = await cms.data.articles.findOne({
    filters: {
      slug: {
        $eq: params.slug
      }
    },
    include: ["title", "author", "content"]
  });

  return (
    <div className="flex flex-col gap-12">
      <Link href="/" className="text-2xl font-black text-pink-300">
        Overcatalysted
      </Link>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white">{article.title}</h1>
          <span className="text-sm text-gray-400">
            by {article.author.fullName}
          </span>
        </div>
        <div
          className="prose prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
