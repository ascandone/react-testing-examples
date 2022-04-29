import { Fetcher } from "./Fetcher";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { FetchQueue } from "./FetchQueue";

const queue = new FetchQueue();

beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn(queue.getMockFetch);
});

beforeEach(() => {
  queue.reset();
});

const delay = () => act(async () => {});

test("Should display loading screen as long as long as fetch does not return data", async () => {
  const component = render(<Fetcher id={0} />);

  await null;

  expect(component.getByTestId("loading-view")).toBeVisible();

  component.unmount();
});

test("Should display error screen when data is invalid", async () => {
  const component = render(<Fetcher id={0} />);
  await null;

  const [req1] = queue.shift();

  expect(req1.url).toBe("https://jsonplaceholder.typicode.com/todos/0");

  req1.resolve({
    error: "invalid schema",
  });

  await delay();

  expect(component.getByTestId("error-view")).toBeVisible();
  expect(component.getByTestId("error-view")).toHaveTextContent(/ERROR:/);

  component.unmount();
});

test("Should display data when fetch is ok", async () => {
  const component = render(<Fetcher id={0} />);
  await null;

  const [req1] = queue.shift();

  req1.resolve({
    userId: 42,
    id: 0,
    title: "Item title",
    completed: true,
  });

  await delay();

  expect(component.getByTestId("success-view")).toBeVisible();

  component.unmount();
});

test("When props re-renders, should not generate race conditions", async () => {
  const component = render(<Fetcher id={0} />);
  component.rerender(<Fetcher id={1} />);
  component.rerender(<Fetcher id={0} />);

  await null;

  const [req1, _, req3] = queue.shift();

  req3.resolve({
    userId: 42,
    id: 0,
    title: "Second item",
    completed: true,
  });

  await delay();

  req1.resolve({
    userId: 42,
    id: 1,
    title: "First item",
    completed: true,
  });

  await delay();

  expect(component.getByTestId("success-view")).toBeVisible();
  expect(component.getByTestId("success-view")).toHaveTextContent(
    /Second item/
  );

  component.unmount();
});
