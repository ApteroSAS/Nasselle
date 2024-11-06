import type {DataProvider} from 'react-admin';
//https://dev.to/appsmith/building-an-admin-dashboard-with-react-admin-86i


const resourceResolver: Record<string,any> = {};

export function addResource(resource: string, provider: any) {
    resourceResolver[resource] = provider;
}

// Only used to initialize proxy
const defaultDataProvider: DataProvider = {
    create: () => Promise.reject({ data: null }), // avoids adding a context in tests
    delete: () => Promise.reject({ data: null }), // avoids adding a context in tests
    deleteMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getList: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getManyReference: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getOne: () => Promise.reject({ data: null }), // avoids adding a context in tests
    update: () => Promise.reject({ data: null }), // avoids adding a context in tests
    updateMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
};

let notifyRessource: (res: string) => void = () => {};
export function onNewResource(callBack: (res: string) => void) {
    notifyRessource = callBack;
}

export const multiDataProvider = new Proxy<DataProvider>(defaultDataProvider, {
    get: (target, action) => {
        if (typeof action === 'symbol' || action === 'then') {
            return;
        }
        if(!target){
            throw new Error('invalid data provider');
        }
        return async (resource: string, params: any) => {
            try {
                console.log(`${action} ${resource} : ${JSON.stringify(params)}`);
                notifyRessource(resource);
                if (resourceResolver[resource]) {
                    return resourceResolver[resource][action];
                } else {
                    //look at the configuration to add a provider for your resource
                    throw new Error('invalid data provider :' + resource);
                }
            }catch (e) {
                console.error(e);
                return null;
            }
        };
    },
});
