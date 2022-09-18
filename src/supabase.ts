import xs, { type Stream } from 'xstream';
import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import { adapt } from '@cycle/run/lib/adapt';

export type SupabaseIncoming = [ AuthChangeEvent, Session | null ];
export type SupabaseOutgoing = 'signedIn' | 'signedOut';
export type SupabaseSource = Stream<SupabaseIncoming>;
export type SupabaseSink = Stream<SupabaseOutgoing>;

export function makeSupabaseAuthDriver() {
  const supabase = createClient(
    'https://ftygktspyaayniybsjyf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eWdrdHNweWFheW5peWJzanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgzMTg0NTksImV4cCI6MTk3Mzg5NDQ1OX0.nqALZec_TEiipr12Hxdl6KnJBxSgFcF9d02BI1vTs5Y',
  );

  function supabaseAuthDriver(outgoing$: SupabaseSink): SupabaseSource {
    outgoing$.addListener({
      next: async (action) => {
        const cases = {
          'signedIn': () => supabase.auth.signIn({
            provider: 'slack',
          }),
          'signedOut': () => supabase.auth.signOut(),
        };

        await cases[action]();
      },
      error: () => {},
      complete: () => {},
    });

    const incoming$ = xs.create<SupabaseIncoming>({
      start: listener => {
        supabase.auth.onAuthStateChange((event, session) => {
          listener.next([ event, session ]);
        });
      },
      stop: () => {},
    });

    return adapt(incoming$);
  }

  return supabaseAuthDriver;
}
