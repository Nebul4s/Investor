import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

import PreviewMarkets from "../components/PreviewMarkets";
import PreviewBriefcase from "../components/PreviewBriefcase";

const Home = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection(
    "stocks",
    user ? ["uid", "==", user.uid] : undefined
  );

  return (
    <div className="container">
      <PreviewMarkets uid={user ? user.uid : ""} />
      <PreviewBriefcase myStocks={documents} error={error} />
    </div>
  );
};

export default Home;
