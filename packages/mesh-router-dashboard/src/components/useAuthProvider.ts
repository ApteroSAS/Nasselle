import {useAuthProvider as rauseAuthProvider} from "react-admin";
import {AuthProviderInterface} from "../configuration/providers/interface/AuthProviderInterface";

export const useAuthProvider = () => rauseAuthProvider() as undefined as AuthProviderInterface;