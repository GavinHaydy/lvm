// manager.rs
// Language manager responsible for orchestration

use crate::core::language::{LanguageInstaller, python::PythonInstaller};
use crate::core::dto::{VersionInfo, PageResult};

pub struct LanguageManager {
    installer: Box<dyn LanguageInstaller + Send + Sync>,
}

impl LanguageManager {
    pub fn new(language: String) -> Result<Self, String> {
        match language.as_str() {
            "python" => Ok(Self {
                installer: Box::new(PythonInstaller::new()),
            }),
            _ => Err("Unsupported language".into()),
        }
    }

    pub async fn list_versions(
        &self,
        page: usize,
        page_size: usize,
        key_word: Option<&str>
    ) -> Result<PageResult, String> {

        let all_versions = self.installer.list_versions().await?;
        let installed = self.installer.list_installed().await?;
        let current = self.installer.current().await?;

        // 1. filter
        let filtered_versions: Vec<String> = if let Some(key) = key_word {
            if key.is_empty() {
                all_versions // "", not filter
            } else {
                all_versions
                    .into_iter()
                    .filter(|v| v.contains(key))
                    .collect()
            }
        } else {
            all_versions
        };

        let total = filtered_versions.len();

        let start = page * page_size;
        let end = usize::min(start + page_size, total);

        let slice = if start < total {
            &filtered_versions[start..end]
        } else {
            &[]
        };

        let list = slice.iter().map(|v| {
            VersionInfo {
                version: v.clone(),
                install_status: installed.contains(v),
                use_status: current.as_ref() == Some(v),
            }
        }).collect();

        Ok(PageResult { total, list })
    }

    #[allow(dead_code)]
    pub async fn download(&self, version: &str) -> Result<String, String> {
        self.installer.download(version).await
    }
}