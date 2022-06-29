import { useState, useEffect } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

//components
import LineGraph from "./LineGraph";

const ShowSingleMarket = ({ stock }) => {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("");
  const [timeElement, setTimeElement] = useState("");
  const [time, setTime] = useState("");

  const { user } = useAuthContext();
  const { updateDocument, response } = useFirestore("stocks");
  const { balance } = useCollection("users", ["uid", "==", user.uid]);

  const handleTimeSelection = (e) => {
    //styles
    if (timeElement && timeElement.classList.contains("active")) {
      timeElement.classList.remove("active");
    }
    e.target.classList.add("active");
    setTimeElement(e.target);
    //

    setTime(e.target.textContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("This action requires you to be logged in!");
      window.location = "/login";
    }
    if (user) {
      updateDocument(stock, user, action, amount);
    }
  };

  useEffect(() => {
    if (response.success) {
      setAction("");
      setAmount("");
    }
  }, [response]);

  return (
    <div className="ShowSingleMarket">
      {!stock && (
        <p className="startingMsg">Start by selecting a stock to inspect</p>
      )}
      {stock && (
        <>
          <div className="title">
            <h1>{stock.name}</h1>
            <h1>${Number(stock.close).toFixed(2)}</h1>
          </div>

          <LineGraph stock={stock} time={time} />

          <div className="controls">
            <div className="times">
              <span className="time-element" onClick={handleTimeSelection}>
                1WK
              </span>
              <span className="time-element" onClick={handleTimeSelection}>
                1M
              </span>
              <span className="time-element" onClick={handleTimeSelection}>
                1Y
              </span>
              <span className="time-element" onClick={handleTimeSelection}>
                2Y
              </span>
            </div>
            <div className="buying-power">
              <h2>Buying Power:</h2>
              <span>
                $
                {balance &&
                  balance[0].balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </span>
            </div>
          </div>
          <div className="info">
            <div className="lists">
              <ul>
                <li>
                  <span>Name: </span>
                  <span>{stock.name}</span>
                </li>

                <li>
                  <span>Symbol: </span>
                  <span>{stock.symbol}</span>
                </li>
                <li>
                  <span>Exchange: </span>
                  <span>{stock.exchange}</span>
                </li>
                <li>
                  <span>Market Open:</span>
                  <span>{stock.is_market_open ? "Yes" : "No"}</span>
                </li>
              </ul>
              <ul>
                <>
                  <li>
                    <span>Date: </span>
                    <span>{stock.datetime}</span>
                  </li>
                  <li>
                    <span>Volume: </span>
                    <span>{stock.volume}</span>
                  </li>
                  <li>
                    <span>Change: </span>
                    <span>${Number(stock.change).toFixed(2)}</span>
                  </li>
                  <li>
                    <span>Percent change: </span>
                    <span
                      style={{
                        color:
                          Number(stock.percent_change) === 0
                            ? "white"
                            : Number(stock.percent_change) > 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {Number(stock.percent_change).toFixed(2)}%
                    </span>
                  </li>
                </>
              </ul>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <span>Amount:</span>
                  <input
                    type="number"
                    onChange={(e) => setAmount(+e.target.value)}
                    value={amount}
                  />
                </label>
                <div className="buttons">
                  <button
                    value="sell"
                    onClick={(e) => setAction(e.target.value)}
                    className="sell"
                  >
                    Sell
                  </button>
                  <button
                    value="buy"
                    onClick={(e) => setAction(e.target.value)}
                    className="buy"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowSingleMarket;
