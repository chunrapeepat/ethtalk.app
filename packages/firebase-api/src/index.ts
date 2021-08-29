import web3 from "web3";
import * as functions from "firebase-functions";
import { authenticate, getAuthenticationChallenge } from "./controllers/auth";

/**
 * Returns a nonce given a public address
 * @method getNonce
 * @param {String} data.publicAddress
 * @throws Returns 401 if the user is not found
 * @returns {Object} nonce for the user to sign
 */
export const getNonce = functions.https.onCall(async (data) => {
  const { publicAddress } = data;

  if (!web3.utils.isAddress(publicAddress)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "invalid public address format"
    );
  }

  try {
    const nonce = await getAuthenticationChallenge(publicAddress);
    return { nonce };
  } catch (e) {
    throw new functions.https.HttpsError("not-found", e.message);
  }
});

/**
 * Returns a JWT, given a publicAddress and signature
 * @method login
 * @param {String} data.publicAddress
 * @param {String} data.signature
 * @throws Returns 401 if the user is not found or signature is invalid.
 * @returns {Object} Firebase auth custom token
 */
export const login = functions.https.onCall(async (data) => {
  const { publicAddress, signature } = data;

  if (!web3.utils.isAddress(publicAddress)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "invalid public address format"
    );
  }

  try {
    const customToken = await authenticate(publicAddress, signature);
    return { customToken };
  } catch (e) {
    throw new functions.https.HttpsError("not-found", e.message);
  }
});
