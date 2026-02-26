import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
