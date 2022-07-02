import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const LineGraph = ({ stock, portfolio, time }) => {
  const [graphData, setGraphData] = useState([]);
  const [url, setUrl] = useState(``);

  const { data } = useFetch(url);

  useEffect(() => {
    //Dates that set the query to contain 2 year historical data on fetch
    const currentDate = new Date();

    const startingDate = [
      currentDate.getFullYear() - 2,
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    ];

    const endingDate = [
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    ];

    //Create graphdata for portfolio
    if (portfolio && portfolio.length > 0) {
      const portfolioData = [];
      portfolio.forEach((item) => {
        portfolioData.push({
          x: new Date(item.x.seconds * 1000),
          y: item.y.toString(),
        });
      });
      setGraphData(portfolioData);
    }

    //If stock was chosen fetch data and re-render
    if (stock) {
      setUrl(
        `/time_series?start_date=${startingDate.join(
          "-"
        )}&end_date=${endingDate.join("-")}&symbol=${
          stock.symbol
        }&interval=1day&outputsize=730`
      );
    }

    const createGraphData = () => {
      let tempData = [];

      if (data.values.length !== 0)
        data.values.map((stock) => {
          return tempData.push({ x: new Date(stock.datetime), y: stock.close });
        });

      if (tempData.length !== 0 || null || undefined) {
        //Helpers
        let finalData = [];

        let week = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7);
        let month = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7 * 4);
        let year = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7 * 4 * 12);

        tempData.forEach((item) => {
          //Foreach revolution, check chosen time and compare item dates to helpers above
          if (time === "1WK" && +item.x >= week) {
            finalData.push(item);
            setGraphData(finalData);
          }
          if (time === "1M" && +item.x >= month) {
            finalData.push(item);
            setGraphData(finalData);
          }
          if (time === "1Y" && +item.x >= year) {
            finalData.push(item);
            setGraphData(finalData);
          }
          if (time === "2Y" || time === "") setGraphData(tempData);
        });
      }
    };

    if (!data || data.code === 400) return;

    createGraphData();
  }, [stock, data, time, portfolio]);

  return (
    <div className="linegraph">
      {stock && (
        <Line
          data={{
            datasets: [
              {
                type: "line",
                backgroundColor: "black",
                borderColor: "#5AC53B",
                borderWidth: 2,
                pointBorderColor: "rgba(0, 0, 0, 0)",
                pointBackgroundColor: "rgba(0, 0, 0, 0)",
                pointHoverBackgroundColor: "#5AC53B",
                pointHoverBorderColor: "#000000",
                pointHoverBorderWidth: 4,
                pointHoverRadius: 6,
                data: graphData,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              mode: "index",
              intersect: false,
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  distribution: "linear",
                  time: {
                    unit: "day",
                    parser: "YY/MM/DD",
                  },
                },
              ],
            },
          }}
        />
      )}
      {portfolio && (
        <Line
          data={{
            datasets: [
              {
                type: "line",
                backgroundColor: "black",
                borderColor: "#5AC53B",
                borderWidth: 2,
                pointBorderColor: "rgba(0, 0, 0, 0)",
                pointBackgroundColor: "rgba(0, 0, 0, 0)",
                pointHoverBackgroundColor: "#5AC53B",
                pointHoverBorderColor: "#000000",
                pointHoverBorderWidth: 4,
                pointHoverRadius: 6,
                data: graphData,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              mode: "index",
              intersect: false,
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  distribution: "linear",
                  time: {
                    unit: "day",
                    parser: "YY/MM/DD",
                  },
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
