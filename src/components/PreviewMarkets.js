import { useFetch } from "../hooks/useFetch";
import { useState, useEffect } from "react";

//components
import ShowSingleMarket from "./ShowSingleMarket";

//svgs
import stockSVG from "../assets/stock.svg";
import trendingUp from "../assets/trending_up.svg";
import trendingDown from "../assets/trending_down.svg";

const PreviewMarkets = ({ uid }) => {
  const [singleMarket, setSingleMarket] = useState(null);
  const [marketElement, setMarketElement] = useState("");
  const [url, setUrl] = useState("");

  const { data, error } = useFetch(url);

  if (error) {
    console.log(error);
  }

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

  const formatData = [];

  Object.values(data).forEach((stock) => {
    formatData.push(stock);
  });

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
      <ul>
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
              <img src={stockSVG} alt="Stock img" />
              <div className="price">
                <span>${Number(stock.open).toFixed(2)}</span>
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
      <ShowSingleMarket stock={singleMarket} uid={uid} />
    </div>
  );
};

export default PreviewMarkets;
