import {
    allowAllModules,
    FREIGHTER_ID,
    StellarWalletsKit,
    WalletNetwork,
  } from "@creit.tech/stellar-wallets-kit";
  
  const kit: StellarWalletsKit = new StellarWalletsKit({
    modules: allowAllModules(),
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,
  });
  
  const connectionState: { publicKey: string | undefined } = {
    publicKey: undefined,
  };
  
  function loadedPublicKey(): string | undefined {
    return connectionState.publicKey;
  }

  const getAddress = async () => {
      const { address } = await kit.getAddress();
      return address;
  }
  
  function setPublicKey(data: string): void {
    connectionState.publicKey = data;
  }
  
  export { kit, loadedPublicKey, setPublicKey,getAddress };