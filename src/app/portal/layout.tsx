export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center items-center w-full min-h-screen">
      {children}
    </section>
  );
}
