import "./global.css";

export const metadata = {
  title: "Catalyst Blog Example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full relative">{children}</body>
    </html>
  );
}
