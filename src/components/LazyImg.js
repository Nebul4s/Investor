import { useState, useEffect } from "react";

const LazyImg = ({ lq, src, className }) => {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(lq);

  useEffect(() => {
    if (path === lq) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setPath(img.src);
        setLoading(false);
      };
    }
  }, []);

  return (
    <img
      src={path}
      className={className}
      style={{
        opacity: loading ? 0.5 : 1,
        transition: "opacity .15s linear",
      }}
      alt={"Image"}
    ></img>
  );
};

export default LazyImg;
