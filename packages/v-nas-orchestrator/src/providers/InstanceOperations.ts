export interface InstanceOperations {
  setup(uid: string ): Promise<string>;
  delete(uid: string): Promise<string>;
  reboot(uid: string): Promise<string>;
  status(uid: string): Promise<string>;
}
