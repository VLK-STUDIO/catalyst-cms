import { cms } from "@/cms";

export async function generateMetadata() {
  const seo = await cms.data.seo.get();

  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function Home() {
  const articles = await cms.data.articles.find();

  return (
    <div className="h-full bg-gray-800">
      <div className="flex flex-col max-w-2xl mx-auto p-12 gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="font-black text-white text-3xl">Overcatalysted</h1>
          <h3 className="text-gray-300 font-serif">
            A demo blog made with Catalyst CMS
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <div key={article.title} className="flex flex-col gap-2">
              <h2 className="text-pink-300 font-black text-2xl">
                {article.title}
              </h2>
              <span
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="prose prose-invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
