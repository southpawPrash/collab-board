import "./globals.css";

export const metadata = {
  title: "Collab Board",
  description: "Team collaboration app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">Collab Board</h1>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
