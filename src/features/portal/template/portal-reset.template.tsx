"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import { portalResetPasswordAction } from "../actions/portal-recovery.actions";

export function PortalResetTemplate() {
  const router = useRouter();
  const search_params = useSearchParams();
  const recovery_token = search_params.get("token") ?? "";

  const [password, set_password] = useState("");
  const [confirm, set_confirm] = useState("");
  const [is_sending, set_is_sending] = useState(false);

  const handle_submit = async () => {
    if (!recovery_token) {
      toast.error("Falta el token de recuperación en el enlace");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    set_is_sending(true);
    const result = await portalResetPasswordAction({
      recovery_token,
      password,
    });
    set_is_sending(false);
    if (result.ok) {
      toast.success(result.message ?? "Contraseña restablecida");
      router.push("/portal/login");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo restablecer la contraseña");
    }
  };

  const input_class =
    "h-9 w-60 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <section className="select-none">
      <h1 className="font-bold text-xl text-center mb-0.5">Nueva contraseña</h1>
      {!recovery_token && (
        <p role="alert" className="text-sm text-red-500 text-center mt-3">
          Falta el token de recuperación. Usa el enlace del email.
        </p>
      )}
      <section className="flex flex-col items-center mt-3">
        <label htmlFor="p-reset-password" className="text-sm self-start">
          Contraseña nueva
        </label>
        <input
          id="p-reset-password"
          type="password"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          className={input_class}
          autoComplete="new-password"
        />
        <label htmlFor="p-reset-confirm" className="text-sm mt-3 self-start">
          Confirmar contraseña
        </label>
        <input
          id="p-reset-confirm"
          type="password"
          value={confirm}
          onChange={(e) => set_confirm(e.target.value)}
          className={input_class}
          autoComplete="new-password"
        />
        <Button
          className="mt-4"
          onClick={handle_submit}
          disabled={is_sending || !recovery_token}
        >
          {is_sending ? "Restableciendo…" : "Restablecer"}
        </Button>
      </section>
      <nav className="text-xs mt-6 text-center" aria-label="Volver">
        <Link href="/portal/login" className="underline underline-offset-2">
          ← Volver a iniciar sesión
        </Link>
      </nav>
    </section>
  );
}

export default PortalResetTemplate;
