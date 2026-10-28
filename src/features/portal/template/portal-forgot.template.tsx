"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import { portalForgotPasswordAction } from "../actions/portal-recovery.actions";

export function PortalForgotTemplate() {
  const [username, set_username] = useState("");
  const [sent, set_sent] = useState(false);
  const [is_sending, set_is_sending] = useState(false);

  const handle_submit = async () => {
    set_is_sending(true);
    const result = await portalForgotPasswordAction({ username });
    set_is_sending(false);
    if (result.ok) {
      set_sent(true);
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo procesar la solicitud");
    }
  };

  const input_class =
    "h-9 w-60 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <section className="select-none">
      <h1 className="font-bold text-xl text-center mb-0.5">
        Recuperar contraseña
      </h1>
      {sent ? (
        <p className="text-sm text-center mt-4 max-w-xs mx-auto">
          Si el usuario existe se enviará un email con instrucciones para
          restablecer la contraseña.
        </p>
      ) : (
        <section className="flex flex-col items-center mt-3">
          <label htmlFor="p-forgot-username" className="text-sm self-start">
            Usuario
          </label>
          <input
            id="p-forgot-username"
            type="text"
            value={username}
            onChange={(e) => set_username(e.target.value)}
            placeholder="Tu usuario asignado"
            className={input_class}
            autoComplete="username"
          />
          <Button
            className="mt-4"
            onClick={handle_submit}
            disabled={is_sending}
          >
            {is_sending ? "Enviando…" : "Enviar instrucciones"}
          </Button>
        </section>
      )}
      <nav className="text-xs mt-6 text-center" aria-label="Volver">
        <Link href="/portal/login" className="underline underline-offset-2">
          ← Volver a iniciar sesión
        </Link>
      </nav>
    </section>
  );
}

export default PortalForgotTemplate;
