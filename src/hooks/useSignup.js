import { useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      //create user document

      projectFirestore.collection("users").doc(res.user.uid).set({
        balance: 20000,
        totalValue: 0,
        stocksValue: 0,
        uid: res.user.uid,
        portfolioHistory: [],
      });
      await res.user.updateProfile({ displayName });
      dispatch({ type: "LOGIN", payload: res.user });

      //update state
      setIsPending(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};
