import { functions } from "./firebase";
import { httpsCallable } from "@firebase/functions";

export const firebaseLogin = async signer => {
  const address = await signer.getAddress();
  const getNonce = httpsCallable(functions, "getNonce");
  const nonceResult = await getNonce({ publicAddress: address });
  const { nonce } = nonceResult.data;

  // sign nonce
  const msg = `SignIn with Ethereum, ETHTalk: ${nonce}`;
  const signature = await signer.signMessage(msg);

  const login = httpsCallable(functions, "login");
  const loginResult = await login({ publicAddress: address, signature });
  const { customToken } = loginResult.data;

  return customToken;
};

export const firebaseLoginWithUnstoppable = async (publicAddress,addOn) => {
    const login = httpsCallable(functions, "loginWithUnstoppable");
    
  const loginResult = await login({ publicAddress, addOn });
  const { customToken } = loginResult.data;

  return customToken;
};
export const firebaseLogout = async ({ setJwtAuthToken }) => setJwtAuthToken(null);
