import {useEffect, useState} from "react";
import {useGetIdentity} from "react-admin";
import {getFirebaseDataProvider} from "../../../providers/firebase/FireBaseDataProvider";
import {USERS_RESOURCE} from "../../UsersResource";

export interface UserIdentity {
    id: string;
    displayName: string;
    token: Record<string, string>;
    permission: any;
    photoURL: string;
}

let dataCache: UserIdentity | null = null;

export function useUserIdentity() {
    const { data: dataId, isLoading: isLoadingIdentity, error: identityError } = useGetIdentity();
    const [data, setData] = useState<UserIdentity | null>(dataCache);
    const [isLoading, setIsLoading] = useState(!dataCache);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!isLoadingIdentity && dataId?.id) {
            (async () => {
                try {
                    const userData = await (await getFirebaseDataProvider()).getOne(USERS_RESOURCE, { id: dataId.id });
                    setData({ ...userData.data, id: dataId.id });
                    dataCache = { ...userData.data, id: dataId.id };
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }
            })();
        } else if (!isLoadingIdentity) {
            setIsLoading(false);
        }
    }, [isLoadingIdentity, dataId]);

    return { data, isLoading, error: error || identityError };
}
