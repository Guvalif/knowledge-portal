import xs, { type Stream } from 'xstream';
import { type MainDOMSource, type VNode } from '@cycle/dom';
import { jsx } from 'snabbdom';
import { type Session } from '@supabase/supabase-js';

function intent(dom$: MainDOMSource) {
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

function model(props$: Stream<Props>) {
  return props$
    .map(({ session }) => session)
    .startWith(null);
}

type State = ReturnType<typeof model>;

function view(state$: State) {
  return state$
    .map((state) => (
      <header attrs={{ class: 'navbar' }}>
        <section attrs={{ class: 'navbar-section' }}>
          <a attrs={{ href: '#', class: 'navbar-brand m-2' }}>Knowledge Portal</a>
        </section>
        <section attrs={{ class: 'navbar-section' }}>
          {state
          ? <button attrs={{ class: 'btn btn-sm m-2 NavigationBar__signOutButton' }}>ログアウト</button>
          : <button attrs={{ class: 'btn btn-sm m-2 btn-primary NavigationBar__signInButton' }}>ログイン by Slack</button>
          }
        </section>
      </header>
    ));
}

interface Props {
  session: Session | null;
}

interface Sources {
  DOM: MainDOMSource;
  Props: Stream<Props>;
}

interface Sinks {
  DOM: Stream<VNode>;
  Intents: ReturnType<typeof intent>;
}

export function NavigationBar({ DOM, Props }: Sources): Sinks {
  return ({
    DOM: view(model(Props)),
    Intents: intent(DOM),
  });
}
