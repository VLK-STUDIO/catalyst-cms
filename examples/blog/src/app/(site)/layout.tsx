export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full bg-gray-800 overflow-y-auto">
      <div className="flex flex-col max-w-2xl mx-auto p-12 gap-12">
        {children}
      </div>
    </div>
  );
}
