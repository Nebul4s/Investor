//svgs
import stockSVG from "../assets/stock.svg";
import trendingUp from "../assets/trending_up.svg";
import trendingDown from "../assets/trending_down.svg";

const PreviewBriefcase = ({ myStocks, error }) => {
  const handleStock = (e, item) => {
    console.log(e, item);
  };

  if (myStocks && myStocks.length !== 0) {
    console.log(myStocks);
    let initialValue = 0;
    const newSTocks = myStocks.filter((item) => item.symbol === "SHOP");
    const realAmount = newSTocks.reduce(
      (acc, cur) => acc + cur.amount,
      initialValue
    );
    const testObject = {
      ...(newSTocks[0].amount = realAmount),
      ...newSTocks[0],
    };
    console.log(testObject);
    console.log(realAmount);
  }

  return (
    <div className="PreviewBriefcase">
      <h2>My Stocks</h2>
      {error && <p>{error}</p>}
      <ul>
        {myStocks &&
          myStocks.map((item) => (
            <li
              className="market-el"
              key={item.id}
              onClick={(e) => handleStock(e, item)}
            >
              <div className="text">
                <h2>{item.name}</h2>
                <span>{item.symbol}</span>
                <span>Amount owned: {item.amount}</span>
              </div>
              <img src={stockSVG} alt="item img" />
              <div className="price">
                <span>${Number(item.open).toFixed(2)}</span>
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
        {/* Create state that holds users bought assets and map through them here */}
      </ul>
    </div>
  );
};

export default PreviewBriefcase;
