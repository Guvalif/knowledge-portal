import { type Stream } from 'xstream';
import { type MainDOMSource, type VNode } from '@cycle/dom';
import { type SupabaseSource, type SupabaseSink } from './supabase';
import { NavigationBar } from './interaction-domain/NavigationBar';

type MainDOMSink = Stream<VNode>;

interface Sources {
  DOM: MainDOMSource;
  Supabase: SupabaseSource;
}

interface Sinks {
  DOM: MainDOMSink;
  Supabase: SupabaseSink;
} 

export function App({ DOM, Supabase }: Sources): Sinks {
  const sinks = NavigationBar({
    DOM,
    Props: Supabase.map(([ _, session ]) => ({ session })),
  });

  return ({
    DOM: sinks.DOM,
    Supabase: sinks.Intents,
  });
};
