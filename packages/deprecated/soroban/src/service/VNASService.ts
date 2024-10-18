
import axios from "axios";

//const VNAS_BACKEND_URL = "https://nasselle.com/dashboard/api"
const VNAS_BACKEND_URL = "http://localhost:8192"
const VNAS_AUTH_TOKEN = "atLeastSomeMinimumSecurity123"

export async function createUser(
    domainName: string,
    serverDomain: string,
) {
    const axiosResponse = await axios.post(VNAS_BACKEND_URL+"/vnas/tmp/create", {
        email: `${domainName}@${serverDomain}`,
        domainName,
        serverDomain,
        token: VNAS_AUTH_TOKEN
    });
    const data:{ status: string, token: string,uid:string } = axiosResponse.data
    // Store the data in local storage
    localStorage.setItem('userData', JSON.stringify(data));
    return data;
}

export async function vnasAction(action:'delete'|'reboot'|'create'|'update') : Promise<any> {
        const item = JSON.parse(localStorage.getItem('userData') || '{}');
        const token = item.token;
        console.log('Token:', token);
        if (!token) {
            throw new Error('User has no token');
        }
        const response = await axios.post(`${VNAS_BACKEND_URL}/vnas/${action}`, {}, {
            headers: {
                Authorization: `${token}`
            }
        });
        return response.data;
}