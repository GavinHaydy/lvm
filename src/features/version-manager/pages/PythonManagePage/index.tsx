import { useEffect, useState } from 'react';
import { VersionTable, VersionItem, VersionResult } from '@/shared/components/VersionTable';
import { safeInvoke } from '@/api/tauri';
import {ISearchPayload} from "@/core/types/common.ts";

export const PythonManagePage = () => {
  const [searchPayload, setPayload] = useState<ISearchPayload>({
    language: "python",
    page: 0,
    pageSize: 10,
    keyWord: ''
  })
  const [data, setData] = useState<VersionResult>({
    total: 0,
    list: [],
  });

  useEffect(() => {
    getList().then();
  }, []);

  useEffect(() => {
    getList().then();
  }, [searchPayload]);

  const getList = async () =>{
    const result = await safeInvoke<VersionResult>('list_versions', searchPayload)
    setData(result)
  }

  const handleSearch = async (keyWord: string)=> {
    setPayload(prevState => ({...prevState, keyWord: keyWord}))
  }

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

    getList().then()
  };

  const handleUseToggle = async (record: VersionItem) => {
    await safeInvoke('use_version', {
      language: 'python',
      version: record.version,
    });

    getList().then()
  };

  return (
    <VersionTable data={data} onInstallToggle={handleInstallToggle} onSearch={handleSearch} onUseToggle={handleUseToggle} />
  );
};
