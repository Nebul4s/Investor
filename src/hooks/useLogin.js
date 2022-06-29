import { useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password);
      dispatch({ type: "LOGIN", payload: res.user });

      //update state
      setIsPending(false);
      setError(null);
    } catch (err) {
      setError("Wrong email or password!");
      setIsPending(false);
    }
  };

  return { login, isPending, error };
};
