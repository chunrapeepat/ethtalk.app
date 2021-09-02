import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";

export default function useFirebaseAuth() {
  const [publicAddress, setPublicAddress] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser) {
        setPublicAddress(authUser.uid);
      } else {
        setPublicAddress(null);
      }
    });
  }, []);

  return {
    publicAddress,
  };
}
