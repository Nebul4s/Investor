import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

//the starting date must be the 1st item in the database for that spesific user and the data needs to be fetched accordingly

const LineGraph = ({ stock, time, mockdata }) => {
  const [graphData, setGraphData] = useState([]);
  const [url, setUrl] = useState(``);

  const { data } = useFetch(url);

  useEffect(() => {
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

    if (mockdata) setGraphData(mockdata);

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
          return tempData.push({ x: new Date(stock.datetime), y: stock.open });
        });

      if (tempData.length !== 0 || null || undefined) {
        let finalData = [];

        let week = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7);
        let month = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7 * 4);
        let year = Math.trunc(currentDate - 1000 * 60 * 60 * 24 * 7 * 4 * 12);

        tempData.forEach((item) => {
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
  }, [mockdata, stock, data, time]);

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
