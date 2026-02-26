import { Menu } from 'antd';
import { IconFont } from '@/pages/components/IconFont';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingTwoTone } from '@ant-design/icons';

export const MenuLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  useEffect(() => {
    //Update the selected menu when route changes
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  type ItemType = Required<MenuProps>['items'][number];

  function getItem(
    label: string,
    key: string,
    icon?: React.ReactNode,
    children?: ItemType[],
  ): ItemType {
    return {
      key,
      icon,
      children,
      label,
    } as ItemType;
  }

  const items: ItemType[] = [
    getItem('Go', '/go', <IconFont type="icon-golang" />),
    getItem('Java', '/java', <IconFont type="icon-java" />),
    getItem('JS', '/js', <IconFont type="icon-JavaScript" />),
    getItem('Python', '/python', <IconFont type="icon-python" />),
    getItem('Rust', '/rust', <IconFont type="icon-rust" />),
    getItem('V', '/v', <IconFont type="icon-vlang" />),
    getItem('Zig', '/zig', <IconFont type="icon-zig" />),
    getItem('Settings', '/settings', <SettingTwoTone />),
  ];

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key);
  };

  return (
    <>
      <div className="demo-logo-vertical" />
      <Menu mode="inline" selectedKeys={[selectedKey]} onClick={onClick} items={items} />
    </>
  );
};
