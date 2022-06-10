import { useState, useEffect } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useAuthContext } from "../hooks/useAuthContext";

import LineGraph from "./LineGraph";

const ShowSingleMarket = ({ stock, uid }) => {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("");
  const [timeElement, setTimeElement] = useState("");
  const [time, setTime] = useState("");
  const [mockdata, setMockData] = useState(null);
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("stocks");

  useEffect(() => {
    if (!stock) {
      const tempData = [];
      let i = 0;
      const date = new Date();
      for (i; i <= 365; i++) {
        const day = i * 1000 * 60 * 60 * 24;
        const rand = Math.random() * (250 - 20) + 20;
        tempData.push({ x: new Date(date - day), y: rand });
      }

      setMockData(tempData);
    }
    if (stock) setMockData(null);
  }, [stock]);

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
    if (user && action === "buy") {
      addDocument({ uid, amount, ...stock });
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
      <div className="title">
        {mockdata && <h1>Mockdata Inc</h1>}
        {mockdata && <h1>$250</h1>}
        {stock && <h1>{stock.name}</h1>}
        {stock && <h1>${Number(stock.open).toFixed(2)}</h1>}
      </div>
      {!stock && <LineGraph mockdata={mockdata} />}
      {stock && <LineGraph stock={stock} time={time} />}
      {/* Includes graph and buy functionality */}
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
      <div className="info">
        <div className="lists">
          <ul>
            {mockdata && (
              <>
                <li>
                  <span>Name: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Symbol: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Exchange: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Market Open: </span>
                  <span>Mockdata</span>
                </li>
              </>
            )}
            {stock && (
              <>
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
              </>
            )}
          </ul>
          <ul>
            {mockdata && (
              <>
                <li>
                  <span>Name: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Symbol: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Exchange: </span>
                  <span>Mockdata</span>
                </li>
                <li>
                  <span>Market Open: </span>
                  <span>Mockdata</span>
                </li>
              </>
            )}
            {stock && (
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
            )}
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
    </div>
  );
};

export default ShowSingleMarket;
