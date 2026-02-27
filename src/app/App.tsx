// import { useEffect, useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
//
// export default function App() {
//     const [installed, setInstalled] = useState<string[]>([]);
//     const [available, setAvailable] = useState<string[]>([]);
//     const [current, setCurrent] = useState<string | null>(null);
//
//     const refresh = async () => {
//         setInstalled(await invoke("list_installed"));
//         setAvailable(await invoke("list_available"));
//         setCurrent(await invoke("current_version"));
//     };
//
//     useEffect(() => {
//         refresh();
//     }, []);
//
//     return (
//         <div style={{ padding: 20 }}>
//             <h2>Current: {current ?? "none"}</h2>
//
//             <h3>Installed</h3>
//             <ul>
//                 {installed.map(v => (
//                     <li key={v}>
//                         {v}
//                         <button onClick={async () => {
//                             await invoke("use_version", { version: v });
//                             refresh();
//                         }}>
//                             Use
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//
//             <h3>Available</h3>
//             <ul>
//                 {available.map(v => (
//                     <li key={v}>
//                         {v}
//                         <button onClick={async () => {
//                             await invoke("install", { version: v });
//                             refresh();
//                         }}>
//                             Install
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
// import { useEffect, useState } from "react";
// import { invoke } from "@tauri-apps/api/core";

// export default function App() {
//     const [installedVersions, setInstalledVersions] = useState<string[]>([]);
//     const [availableVersions, setAvailableVersions] = useState<string[]>([]);
//     const [currentVersion, setCurrentVersion] = useState<string | null>(null);

//     useEffect(() => {
//         invoke("list_installed").then(setInstalledVersions);
//         invoke("list_available").then(setAvailableVersions);
//         invoke("current_version").then(setCurrentVersion);
//     }, []);

//     const handleInstall = (version: string) => {
//         invoke("install", { version })
//             .then(() => {
//                 alert(`${version} installed successfully`);
//             })
//             .catch(console.error);
//     };

//     const handleUse = (version: string) => {
//         invoke("use_version", { version })
//             .then(() => {
//                 alert(`Now using Python ${version}`);
//                 setCurrentVersion(version);
//             })
//             .catch(console.error);
//     };

//     const handleUninstall = (version: string) => {
//         invoke("uninstall_python", { version })
//             .then(() => {
//                 alert(`${version} uninstalled successfully`);
//             })
//             .catch(console.error);
//     };

//     return (
//         <div>
//             <h1>Python Version Manager</h1>

//             <h2>Installed Versions</h2>
//             <ul>
//                 {installedVersions.map((version) => (
//                     <li key={version}>
//                         {version}
//                         <button onClick={() => handleUse(version)}>Use</button>
//                         <button onClick={() => handleUninstall(version)}>Uninstall</button>
//                     </li>
//                 ))}
//             </ul>

//             <h2>Available Versions</h2>
//             <ul>
//                 {availableVersions.map((version) => (
//                     <li key={version}>
//                         {version}
//                         <button onClick={() => handleInstall(version)}>Install</button>
//                     </li>
//                 ))}
//             </ul>

//             <h3>Current Version: {currentVersion}</h3>
//         </div>
//     );
// }

import { RouterProvider } from 'react-router-dom';
// import { router } from "./routers/router"
import { router } from '@/app/routes';
import '../features/i18n/index';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
