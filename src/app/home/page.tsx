"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PlaceholderComponent } from "@/src/shared/components";
import { useAppDispatch, useAppSelector } from "@/src/shared/stores";
import { getUserData, logout, selectUserData } from "@/src/shared/stores/slices/auth.slice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: user, status, user_state, error } = useAppSelector(selectUserData);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      dispatch(logout());
      router.push("/auth");
    }
  };

  if (status === "loading" || user_state === "checking") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg">Verificando sesión...</p>
      </main>
    );
  }

  if (status === "error" || user_state === "unauthenticated") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
        <p className="text-red-400">{error ?? "No has iniciado sesión"}</p>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="px-4 py-2 border border-gray-500 rounded-md text-sm cursor-pointer hover:bg-gray-900 transition-colors"
        >
          Ir a iniciar sesión
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-6">
      <PlaceholderComponent name={user?.name!} username={user?.username!}/>
      <h1 className="text-3xl font-bold">nexlify</h1>

      <section className="border border-gray-700 rounded-lg p-6 w-80 space-y-3">
        <h2 className="text-lg font-semibold text-center">Datos del usuario</h2>


        {user && (
          <div className="text-sm space-y-1.5">
            <p><span className="text-gray-400">ID:</span> {user.id}</p>
            <p><span className="text-gray-400">Usuario:</span> {user.username ?? "—"}</p>
            <p><span className="text-gray-400">Nombre:</span> {user.name ?? "—"}</p>
            <p><span className="text-gray-400">IP conexión:</span> {user.ip_connection ?? "—"}</p>
            <p><span className="text-gray-400">Admin:</span> {user.is_admin ? "Sí" : "No"}</p>
            <p><span className="text-gray-400">Activo:</span> {user.is_active ? "Sí" : "No"}</p>
          </div>
        )}

        {!user && (
          <p className="text-sm text-gray-400 text-center">No hay datos disponibles</p>
        )}
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="px-6 py-2 border border-red-500/50 text-red-400 rounded-md text-sm cursor-pointer hover:bg-red-950/30 transition-colors"
      >
        Cerrar sesión
      </button>
    </main>
  );
}

