import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

import App from "./App";

let mockFetchDelay = 0;

const mockDelay = (delayMilliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMilliseconds);
  });
};

jest.mock("./backend/fetchLastLocations", () => ({
  fetchLastLocation: () => {
    return mockDelay(mockFetchDelay).then(() =>
      Promise.resolve({
        address: {
          id: "1234",
          street: "1 Main Street",
          city: "New York",
        },
      }),
    );
  },
}));

test("renders Summary component", async () => {
  await React.act(async () => {
    render(<App />);
  });

  const linkElement = screen.getByText(/Timestamp/i);
  expect(linkElement).toBeInTheDocument();
});

test("clicks button twice and gets two locations", async () => {
  await React.act(async () => {
    render(<App />);
  });

  await React.act(async () => {
    const button = screen.getByText(/Get Last Location/i);
    await userEvent.click(button);
    await userEvent.click(button);
  });

  const rows = screen.getByTestId("locationTable").children;
  expect(rows.length).toEqual(2);

  const cities = screen.getAllByText(/New York/i);
  expect(cities.length).toEqual(2);
});

test("calculates stats for 3 locations", async () => {
  const fastest = 50;
  const middle = 100;
  const slowest = 200;
  const average = (slowest + middle + fastest) / 3;
  const epsilon = 50;

  await React.act(async () => {
    render(<App />);
  });

  await React.act(async () => {
    const button = screen.getByText(/Get Last Location/i);
    mockFetchDelay = fastest;
    await userEvent.click(button);
    mockFetchDelay = middle;
    await userEvent.click(button);
    mockFetchDelay = slowest;
    await userEvent.click(button);
  });

  await mockDelay(300);

  const fastestResult = parseInt(screen.getByTestId("fastest").innerHTML);
  const slowestResult = parseInt(screen.getByTestId("slowest").innerHTML);
  const averageResult = parseInt(screen.getByTestId("average").innerHTML);

  console.log(fastestResult, slowestResult, averageResult);

  expect(fastestResult).toBeGreaterThan(fastest);
  expect(fastestResult).toBeLessThan(fastest + epsilon);
  expect(slowestResult).toBeGreaterThan(slowest);
  expect(slowestResult).toBeLessThan(slowest + epsilon);
  expect(averageResult).toBeGreaterThan(average);
  expect(averageResult).toBeLessThan(average + epsilon);
});
