import { useEffect, useState } from "react";
import { useGetIdentity } from "react-admin";
import {firebaseDataProvider} from "../../configuration/providers/firebase/FireBaseDataProvider";
import {ResourceKey} from "../UsersResource";

export interface UserIdentity {
    id: string;
    displayName: string;
    token: Record<string, string>;
    permission: any;
    photoURL: string;
}

export function useUserIdentity() {
    const { data: dataId, isLoading: isLoadingIdentity, error: identityError } = useGetIdentity();
    const [data, setData] = useState<UserIdentity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!isLoadingIdentity && dataId?.id) {
            (async () => {
                try {
                    const userData = await firebaseDataProvider.getOne(ResourceKey, { id: dataId.id });
                    setData({ ...userData.data, id: dataId.id });
                    setIsLoading(false);
                } catch (error) {
                    setError(error);
                    setIsLoading(false);
                }
            })();
        } else if (!isLoadingIdentity) {
            setIsLoading(false);
        }
    }, [isLoadingIdentity, dataId]);

    return { data, isLoading, error: error || identityError };
}