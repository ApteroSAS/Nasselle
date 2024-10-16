export function getBackendURL() {
  //no slash at the end
  return process.env.BACKEND_URL || (window.location.origin + "/dashboard/api");
}