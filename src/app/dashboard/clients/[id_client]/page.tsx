import { ClientDetailTemplate } from "@/src/features/dashboard/clients/template/client-detail.template";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id_client: string }>;
}) {
  const { id_client } = await params;
  const id = Number(id_client);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <section className="w-full h-full p-4">
        <p className="text-sm text-muted-foreground">Cliente no encontrado</p>
      </section>
    );
  }

  return (
    <section className="w-full h-full">
      <ClientDetailTemplate id_client={id} />
    </section>
  );
}
