import { useCallback, useEffect, useState } from 'react';

import { safeInvoke } from '@/api/tauri';
import { ISearchPayload } from '@/core/types/common.ts';
import { VersionTable, VersionItem, VersionResult } from '@/shared/components/VersionTable';

export const PythonManagePage = () => {
  const [searchPayload, setPayload] = useState<ISearchPayload>({
    language: 'python',
    page: 0,
    pageSize: 10,
    keyWord: '',
  });
  const [data, setData] = useState<VersionResult>({
    total: 0,
    list: [],
  });

  const getList = useCallback(async () => {
    const result = await safeInvoke<VersionResult>('list_versions', searchPayload);
    setData(result);
  }, [searchPayload]);

  useEffect(() => {
    void getList();
  }, [getList]);

  const handleSearch = async (keyWord: string) => {
    setPayload(prevState => ({ ...prevState, keyWord: keyWord }));
  };

  const handleInstallToggle = async (record: VersionItem) => {
    if (!record.install_status) {
      await safeInvoke('install', {
        language: 'python',
        version: record.version,
      });
    } else {
      await safeInvoke('uninstall', {
        language: 'python',
        version: record.version,
      });
    }

    await getList();
  };

  const handleUseToggle = async (record: VersionItem) => {
    await safeInvoke('use_version', {
      language: 'python',
      version: record.version,
    });

    await getList();
  };

  return (
    <VersionTable
      data={data}
      onInstallToggle={handleInstallToggle}
      onSearch={handleSearch}
      onUseToggle={handleUseToggle}
    />
  );
};
