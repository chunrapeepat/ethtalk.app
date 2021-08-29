import { utils } from "ethers";
import * as admin from "firebase-admin";
import {
  createProfile,
  getNonce,
  updateNonce,
} from "../utils/scaffoldFunctions";

const recoverSignature = (nonce: string, signature: string) => {
  const msg = `Login to EthTalk!!! ${nonce}`;
  const address = utils.verifyMessage(msg, signature);
  return address;
};

export const authenticate = async (
  publicAddress: string,
  signature: string
) => {
  const nonce = await getNonce({ publicAddress });
  if (!nonce) throw new Error("user not found");

  // Update nonce so signature can't be replayed
  await updateNonce({ publicAddress });

  const recoveredAddress = recoverSignature(nonce, signature);

  if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
    return await admin.auth().createCustomToken(publicAddress);
  } else {
    throw new Error("bad signature");
  }
};

export const getAuthenticationChallenge = async (publicAddress: string) => {
  const hasNonce = await getNonce({ publicAddress });

  let nonce;
  if (!hasNonce) {
    nonce = await createProfile({ publicAddress });
  } else {
    nonce = await updateNonce({ publicAddress });
  }

  return nonce;
};
