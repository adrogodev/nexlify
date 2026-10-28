import { EmailDetailTemplate } from "@/src/features/dashboard/emails/template/email-detail.template";

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ emailId: string }>;
}) {
  const { emailId } = await params;
  return (
    <section className="w-full h-full flex justify-center">
      <EmailDetailTemplate email_id={emailId} />
    </section>
  );
}
