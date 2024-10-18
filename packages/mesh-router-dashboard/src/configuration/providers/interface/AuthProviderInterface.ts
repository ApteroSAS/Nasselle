import {AuthProvider} from "ra-core";

export interface AuthProviderAdditionalInterface{
  registerUser(email: string, password: string): Promise<any>;

  updatePassword(newPassword: string): Promise<void>;

  updateEmail(email: string,currentPassword:string): Promise<void>;

  getEmail(): string | null;

}

// @ts-ignore
export interface AuthProviderInterface extends AuthProviderAdditionalInterface,AuthProvider{
  getPermissions(): Promise<string[]>;
  login(params: { username: string; password: string }): Promise<any>;
}