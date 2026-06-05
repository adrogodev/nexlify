import { NextResponse } from "next/server";
import { AuthApi } from "@/src/features/auth/api/auth.api";

export async function GET() {
  try {
    const authApi = new AuthApi();
    const result = await authApi.GetUserData();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
