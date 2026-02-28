// src/layouts/BasicLayout/index.tsx
import { Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sider } from './Sider';

const { Content, Sider: AntdSider } = Layout;

export const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AntdSider width={200} theme="light" collapsed={collapsed}>
        <Sider collapsed={collapsed} onCollapse={() => setCollapsed} />
      </AntdSider>

      <Content style={{ padding: '16px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};
