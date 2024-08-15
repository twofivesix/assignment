import React from "react";

const Summary = ({ items }: { items: number[] }) => {
  const sum = items.reduce((prev, cur) => prev + cur, 0);
  const average = sum / items.length;
  const slowest = Math.max(...items);
  const fastest = Math.min(...items);

  return (
    <div>
      <div>
        Fastest:
        <span data-testid="fastest">
          {" "}
          {Number.isFinite(fastest) && fastest}
        </span>{" "}
        ms
      </div>
      <div>
        Slowest:
        <span data-testid="slowest">
          {" "}
          {Number.isFinite(slowest) && slowest}
        </span>{" "}
        ms
      </div>
      <div>
        Average:
        <span data-testid="average">
          {" "}
          {Number.isFinite(average) && average?.toFixed(3)}
        </span>{" "}
        ms
      </div>
    </div>
  );
};

export default Summary;
