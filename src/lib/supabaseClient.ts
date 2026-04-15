import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createFallbackSupabaseClient = () => {
  const notConfiguredError = new Error(
    "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );

  const fakeChannel = {
    on: () => fakeChannel,
    subscribe: () => fakeChannel,
  };

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: notConfiguredError };
      },
      async getUser() {
        return { data: { user: null }, error: notConfiguredError };
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error: notConfiguredError };
      },
      async signInWithOAuth() {
        return { data: { provider: null, url: null }, error: notConfiguredError };
      },
      async signOut() {
        return { error: null };
      },
      async updateUser() {
        return { data: { user: null }, error: notConfiguredError };
      },
      async resetPasswordForEmail() {
        return { data: null, error: notConfiguredError };
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe: () => undefined,
            },
          },
        };
      },
    },
    channel: () => fakeChannel,
    removeChannel: () => undefined,
  };
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabaseClient();