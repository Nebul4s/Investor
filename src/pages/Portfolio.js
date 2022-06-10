import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

import LineGraph from "../components/LineGraph";
import PreviewBriefcase from "../components/PreviewBriefcase";
import ActionHistory from "../components/ActionHistory";

const Portfolio = () => {
  const [show, setShow] = useState(false);
  const { user } = useAuthContext();
  const { documents, error } = useCollection("stocks", ["uid", "==", user.uid]);

  return (
    <div className="Portfolio">
      {error && <p>{error}</p>}
      <button onClick={() => setShow(!show)}>
        {show ? "Show Portfolio" : "Show Action History"}
      </button>
      {show && (
        <div className="actionHistory">
          <ActionHistory documents={documents} />
        </div>
      )}
      {!show && (
        <div className="ShowPortfolio">
          {documents && (
            <div className="graph-container">
              <div className="title">
                <h1>My Portfolio</h1>
                <h1>250€</h1>
              </div>
              <LineGraph stock={documents} />
              <div className="lists">
                <ul>
                  <li>Shares owned:</li>
                  <li>Most shares owned:</li>
                </ul>
                <ul>
                  <li>
                    Shares owned:<strong>50</strong>
                  </li>
                  <li>
                    Most shares owned:<strong>Apple</strong>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {documents && <PreviewBriefcase myStocks={documents} />}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
