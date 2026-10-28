"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import {
  portalAssignCredentialsAction,
  portalVerifyAssignmentTokenAction,
} from "../actions/portal-recovery.actions";

export function PortalActivateTemplate() {
  const router = useRouter();
  const search_params = useSearchParams();
  const activate_token = search_params.get("token") ?? "";

  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [confirm, set_confirm] = useState("");
  const [is_sending, set_is_sending] = useState(false);

  const handle_submit = async () => {
    if (!activate_token) {
      toast.error("Falta el token de activación en el enlace");
      return;
    }
    if (!username || password.length < 8) {
      toast.error("Ingresa usuario y una contraseña de al menos 8 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    set_is_sending(true);
    const verification = await portalVerifyAssignmentTokenAction({
      assign_creds_token: activate_token,
    });
    if (!verification.ok) {
      set_is_sending(false);
      toast.error(
        "error" in verification
          ? String(verification.error)
          : "Token de activación inválido",
      );
      return;
    }
    const result = await portalAssignCredentialsAction({
      assign_creds_token: activate_token,
      username,
      password,
    });
    set_is_sending(false);
    if (result.ok) {
      toast.success(result.message ?? "Credenciales asignadas");
      router.push("/portal/login");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo asignar las credenciales");
    }
  };

  const input_class =
    "h-9 w-60 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <section className="select-none">
      <h1 className="font-bold text-xl text-center mb-0.5">Activar acceso</h1>
      <p className="text-xs text-center text-muted-foreground mb-3">
        Define tu usuario y contraseña para la plataforma
      </p>
      {!activate_token && (
        <p role="alert" className="text-sm text-red-500 text-center">
          Falta el token de activación. Usa el enlace del email.
        </p>
      )}
      <section className="flex flex-col items-center mt-3">
        <label htmlFor="p-act-username" className="text-sm self-start">
          Usuario
        </label>
        <input
          id="p-act-username"
          type="text"
          value={username}
          onChange={(e) => set_username(e.target.value)}
          className={input_class}
          autoComplete="username"
        />
        <label htmlFor="p-act-password" className="text-sm mt-3 self-start">
          Contraseña
        </label>
        <input
          id="p-act-password"
          type="password"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          className={input_class}
          autoComplete="new-password"
        />
        <label htmlFor="p-act-confirm" className="text-sm mt-3 self-start">
          Confirmar contraseña
        </label>
        <input
          id="p-act-confirm"
          type="password"
          value={confirm}
          onChange={(e) => set_confirm(e.target.value)}
          className={input_class}
          autoComplete="new-password"
        />
        <Button
          className="mt-4"
          onClick={handle_submit}
          disabled={is_sending || !activate_token}
        >
          {is_sending ? "Activando…" : "Activar"}
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

export default PortalActivateTemplate;
