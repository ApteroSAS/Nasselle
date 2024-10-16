import {AuthProvider} from "ra-core";

export interface AuthProviderInterface extends AuthProvider{
  registerUser(email: string, password: string): Promise<any>;

  updatePassword(newPassword: string): Promise<void>;

  updateEmail(email: string,currentPassword:string): Promise<void>;

  getEmail(): string | null;

  getIdentity(): Promise<any>;
}