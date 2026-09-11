import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  cargando: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  cargando: true,
}));

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({ user: data.session?.user ?? null, cargando: false });
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({ user: session?.user ?? null, cargando: false });
  });
}
