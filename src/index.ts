import { makeDOMDriver } from '@cycle/dom';
import { makeSupabaseAuthDriver } from './supabase';
import { run } from '@cycle/run';
import { App } from './App';

document.addEventListener('DOMContentLoaded', () => {
  run(App, {
    DOM: makeDOMDriver('#app'),
    Supabase: makeSupabaseAuthDriver(),
  });
});
