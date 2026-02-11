// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod pyvm;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            pyvm::list_installed,
            pyvm::list_available,
            pyvm::install,
            pyvm::use_version,
            // pyvm::current_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    appdemo_lib::run()
}
