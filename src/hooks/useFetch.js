import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const TOKEN = "&apikey=c7532e07717d405f93713ae6435492eb";
  const BASE_URL = "https://api.twelvedata.com";

  useEffect(() => {
    const getData = async () => {
      try {
        if (!url) return;
        const res = await fetch(`${BASE_URL}${url}${TOKEN}`);
        const json = await res.json();

        if (json.code === 429) {
          setError(json);
          return;
        }

        setData(json);
      } catch (err) {
        console.error(err.message);
      }
    };
    getData();
  }, [url]);

  return { data, error };
};
