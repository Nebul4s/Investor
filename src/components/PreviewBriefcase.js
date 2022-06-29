//Images and svgs
import stockSVG from "../assets/stock.svg";
import trendingUp from "../assets/trending_up.svg";
import trendingDown from "../assets/trending_down.svg";

const PreviewBriefcase = ({ myStocks, error }) => {
  return (
    <div className="PreviewBriefcase">
      <h2>My Stocks</h2>
      {error && <p>{error}</p>}
      <ul>
        {myStocks &&
          myStocks.map((item) => (
            <li className="market-el" key={item.id}>
              <div className="text">
                <h2>{item.name}</h2>
                <span>{item.symbol}</span>
                <span>Amount owned: {item.amount}</span>
              </div>
              <img className="stockSVG" src={stockSVG} alt="item img" />
              <div className="price">
                <span className="stock-price">
                  ${Number(item.close).toFixed(2)}
                </span>
                <span
                  className="percent"
                  style={{
                    color:
                      Number(item.percent_change) === 0
                        ? "white"
                        : Number(item.percent_change) > 0
                        ? "green"
                        : "red",
                  }}
                >
                  {Number(item.percent_change).toFixed(2)}%
                </span>
                <img
                  className="trendingIMG"
                  src={
                    Number(item.percent_change) > 0 ? trendingUp : trendingDown
                  }
                  style={
                    Number(item.percent_change) > 0
                      ? { background: "green" }
                      : { background: "red" }
                  }
                  alt="Trending up/down"
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PreviewBriefcase;
