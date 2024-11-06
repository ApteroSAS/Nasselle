import type {AuthProvider} from "ra-core";

export interface AuthProviderAdditionalInterface{
  registerUser(email: string, password: string): Promise<any>;

  updatePassword(newPassword: string): Promise<void>;

  sendResetPasswordMail(email: string): Promise<void>;

  updateEmail(email: string,currentPassword:string): Promise<void>;

  getEmail(): string | null;

  authStateReady(): Promise<void>;

  deleteAccount(currentPassword: string): Promise<void>;
}


export interface AuthProviderInterface extends AuthProviderAdditionalInterface,AuthProvider{
  getPermissions(): Promise<string[]>;
  login(params: { username: string; password: string }): Promise<any>;
  getIdentity(): Promise<any>;
}