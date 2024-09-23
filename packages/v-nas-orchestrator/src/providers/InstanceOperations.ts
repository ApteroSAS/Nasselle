export interface InstanceOperations {
  setup(data: { signature: string; name: string; domain: string; uid: string }): Promise<string>;
  delete(uid: string): Promise<string>;
  update(data: { signature: string; name: string; domain: string; uid: string }): Promise<string>;
  reboot(uid: string): Promise<string>;
}
