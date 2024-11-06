export async function loadBackendConfiguration() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/core/config/core`);
  const conf = await response.json();
  (window as any).APP_CONFIG = {};
  for (const key in conf) {
    (window as any).APP_CONFIG[key] = conf[key];
  }
}