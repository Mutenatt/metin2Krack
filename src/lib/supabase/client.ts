import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// persistSession solo tiene sentido en el navegador: este mismo cliente
// también se importa desde server components (página pública de build).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: typeof window !== "undefined" },
});
