import { useFetch } from "../hooks/useFetch";
import { useFirestore } from "../hooks/useFirestore";
import { useState, useEffect } from "react";

//components
import ShowSingleMarket from "./ShowSingleMarket";
import Placeholder from "./StartingMsg";

//Images and svgs
import stockSVG from "../assets/stock.svg";
import trendingUp from "../assets/trending_up.svg";
import trendingDown from "../assets/trending_down.svg";

const PreviewMarkets = ({ uid, myStocks }) => {
  const [singleMarket, setSingleMarket] = useState(null);
  const [marketElement, setMarketElement] = useState("");
  const [url, setUrl] = useState("");

  const { data, error } = useFetch(url);
  const formatData = [];

  Object.values(data).forEach((stock) => {
    formatData.push(stock);
  });

  const { updateDocumentPrices } = useFirestore("stocks");
  const { updateStocksValue } = useFirestore("users");

  uid && updateDocumentPrices(uid, formatData, myStocks);
  myStocks && updateStocksValue(myStocks, uid);

  useEffect(() => {
    const symbolList = [
      "AAPL",
      "PANW",
      "SHOP",
      "PYPL",
      "NFLX",
      "DIS",
      "ABNB",
    ].join(",");
    setUrl(`/quote?symbol=${symbolList}`);
  }, []);

  const handleMarket = (e, stock) => {
    //Styles
    if (marketElement && marketElement.classList.contains("active")) {
      marketElement.classList.remove("active");
    }
    const element = e.target.closest(".market-el");
    element.classList.add("active");
    setMarketElement(element);
    //

    setSingleMarket(stock);
  };

  return (
    <div className="PreviewMarkets">
      <ul className="markets">
        {error && <li>{error.message}</li>}
        {data &&
          formatData.map((stock) => (
            <li
              className="market-el"
              key={stock.symbol}
              onClick={(e) => handleMarket(e, stock)}
            >
              <div className="text">
                <h2>{stock.name}</h2>
                <span>{stock.symbol}</span>
              </div>
              {/* <LineGraph
                style={{ width: "10px", height: "10px" }}
                stock={stock}
              /> */}
              <img className="stockSVG" src={stockSVG} alt="Stock img" />
              <div className="price">
                <span className="stock-price">
                  ${Number(stock.close).toFixed(2)}
                </span>
                <span
                  className="percent"
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
                <img
                  className="trendingIMG"
                  src={
                    Number(stock.percent_change) > 0 ? trendingUp : trendingDown
                  }
                  style={
                    Number(stock.percent_change) > 0
                      ? { background: "green" }
                      : { background: "red" }
                  }
                  alt="Trending up/down"
                />
              </div>
            </li>
          ))}
      </ul>
      {uid && <ShowSingleMarket stock={singleMarket} uid={uid} />}
      {!uid && <Placeholder />}
    </div>
  );
};

export default PreviewMarkets;
