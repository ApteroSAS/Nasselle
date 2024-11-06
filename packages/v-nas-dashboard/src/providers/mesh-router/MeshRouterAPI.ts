// apiClient.js
import axios from "axios";
import {getAuth} from "firebase/auth";

const apiBase = (window as any).APP_CONFIG.MESH_ROUTER_BACKEND;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: apiBase,
});

console.log("apiBase:"+ apiBase);

// Request interceptor to add ID token to headers
apiClient.interceptors.request.use(
  async (config) => {
// Initialize Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Get the ID token (force refresh if needed)
      const idToken = await user.getIdToken(/* forceRefresh */ true);

      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// apiClient.js - check domain availability
export async function checkDomainAvailability(domain: string):Promise<boolean> {
  if(!domain) {
    throw new Error("Domain name is required for availability check.");
  }
  try {
    const response = await apiClient.get(`/available/${domain}`);
    return !!response.data.available;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}

// apiClient.js - get user domain
export async function getUserDomain(userid: string):Promise<{
  domainName: string,
  serverDomain: string,
  publicKey: string
}> {
  try {
    const response = await apiClient.get(`/domain/${userid}`);
    return response.data; // Returns the domain info (e.g., domainName, serverDomain, publicKey)
  } catch (error) {
    console.error('Error getting user domain:', error);
    throw error;
  }
}

export async function deleteUserDomain(userid: string):Promise<{
  domainName: string,
  serverDomain: string,
  publicKey: string
}> {
  try {
    const response = await apiClient.delete(`/domain/${userid}`);
    return response.data; // Returns the domain info (e.g., domainName, serverDomain, publicKey)
  } catch (error) {
    console.error('Error getting user domain:', error);
    throw error;
  }
}

// apiClient.js - update user domain
export async function updateUserDomain(userid: string, data:{domainName?: string, publicKey?: string,serverDomain?:string}) {
  try {
    const response = await apiClient.post(`/domain/${userid}`, data);
    return response.data; // Returns success message or error
  } catch (error) {
    console.error('Error updating user domain:', error);
    throw error;
  }
}


