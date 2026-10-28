"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import { portalSignInAction } from "../actions/portal-auth.actions";

const input_class =
  "h-9 w-60 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function PortalLoginTemplate() {
  const router = useRouter();
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [error, set_error] = useState<string | null>(null);
  const [is_submitting, set_is_submitting] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handle_submit = async () => {
    set_is_submitting(true);
    const result = await portalSignInAction({ username, password });
    set_is_submitting(false);
    if (result.ok) {
      router.push("/portal");
    } else {
      set_error(
        result.error ? String(result.error) : "Hubo un error al iniciar sesión",
      );
    }
  };

  return (
    <section className="select-none">
      <h1 className="font-bold text-xl text-center mb-0.5">
        Portal del cliente
      </h1>
      <p className="italic text-xs text-center mb-3">
        Accede con tus credenciales de acceso
      </p>
      <section className="flex flex-col items-center">
        <label htmlFor="p-username" className="text-sm self-start">
          Usuario
        </label>
        <input
          id="p-username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => set_username(e.target.value)}
          placeholder="Tu usuario asignado"
          className={input_class}
          autoComplete="username"
          onKeyDown={(e) => {
            if (e.key === "Enter") handle_submit();
          }}
        />
        <label htmlFor="p-password" className="text-sm mt-3 self-start">
          Contraseña
        </label>
        <input
          id="p-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          placeholder="Tu contraseña"
          className={input_class}
          autoComplete="current-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handle_submit();
          }}
        />
        <Button
          className="mt-4"
          onClick={handle_submit}
          disabled={is_submitting}
        >
          {is_submitting ? "Ingresando…" : "Ingresar"}
        </Button>
        <nav
          className="text-xs mt-6 space-x-3 text-muted-foreground"
          aria-label="Recuperación de acceso"
        >
          <Link
            href="/portal/forgot-password"
            className="underline underline-offset-2"
          >
            Olvidé mi contraseña
          </Link>
          <Link
            href="/portal/activate"
            className="underline underline-offset-2"
          >
            Activar acceso
          </Link>
        </nav>
      </section>
    </section>
  );
}

export default PortalLoginTemplate;
