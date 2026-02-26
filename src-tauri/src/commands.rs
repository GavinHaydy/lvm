// commands.rs
// Tauri command layer (bridge between frontend and backend)

use crate::core::manager::LanguageManager;
use crate::core::dto::PageResult;

#[tauri::command]
pub async fn list_versions(
    language: String,
    page: usize,
    page_size: usize,
) -> Result<PageResult, String> {
    let manager = LanguageManager::new(language)?;
    manager.list_versions(page, page_size).await
}

#[allow(dead_code)]
#[tauri::command]
pub async fn download_version(
    language: String,
    version: String,
) -> Result<String, String> {
    let manager = LanguageManager::new(language)?;
    manager.download(&version).await
}