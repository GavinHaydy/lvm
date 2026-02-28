import { List, Progress, Card, Badge, Space } from 'antd';

import { useDownload } from '@/hooks/useDownload.ts';

export const DownloadCenter = () => {
  const { tasks } = useDownload();

  return (
    <Card title="下载管理" style={{ margin: 24 }}>
      <List
        dataSource={tasks}
        renderItem={item => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space style={{ marginBottom: 8 }}>
                <strong>Python {item.version}</strong>
                {item.status === 'success' ? (
                  <Badge status="success" text="已完成" />
                ) : (
                  <Badge status="processing" text="下载中..." />
                )}
              </Space>
              <Progress
                percent={item.percentage}
                status={item.status === 'success' ? 'normal' : 'active'}
              />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};
