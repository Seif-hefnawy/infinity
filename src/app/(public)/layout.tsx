export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {children}
    </main>
  );
}