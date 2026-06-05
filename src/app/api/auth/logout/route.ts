import { NextResponse } from "next/server";
import { AuthApi } from "@/src/features/auth/api/auth.api";

export async function POST() {
  try {
    const authApi = new AuthApi();
    await authApi.LogoutUser();
    return NextResponse.json({ ok: true, message: "Sesion cerrada" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
