import { DiffuseForm } from "@/src/features/dashboard/emails/template/email-actions.templates";
import { SendEmailTemplate } from "@/src/features/dashboard/emails/template/send-email.template";

export default function SendEmailPage() {
  return (
    <section className="w-full p-4 space-y-6">
      <SendEmailTemplate />
      <section className="w-full max-w-2xl px-4">
        <DiffuseForm />
      </section>
    </section>
  );
}
