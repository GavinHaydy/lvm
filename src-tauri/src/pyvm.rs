// use std::sync::Mutex;
// use once_cell::sync::Lazy;
use std::process::{Command};
use std::{env, fs};
use std::path::Path;


// 可用版本
#[tauri::command]
pub async fn list_available() -> Result<Vec<String>, String> {
    // Python FTP 服务器的 URL，获取版本信息
    let url = "https://www.python.org/ftp/python/";

    // 获取 HTML 内容
    let response = reqwest::get(url)
        .await
        .map_err(|e| format!("Error fetching versions: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Error reading response text: {}", e))?;

    // 解析 HTML 获取版本号（简单提取文件夹名）
    let mut versions = Vec::new();
    for line in response.lines() {
        if line.contains("href=\"") {
            if let Some(version) = line.split("href=\"")
                .nth(1)
                .and_then(|s| s.split('/').next()) {
                if version != "" {
                    versions.push(version.to_string());
                }
            }
        }
    }

    // 返回版本列表
    Ok(versions)
}

// 安装
#[tauri::command]
pub async fn install(version: String) -> Result<String, String> {
    let url = format!(
        "https://www.python.org/ftp/python/{0}/python-{0}-amd64.exe",
        version
    );

    let installer_path = std::env::temp_dir()
        .join(format!("python-{}.exe", version));

    download_file(&url, &installer_path).await?;

    let status = Command::new(&installer_path)
        .args([
            "/quiet",
            "InstallAllUsers=0", // 👈 非管理员
            "PrependPath=0",
            "Include_pip=1",
            &format!("TargetDir={}", absolute_py_dir(&version)),
        ])
        .status()
        .map_err(|e| e.to_string())?;

    if !status.success() {
        return Err("Python installer failed".into());
    }

    Ok(format!("Python {} installed", version))
}


async fn download_file(url: &str, dest: &Path) -> Result<(), String> {
    let bytes = reqwest::get(url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;

    tokio::fs::write(dest, bytes)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn absolute_py_dir(version: &str) -> String {
    std::env::current_exe()
        .unwrap()
        .parent()
        .unwrap()
        .join("pyvm")
        .join("versions")
        .join(version)
        .to_string_lossy()
        .to_string()
}


// 切换版本
#[tauri::command]
pub fn use_version(version: String) -> Result<String, String> {
    // 检查版本是否已安装
    let version_path = format!("./pyvm/versions/{}", version);
    if !Path::new(&version_path).exists() {
        return Err(format!("Python version {} is not installed", version));
    }

    // // 设置当前版本
    // let current_symlink = "./pyvm/current";
    // if let Err(e) = fs::remove_dir_all(current_symlink){
    //     return Err(format!("Failed to remove current symlink: {}",e));
    // }
    //
    // fs::create_dir_all(current_symlink).map_err(|e| format!("Failed to create current symlink: {}",e))?;
    //
    // // 创建只想当前版本的符合链接
    // let target = format!("./pyvm/versions/{}", version);
    // std::os::unix::fs::symlink(target,current_symlink)
    // 更新PATH 环境变量，是当前Python版本优先
    let python_bin = format!("{}/Scripts", version_path);
    let path = env::var("PATH").unwrap_or_else(|_| String::new());

    //在 PATH 的前面添加当前版本的路径
    let new_path = format!("{};{}", python_bin, path);
    env::set_var("PATH", new_path);

    // 保存当前版本路径，用于后续恢复
    let current_version_path = "./pyvm/current_version";
    fs::write(current_version_path, &version).map_err(|e| format!("Failed to save current version: {}",e))?;

    Ok(format!("Python version {} is now active", version))
}

// 卸载
#[tauri::command]
pub fn uninstall_python(version: String) -> Result<String, String> {
    let version_path = format!("./pyvm/versions/{}", version);
    if !Path::new(&version_path).exists() {
        return Err(format!("Python version {} is not installed", version));
    }

    fs::remove_dir_all(version_path).map_err(|e| format!("Failed to remove version directory: {}",e));

    let current_symlink = "./pyvm/current";
    if Path::new(current_symlink).exists() {
        fs::remove_dir_all(current_symlink).map_err(|e| format!("Failed to remove current symlink: {}", e));
    }

    Ok(format!("Python version {} uninstalled successfully", version))
}

// 已安装
#[tauri::command]
pub fn list_installed() -> Result<Vec<String>, String> {
    // 安装目录
    let versions_dir = "./pyvm/versions";

    // 获取安装目录中的所有子目录，作为已安装的版本
    let entries = fs::read_dir(versions_dir)
        .map_err(|e| format!("Failed to read versions directory: {}", e))?;

    let mut installed_versions = Vec::new();

    // 遍历目录，提取子目录名称作为版本号
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        // 只考虑目录（版本）
        if path.is_dir() {
            if let Some(version) = path.file_name() {
                if let Some(version_str) = version.to_str() {
                    installed_versions.push(version_str.to_string());
                }
            }
        }
    }

    // 返回安装的版本列表
    Ok(installed_versions)
}