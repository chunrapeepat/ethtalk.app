import { utils } from "ethers";
import * as admin from "firebase-admin";
import {
  createProfile,
  getNonce,
  updateNonce,
} from "../utils/scaffoldFunctions";

const recoverSignature = (nonce: string, signature: string) => {
  const msg = `SignIn with Ethereum, ETHTalk: ${nonce}`;
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

export const authUnstoppable = async (
  publicAddress: string,
  addOn: object
) => {
    return await admin.auth().createCustomToken(publicAddress, addOn);
};

export const getAuthenticationChallenge = async (publicAddress: string) => {
  const oldNonce = await getNonce({ publicAddress });

  let nonce;
  if (!oldNonce) {
    nonce = await createProfile({ publicAddress });
  } else {
    nonce = await updateNonce({ publicAddress });
  }

  return nonce;
};
