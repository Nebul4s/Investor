import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

//components
import LineGraph from "../components/LineGraph";
import PreviewBriefcase from "../components/PreviewBriefcase";

const Portfolio = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection("stocks", ["uid", "==", user.uid]);
  const { balance } = useCollection("users", ["uid", "==", user.uid]);

  const totalAmountOfStocks =
    documents &&
    documents.reduce((acc, cur) => {
      return acc + cur.amount;
    }, 0);

  let lastValue =
    balance &&
    balance[0].portfolioHistory.length >= 2 &&
    balance[0].portfolioHistory.at(-2).y;
  let currentValue = balance && balance[0].totalValue;

  const change = currentValue - lastValue;
  const pChange = ((currentValue - lastValue) / lastValue) * 100;

  return (
    <div className="Portfolio">
      {error && <p>{error}</p>}
      <div className="ShowPortfolio">
        {documents && (
          <div className="graph-container">
            <div className="title">
              <h1>My Portfolio</h1>
              <h1>
                $
                {balance &&
                  balance[0].totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </h1>
            </div>
            <LineGraph portfolio={balance && balance[0].portfolioHistory} />
            <div className="lists">
              <ul>
                <li>
                  Shares owned:<strong>{totalAmountOfStocks} shares</strong>
                </li>
                <li>
                  Percent change
                  <strong>
                    {balance &&
                      balance[0].portfolioHistory.length >= 2 &&
                      pChange.toFixed(2)}
                    %
                  </strong>
                </li>
                <li>
                  Change
                  <strong>
                    $
                    {balance &&
                      balance[0].portfolioHistory.length >= 2 &&
                      change.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </strong>
                </li>
              </ul>
              <ul>
                <li>
                  Cash Balance:
                  <strong>
                    $
                    {balance &&
                      balance[0].balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </strong>
                </li>
                <li>
                  Stocks Value:
                  <strong>
                    $
                    {balance &&
                      balance[0].stocksValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </strong>
                </li>
                <li>
                  Total Value:
                  <strong>
                    $
                    {balance &&
                      balance[0].totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        )}
        {documents && <PreviewBriefcase myStocks={documents} />}
      </div>
    </div>
  );
};

export default Portfolio;
