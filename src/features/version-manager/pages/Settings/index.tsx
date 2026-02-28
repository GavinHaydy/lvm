import { LazyStore } from '@tauri-apps/plugin-store';
import { Button, Card, Input, message } from 'antd';
import { useEffect, useState } from 'react';
const store = new LazyStore('.settings.json');

export const Settings = () => {
  const [basePath, setBasePath] = useState('');

  // 初始化读取
  useEffect(() => {
    void store.get<{ value: string }>('base_path').then(val => {
      setBasePath(val?.value || 'd:\\lvm');
    });
  }, []);

  const handleSave = async () => {
    await store.set('base_path', basePath);
    await store.save(); // 持久化到硬盘
    message.success('配置已保存，下次安装将生效');
  };

  return (
    <Card title="全局路径设置">
      <Input
        value={basePath}
        onChange={e => setBasePath(e.target.value)}
        placeholder="默认 d:\lvm"
      />
      <Button onClick={handleSave}>保存配置</Button>
    </Card>
  );
};
