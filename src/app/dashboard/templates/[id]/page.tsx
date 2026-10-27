import { TemplateEditTemplate } from "@/src/features/dashboard/templates/template/template-edit.template";

export default async function TemplateEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TemplateEditTemplate id_template={id} />;
}
