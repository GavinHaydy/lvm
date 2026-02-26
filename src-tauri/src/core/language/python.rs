// python.rs
// Python installer implementation

use regex::Regex;
use async_trait::async_trait;
use reqwest;
use std::env;
use std::path::PathBuf;

use crate::core::utils::semver::sort_versions_desc;
use crate::core::language::LanguageInstaller;

pub struct PythonInstaller;

impl PythonInstaller {
    pub fn new() -> Self {
        Self
    }
    
    // Get current platform identifier
    #[allow(dead_code)]
    fn get_platform(&self) -> String {
        #[cfg(target_os = "windows")]
        {
            "windows".to_string()
        }
        #[cfg(target_os = "macos")]
        {
            "macos".to_string()
        }
        #[cfg(target_os = "linux")]
        {
            "linux".to_string()
        }
        #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
        {
            "unknown".to_string()
        }
    }
    
    // Get architecture identifier
    #[allow(dead_code)]
    fn get_arch(&self) -> String {
        #[cfg(target_arch = "x86_64")]
        {
            "x86_64".to_string()
        }
        #[cfg(target_arch = "aarch64")]
        {
            "arm64".to_string()
        }
        #[cfg(not(any(target_arch = "x86_64", target_arch = "aarch64")))]
        {
            "unknown".to_string()
        }
    }
    
    // Get base directory for installations
    fn get_base_dir(&self) -> PathBuf {
        // Check if custom directory is set in environment variable
        if let Ok(custom_dir) = env::var("LVM_BASE_DIR") {
            return PathBuf::from(custom_dir);
        }
        
        // Default path based on platform
        #[cfg(target_os = "windows")]
        {
            PathBuf::from("D:\\lvm")
        }
        #[cfg(any(target_os = "macos", target_os = "linux"))]
        {
            env::home_dir().unwrap_or_else(|| env::current_dir().unwrap()).join(".lvm")
        }
        #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
        {
            env::current_dir().unwrap().join("lvm")
        }
    }
}

#[async_trait]
impl LanguageInstaller for PythonInstaller {

    async fn list_versions(&self) -> Result<Vec<String>, String> {
        // Fetch version numbers from official Python FTP server
        let url = "https://www.python.org/ftp/python/";

        let html = reqwest::get(url)
            .await
            .map_err(|e| e.to_string())?
            .text()
            .await
            .map_err(|e| e.to_string())?;

        // Regex to match Python version directories (e.g., 3.10.0)
        let re = Regex::new(r#"href="(\d+\.\d+\.\d+)/""#)
            .map_err(|e| e.to_string())?;

        let mut versions = Vec::new();

        for cap in re.captures_iter(&html) {
            let version = cap[1].to_string();
            // Filter to only include Python 3 versions
            if version.starts_with("3.") {
                versions.push(version);
            }
        }

        // Sort versions in descending order
        sort_versions_desc(&mut versions);

        Ok(versions)
    }

    async fn list_installed(&self) -> Result<Vec<String>, String> {
        let mut result = Vec::new();
        let dir = self.get_base_dir()
            .join("python");

        if dir.exists() {
            for entry in std::fs::read_dir(dir).map_err(|e| e.to_string())? {
                let entry = entry.map_err(|e| e.to_string())?;
                if entry.path().is_dir() {
                    if let Some(name) = entry.file_name().to_str() {
                        result.push(name.to_string());
                    }
                }
            }
        }

        Ok(result)
    }

    async fn current(&self) -> Result<Option<String>, String> {
        let path = self.get_base_dir()
            .join("python")
            .join("current_version");

        if path.exists() {
            let v = std::fs::read_to_string(path)
                .map_err(|e| e.to_string())?;
            return Ok(Some(v));
        }

        Ok(None)
    }

    async fn download(&self, version: &str) -> Result<String, String> {
        // Get platform and architecture information
        let platform = self.get_platform();
        let arch = self.get_arch();

        // Construct download URL for Python embed version
        let download_url = match platform.as_str() {
            "windows" => {
                let arch_suffix = if arch == "x86_64" { "amd64" } else { "win32" };
                format!("https://www.python.org/ftp/python/{}/python-{}-embed-{}.zip", 
                        version, version, arch_suffix)
            },
            "macos" => {
                // macOS doesn't have official embed versions, use regular installer
                format!("https://www.python.org/ftp/python/{}/python-{}-macosx11.0.pkg", 
                        version, version)
            },
            "linux" => {
                // Linux doesn't have official embed versions, use regular tarball
                format!("https://www.python.org/ftp/python/{}/Python-{}.tgz", 
                        version, version)
            },
            _ => return Err("Unsupported platform".to_string()),
        };

        // Create downloads directory if it doesn't exist
        let downloads_dir = self.get_base_dir()
            .join("downloads");
        std::fs::create_dir_all(&downloads_dir)
            .map_err(|e| e.to_string())?;

        // Determine filename from URL
        let filename = download_url.split('/').last().unwrap_or("python.zip");
        let output_path = downloads_dir.join(filename);

        // Download the file
        let response = reqwest::get(&download_url)
            .await
            .map_err(|e| format!("Failed to download: {}", e))?;

        let mut file = std::fs::File::create(&output_path)
            .map_err(|e| format!("Failed to create file: {}", e))?;

        let content = response.bytes()
            .await
            .map_err(|e| format!("Failed to read response: {}", e))?;

        std::io::Write::write_all(&mut file, &content)
            .map_err(|e| format!("Failed to write file: {}", e))?;

        Ok(output_path.to_str().unwrap().to_string())
    }
}