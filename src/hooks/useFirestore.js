import { useReducer, useState } from "react";
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
    case "UPDATED_DOCUMENT":
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
  const [exists, setExists] = useState(true);

  // collection ref
  const ref = projectFirestore.collection(collection);

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
        dispatch({ type: "IS_PENDING" });

        query.forEach((doc) => {
          if (action === "buy") {
            ref.doc(doc.id).update({
              amount: (doc.data().amount += Number(amount)),
            });

            dispatch({ type: "UPDATED_DOCUMENT", payload: doc.data() });

            updateBalance(stock, user, action, amount);
            setExists(true);
          }

          if (action === "sell") {
            //check if amount inputted exceeds amount owned
            if (doc.data().amount < Number(amount)) {
              amount = doc.data().amount;
            }

            ref.doc(doc.id).update({
              amount: (doc.data().amount -= Number(amount)),
            });

            dispatch({ type: "UPDATED_DOCUMENT", payload: doc.data() });

            if (doc.data().amount - Number(amount) === 0) setExists(false);
            if (exists) updateBalance(stock, user, action, amount);
          }
        });
      }

      if (query.empty && action === "buy") {
        addDocument({ uid: user.uid, amount, ...stock });
        updateBalance(stock, user, action, amount);
        setExists(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateBalance = async (stock, user, action, amount) => {
    try {
      const usersRef = projectFirestore.collection("users");
      const price = Number(stock.close * amount);

      const query = await usersRef.where("uid", "==", user.uid).get();

      if (query.empty) return;

      query.forEach((doc) => {
        if (action === "buy") {
          usersRef.doc(doc.id).update({
            balance: (doc.data().balance -= price),
            stocksValue: (doc.data().stocksValue += price),
            totalValue: (doc.data().balance += doc.data().stocksValue),
          });
        }
        if (action === "sell") {
          usersRef.doc(doc.id).update({
            balance: (doc.data().balance += price),
            stocksValue: (doc.data().stocksValue -= price),
            totalValue: (doc.data().balance += doc.data().stocksValue),
          });
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  //update the price of all stocks that you own
  const updateDocumentPrices = async (uid, stocks) => {
    try {
      const query = await ref.where("uid", "==", uid).get();

      if (query.empty) return;

      query.forEach((doc) => {
        stocks.map((item) => {
          if (doc.data().symbol === item.symbol) {
            ref.doc(doc.id).update({
              close: item.close,
              volume: item.volume,
              percent_change: item.percent_change,
              change: item.change,
            });
          }
        });
      });
    } catch (err) {
      console.error(err.message);
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

    if (!query.empty) {
      query.forEach((doc) => {
        const latestValue = doc.data().portfolioHistory.pop();

        ref.doc(doc.id).update({
          stocksValue: value,
          totalValue: (doc.data().balance += doc.data().stocksValue),
        });

        //if last value of portfoliohistory array is not the same as currentvalue push new item to portfoliohistory array
        if (
          latestValue.y !== (doc.data().balance += doc.data().stocksValue) ||
          doc.data().portfolioHistory.length === 0
        ) {
          ref.doc(doc.id).update({
            portfolioHistory: [
              ...doc.data().portfolioHistory,
              {
                x: currentDate,
                y: (doc.data().balance += doc.data().stocksValue),
              },
            ],
          });
        }
      });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatch({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatch({ type: "ERROR", payload: "could not delete" });
    }
  };

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
