import { Store } from '@tauri-apps/plugin-store';

export let store: Store | null = null;

const getStore = async () => {
  if (!store) {
    store = await Store.load('settings.json');
  }
  return store;
};

export const setTheme = async (theme: string) => {
  const s = await getStore();
  await s.set('theme', theme);
  await s.save();
};

export const getTheme = async () => {
  const s = await getStore();
  return await s.get<string>('theme');
};
