import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zh from './locales/zh.json';

const initI18n = () => {
  return i18n.use(initReactI18next).init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });
};
export const initializeI18n = initI18n;
export default i18n;
