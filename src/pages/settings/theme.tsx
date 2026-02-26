import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '@/store/themeSlice';
import { saveTheme } from '@/utils/tauriStore';
import { RootState } from '@/store';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

export const ThemeSwitch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const toggle = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';

    dispatch(setMode(newMode));
    await saveTheme(newMode);
  };

  return (
    <>
      <button onClick={toggle}>{t('switch_theme')}</button>
      <button onClick={() => i18n.changeLanguage('zh')}>中文</button>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
    </>
  );
};
