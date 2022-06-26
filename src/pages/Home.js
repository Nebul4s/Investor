import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import { useEffect } from "react";

import PreviewMarkets from "../components/PreviewMarkets";
import PreviewBriefcase from "../components/PreviewBriefcase";

const Home = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection(
    "stocks",
    user ? ["uid", "==", user.uid] : undefined
  );
  const { deleteDocument } = useFirestore("stocks");

  //if stock amount reaches 0 delete item and re-render
  useEffect(() => {
    if (documents)
      documents.forEach((item) => {
        if (item.amount === 0) {
          deleteDocument(item.id);
        }
      });
  }, [documents, deleteDocument]);

  return (
    <div className="container">
      <PreviewMarkets uid={user ? user.uid : ""} myStocks={documents} />
      <PreviewBriefcase myStocks={documents} error={error} />
    </div>
  );
};

export default Home;
