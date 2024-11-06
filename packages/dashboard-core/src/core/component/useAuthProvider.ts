import {useAuthProvider as rauseAuthProvider} from "react-admin";
import type {AuthProviderInterface} from "../../providers/interface/AuthProviderInterface";
import {useEffect, useState} from "react";

export const useAuthProvider = () => {
  const ap = rauseAuthProvider() as unknown as AuthProviderInterface;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await ap.authStateReady();
      setLoading(false);
    })();
  }, []);
  return {...ap,loading};
}