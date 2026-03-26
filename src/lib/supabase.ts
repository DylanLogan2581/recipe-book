import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const hasSupabaseConfig =
  url !== undefined && url !== "" && anonKey !== undefined && anonKey !== "";

export const supabase: SupabaseClient<Database> | null = hasSupabaseConfig
  ? createClient<Database>(url, anonKey)
  : null;
