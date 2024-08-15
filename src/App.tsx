import React, { useState, useRef } from "react";
import { css } from "@emotion/css";

import { fetchLastLocation } from "./backend/fetchLastLocations";
import Summary from "./Summary";

const getStyles = () => ({
  button: css`
    border: 1px solid black;
    background: transparent;
    padding: 5px;
  `,
  container: css`
    margin: 10px;
  `,
});

interface Location {
  id: number;
  timestamp: number;
  executionTime?: number;
  address?: {
    street: string;
    city: string;
    id: string;
  };
}

const filterLoadedLocations = (locations: Location[]) => {
  return locations
    .map((location) => location.executionTime)
    .filter((t): t is number => typeof t === "number");
};

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const requestCounter = useRef(0);

  const handleOnClick = async () => {
    const timestamp = Date.now();
    const newLocation: Location = {
      id: requestCounter.current,
      timestamp,
    };
    requestCounter.current++;
    setLocations((locations) => locations.concat(newLocation));

    await fetchLastLocation().then((res) => {
      setLocations((locations) => {
        const updatedLocations = locations.map((location) => {
          if (location.id === newLocation.id) {
            return {
              ...location,
              executionTime: Date.now() - timestamp,
              address: res.address,
            };
          } else {
            return location;
          }
        });
        return updatedLocations;
      });
    });
  };

  const s = getStyles();
  return (
    <div className={s.container}>
      <button className={s.button} onClick={handleOnClick}>
        Get Last Location
      </button>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Street</th>
            <th>City</th>
            <th>Execution Time (ms)</th>
          </tr>
        </thead>
        <tbody data-testid="locationTable">
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.timestamp}</td>
              <td>{location.address?.street}</td>
              <td>{location.address?.city}</td>
              <td>{location.executionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Summary items={filterLoadedLocations(locations)} />
    </div>
  );
}

export default App;
