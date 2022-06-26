import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });
      dispatch({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  // update shares, if no shares add new document
  const updateDocument = async (stock, user, action, amount) => {
    try {
      const query = await ref
        .where("symbol", "==", stock.symbol)
        .where("uid", "==", user.uid)
        .get();

      if (!query.empty) {
        query.forEach((doc) => {
          if (action === "buy") {
            ref.doc(doc.id).update({
              amount: (doc.data().amount += amount),
            });
          }
          if (action === "sell") {
            ref.doc(doc.id).update({
              amount: (doc.data().amount -= amount),
            });
          }
        });
      } else {
        addDocument({ uid: user.uid, amount, ...stock });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //update the price of all stocks that you own
  const updateDocumentPrices = async (uid, stocks) => {
    try {
      const query = await ref.where("uid", "==", uid).get();
      console.log(query);
      console.log("docs running");

      if (query.empty) return;

      query.forEach((doc) => {
        stocks.map((item) => {
          if (doc.data().symbol === item.symbol) {
            ref.doc(doc.id).update({
              close: item.close,
            });
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateBalance = async (stock, user, action, amount) => {
    try {
      const price = Number(stock.close * amount);

      const query = await ref.where("uid", "==", user.uid).get();
      if (query.empty) return;

      query.forEach((doc) => {
        if (action === "buy") {
          ref.doc(doc.id).update({
            balance: (doc.data().balance -= price),
            stocksValue: (doc.data().stocksValue += price),
            totalValue: (doc.data().balance += doc.data().stocksValue),
          });
        }
        if (action === "sell") {
          ref.doc(doc.id).update({
            balance: (doc.data().balance += price),
            stocksValue: (doc.data().stocksValue -= price),
            totalValue: (doc.data().balance += doc.data().stocksValue),
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  //update total stocksvalue and totalvalue of users portfolio
  const updateStocksValue = async (myStocks, uid) => {
    if (!myStocks) return;

    const query = await ref.where("uid", "==", uid).get();

    const currentDate = new Date();
    const value = myStocks.reduce((acc, cur) => {
      return acc + cur.close * cur.amount;
    }, 0);

    console.log(value);

    if (!query.empty) {
      query.forEach((doc) => {
        ref.doc(doc.id).update({
          stocksValue: value,
          totalValue: (doc.data().balance += doc.data().stocksValue),
          portfolioHistory: [
            ...doc.data().portfolioHistory,
            {
              x: currentDate,
              y: (doc.data().balance += doc.data().stocksValue),
            },
          ],
        });
      });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return {
    updateStocksValue,
    updateDocumentPrices,
    updateBalance,
    updateDocument,
    addDocument,
    deleteDocument,
    response,
  };
};
