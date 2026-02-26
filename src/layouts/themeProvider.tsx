// src/components/ThemeProvider.tsx
import { ConfigProvider, theme } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/store';
// import { setMode } from '@/store/theme/themeSlice.ts';
// import Cookies from '@/utils/cookie.ts';
// import { setLang } from '@/store/lang.ts';
import { getTheme, setTheme } from '@/utils/store';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const bgColor = mode === 'dark' ? '#2d2b30' : undefined;
  const bodyColor = mode === 'dark' ? '#1f1f1f' : undefined;
  const primaryColor = mode === 'dark' ? '#9254de' : undefined;
  const siderColor = mode === 'dark' ? '#2d2b30' : undefined;
  const textColor = mode === 'dark' ? '#cda8f0' : undefined;

  //
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme) {
        setTheme(savedTheme);
      }
    };
  });

  // 监听mode
  useEffect(() => {
    if (mode) {
      setTheme(mode);
    }
  }, [mode]);

  // // 主题 & 语言 轮询同步
  // useEffect(() => {
  //     let lastTheme = ''
  //     let lastLang = ''
  //     const syncThemeFromCookie = () => {
  //         const theme = Cookies.get('theme')
  //         if (theme && theme !== lastTheme) {
  //             dispatch(setMode(theme))
  //             lastTheme = theme
  //         }
  //     }

  //     const syncLangFromCookie = () => {
  //         const lang = Cookies.get('lang')
  //         if (lang && lang !== lastLang) {
  //             dispatch(setLang(lang))
  //             lastLang = lang
  //         }
  //     }
  //     const timerTheme = setInterval(syncThemeFromCookie, 500); // 每 500ms 轮询
  //     const timerLang = setInterval(syncLangFromCookie, 500); // 每 500ms 轮询

  //     return () => {
  //         clearInterval(timerTheme)
  //         clearInterval(timerLang)
  //     };

  // }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor, // dark: 蓝色，light: Cyan
        },
        components: {
          Layout: {
            headerBg: bgColor,
            siderBg: siderColor,
            triggerBg: siderColor,
            triggerColor: textColor,
            // colorBgHeader: "#915498",
            headerHeight: '4vh',
            // headerColor: '#f56215'
            bodyBg: bodyColor,
          },
          Menu: {
            itemBg: siderColor,
            itemHoverBg: bgColor,
            itemSelectedBg: bgColor,
            itemSelectedColor: textColor,
            activeBarBorderWidth: '0px',
            // itemHoverColor: mode === "dark" ? darkColor :
          },
          Tabs: {
            horizontalMargin: '0 0 10px 0',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
