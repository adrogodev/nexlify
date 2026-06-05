import { NextResponse } from "next/server";
import { AuthApi } from "@/src/features/auth/api/auth.api";
import type { IAuthApiRequestObject } from "@/src/features/auth/actions/objects";

export async function POST(request: Request) {
  try {
    const body: IAuthApiRequestObject = await request.json();
    const authApi = new AuthApi();
    const result = await authApi.AuthUser(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
