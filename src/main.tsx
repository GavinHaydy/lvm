import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { setMode } from '@/store/themeSlice';
import { loadTheme } from '@/utils/tauriStore';
import { ThemeProvider } from '@/theme/ThemeProvider';

async function bootstrap() {
  const savedTheme = await loadTheme();

  if (savedTheme === 'dark' || savedTheme === 'light') {
    store.dispatch(setMode(savedTheme));
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
}

bootstrap();
