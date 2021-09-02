import { randomBytes } from "crypto";
import * as admin from "firebase-admin";

const app = admin.initializeApp();
const firestore = app.firestore();

const generateNonce = (): string => {
  const buffer = randomBytes(16);
  return buffer.toString("hex");
};

interface UserProfileParams {
  publicAddress: string;
}

export const createProfile = async ({
  publicAddress,
}: UserProfileParams): Promise<string> => {
  const nonce = generateNonce();
  await firestore.collection("users").doc(publicAddress).set({
    publicAddress,
    nonce,
    createdAt: new Date(),
  });

  return nonce;
};

export const updateNonce = async ({
  publicAddress,
}: UserProfileParams): Promise<string> => {
  const newNonce = generateNonce();
  const userDoc = await firestore.collection("users").doc(publicAddress).get();
  if (!userDoc.exists) {
    throw new Error("document not found");
  }

  await userDoc.ref.update({
    nonce: newNonce,
  });

  return newNonce;
};

export const getNonce = async ({
  publicAddress,
}: UserProfileParams): Promise<string | null> => {
  const userDoc = await firestore.collection("users").doc(publicAddress).get();
  if (!userDoc.exists) {
    return null;
  }

  const { nonce } = userDoc.data() as any;
  return nonce;
};
