import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '@/store/themeSlice';
import { saveTheme } from '@/utils/tauriStore';
import { RootState } from '@/store';

export const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const toggle = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';

    dispatch(setMode(newMode));
    await saveTheme(newMode);
  };

  return <button onClick={toggle}>Switch Theme</button>;
};
