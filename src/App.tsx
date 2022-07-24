import xs, { type Stream } from 'xstream';
import { type MainDOMSource, type VNode } from '@cycle/dom';
import { jsx } from 'snabbdom';
import { type SupabaseSource, type SupabaseSink, type SupabaseIncoming } from './supabase';

type State = Stream<SupabaseIncoming[1]>;
type View = Stream<VNode>;

function intent(dom$: MainDOMSource): SupabaseSink {
  const signIn$ = dom$
    .select('.App__signInButton')
    .events('click')
    .mapTo('signedIn' as const);
  
  const signOut$ = dom$
    .select('.App__signOutButton')
    .events('click')
    .mapTo('signedOut' as const);

  return xs.merge(signIn$, signOut$);
}

function model(action$: SupabaseSource): State {
  return action$
    .map(([ _, session ]) => session)
    .startWith(null);
}

function view(state$: State): View {
  return state$
    .map((state) => (
      <div>
        {state
        ? <button attrs={{ class: 'btn btn-lg App__signOutButton' }}>ログアウト</button>
        : <button attrs={{ class: 'btn btn-lg App__signInButton' }}>ログイン by Slack</button>
        }
      </div>
    ));
}

interface Sources {
  DOM: MainDOMSource;
  Supabase: SupabaseSource;
}

interface Sinks {
  DOM: View;
  Supabase: SupabaseSink;
} 

export const App = (sources: Sources): Sinks => ({
  DOM: view(model(sources.Supabase)),
  Supabase: intent(sources.DOM),
});
