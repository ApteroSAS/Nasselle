import {AuthProvider} from "react-admin";

export type AuthProviderInterface = AuthProvider & {
  registerUser(email: string, password: string): Promise<any>;
};