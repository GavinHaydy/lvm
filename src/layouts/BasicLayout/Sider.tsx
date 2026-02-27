// src/layouts/BasicLayout/Sider.tsx
import { Menu, Button, Select } from 'antd';
import { IconFont } from '@/shared/components/IconFont';
import { SettingTwoTone } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { saveTheme } from '@/shared/utils/tauriStore';
import { setMode } from '@/features/theme/themeSlice';
import i18n from '@/features/i18n';
import { LangEnum } from '@/core/constants/enum';

export const Sider: React.FC<{ collapsed: boolean; onCollapse: (collapsed: boolean) => void }> = ({
  collapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [language, setLanguage] = useState<string>('zh');

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const items = [
    { label: 'Go', key: '/go', icon: <IconFont type="icon-golang" /> },
    { label: 'Java', key: '/java', icon: <IconFont type="icon-java" /> },
    { label: 'JS', key: '/js', icon: <IconFont type="icon-JavaScript" /> },
    { label: 'Python', key: '/python', icon: <IconFont type="icon-python" /> },
    { label: 'Rust', key: '/rust', icon: <IconFont type="icon-rust" /> },
    { label: 'V', key: '/v', icon: <IconFont type="icon-vlang" /> },
    { label: 'Zig', key: '/zig', icon: <IconFont type="icon-zig" /> },
    { label: 'Settings', key: '/settings', icon: <SettingTwoTone /> },
  ];

  const handleMenuClick = (e: any) => {
    navigate(e.key);
  };

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';

    dispatch(setMode(newMode));
    await saveTheme(newMode);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <div style={{ width: collapsed ? 80 : 200, transition: 'width 0.3s' }}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={items.map(item => ({
          key: item.key,
          icon: item.icon,
          label: collapsed ? null : item.label,
        }))}
      />
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button onClick={toggleTheme} block>
          {mode === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </Button>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: '100%', marginTop: '16px' }}
          options={[
            { value: LangEnum.ZH, label: '中文' },
            { value: LangEnum.EN, label: 'English' },
          ]}
        />
      </div>
    </div>
  );
};
