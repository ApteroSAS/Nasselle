// domainApiClient.ts
import axios from 'axios';
import { config } from '../EnvConfig.js';

interface DomainData {
  // Add your domain data interface here
  [key: string]: any;
}

class DomainApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = config.MESH_ROUTER_BACKEND_URL;
    this.apiKey = config.MESH_ROUTER_BACKEND_API_KEY;
    if(!this.baseUrl || !this.apiKey) {
      throw new Error('Missing required configuration for domain API client');
    }
  }

  /**
   * Check if a domain name is available
   */
  async checkDomainAvailability(domain: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/available/${domain}`);
    return response.data;
  }

  /**
   * Get domain information for a specific user
   */
  async getDomainInfo(userId: string): Promise<{
    domainName: string,
    serverDomain: string,
    publicKey: string
  }> {
    const response = await axios.get(`${this.baseUrl}/domain/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey};${userId}`
      }
    });
    return response.data;
  }

  /**
   * Update or set domain information for a user
   */
  async setDomainInfo(userId: string, data: DomainData): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/domain`,
      {
        ...data,
        source: `${userId}@nasselle.com`
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey};${userId}`
        }
      }
    );
    return response.data;
  }

  /**
   * Delete domain information for a user
   */
  async deleteDomainInfo(userId: string): Promise<any> {
    const response = await axios.delete(`${this.baseUrl}/domain`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey};${userId}`
      }
    });
    return response.data;
  }
}

export const domainApiClient = new DomainApiClient();