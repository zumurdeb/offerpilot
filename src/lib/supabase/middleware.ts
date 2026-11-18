import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase auth cookie on every matching request. This is the
 * only place session refresh happens outside of an explicit sign-in/out, so
 * skipping it (or returning a different response object without copying the
 * cookies) silently logs people out.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Required: this call refreshes the session and must not be removed or
  // optimized away, even though its return value isn't used directly here.
  await supabase.auth.getUser();

  return response;
}
