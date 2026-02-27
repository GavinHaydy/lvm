import { Store as TauriStore } from '@tauri-apps/plugin-store';

let tauriStore: TauriStore | null = null;

function isTauri() {
  return '__TAURI__' in window;
}

async function getStore() {
  if (!isTauri()) {
    console.warn('Not running in Tauri environment');
    return null;
  }

  if (!tauriStore) {
    tauriStore = await TauriStore.load('settings.json');
  }

  return tauriStore;
}

export async function saveTheme(theme: string) {
  const store = await getStore();
  if (!store) return;

  await store.set('theme', theme);
  await store.save();
}

export async function loadTheme(): Promise<string | null> {
  const store = await getStore();
  if (!store) return null;

  return (await store.get<string>('theme')) || 'light';
}
