import axios from 'axios';
import {config} from "../EnvConfig.js";

// Define your Backblaze B2 credentials
const B2_APPLICATION_KEY_ID = "config.B2_APPLICATION_KEY_ID";
const B2_APPLICATION_KEY = "config.B2_APPLICATION_KEY"

// Type for the authorization response
interface AuthResponse {
  apiUrl: string;
  accountId: string;
  authorizationToken: string;
}

interface ApiInfo {
  storageApi: {
    absoluteMinimumPartSize: number;
    apiUrl: string;
    bucketId: string | null;
    bucketName: string | null;
    capabilities: string[];
    downloadUrl: string;
    infoType: string;
    namePrefix: string | null;
    recommendedPartSize: number;
    s3ApiUrl: string;
  };
}

interface BackblazeAuthResponse {
  accountId: string;
  apiInfo: ApiInfo;
  applicationKeyExpirationTimestamp: number | null;
  authorizationToken: string;
}

interface CreateKeyResponse {
  keyId: string;
  keyName: string;
  capabilities: string[];
  applicationKey: string;
  expirationTimestamp?: number | null;
  bucketId: string;
  namePrefix?: string | null;
  accountId: string;
  options: string[];
}

interface CreateBucketResponse {
  accountId: string;
  bucketId: string;
  bucketName: string;
  bucketType: string;
  bucketInfo: Record<string, string>;
  corsRules: any[];
  lifecycleRules: any[];
  revision: number;
  options: string[];
  defaultRetention: {
    mode: string;
    period: {
      duration: number;
      unit: string;
    };
  };
  isFileLockEnabled: boolean;
}

// Function to authorize the B2 account and return the API URL and token
async function getAuthorizationToken(): Promise<AuthResponse> {
  const url = 'https://api.backblazeb2.com/b2api/v3/b2_authorize_account';
  const encodedCredentials = Buffer.from(`${B2_APPLICATION_KEY_ID}:${B2_APPLICATION_KEY}`).toString('base64');
  const headers = {
    Authorization: `Basic ${encodedCredentials}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const data: BackblazeAuthResponse = response.data;
    return {
      accountId: data.accountId,
      apiUrl: data.apiInfo.storageApi.apiUrl,
      authorizationToken: response.data.authorizationToken,
    };
  } catch (error) {
    console.error(error);
    console.error('Error authorizing account:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a bucket
export async function createBucket(bucketName: string): Promise<CreateBucketResponse> {
  // Get authorization token and API URL
  const { apiUrl, authorizationToken,accountId } = await getAuthorizationToken();

  const url = `${apiUrl}/b2api/v3/b2_create_bucket`;
  const headers = {
    Authorization: authorizationToken,
  };
  const data = {
    accountId,
    bucketName,
    bucketType: 'allPrivate',
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.log(authorizationToken);
    console.log(url);
    console.log(data);
    console.error('Error creating bucket:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a key for the bucket
export async function createKey(bucketId: string): Promise<CreateKeyResponse>  {
  // Get authorization token and API URL
  const { apiUrl, authorizationToken,accountId } = await getAuthorizationToken();

  const url = `${apiUrl}/b2api/v3/b2_create_key`;
  const headers = {
    Authorization: authorizationToken,
  };
  const data = {
    accountId,
    capabilities: ['listBuckets', 'writeFiles', 'readFiles'],
    bucketId,
    keyName: `nsl-key-${bucketId}`,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.log(authorizationToken);
    console.log(url);
    console.log(data);
    console.error('Error creating key:', error.response?.data || error.message);
    throw error;
  }
}


