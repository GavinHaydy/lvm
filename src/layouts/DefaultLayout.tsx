import { Layout } from 'antd';
import { useState } from 'react';
import { MenuLayout } from './MenuLayout';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  flexBasis: '15%',
  lineHeight: '120px',
};

export const GlobalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // <Flex gap={"middle"} wrap>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={siderStyle}>
        <MenuLayout />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
    // </Flex>
  );
};
