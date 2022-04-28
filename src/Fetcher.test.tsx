import { Fetcher } from "./Fetcher";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

let queue: Array<(value: unknown) => void> = [];
beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn(async () => ({
    json() {
      return new Promise((res) => {
        queue.push(res);
      });
    },
  }));
});

const delay = () => act(async () => {});

beforeEach(() => {
  queue = [];
});

function* shift() {
  for (;;) {
    const callback = queue.shift();
    if (callback === undefined) {
      throw new Error("Empty queue");
    }
    yield callback;
  }
}

test("Should display loading screen as long as long as fetch does not return data", async () => {
  const component = render(<Fetcher id={0} />);

  await null;

  expect(component.getByTestId("loading-view")).toBeVisible();

  component.unmount();
});

test("Should display error screen when data is invalid", async () => {
  const component = render(<Fetcher id={0} />);
  await null;

  const [c1] = shift();

  c1({
    error: "invalid schema",
  });

  await delay();

  expect(component.getByTestId("error-view")).toBeVisible();

  component.unmount();
});

test("Should display data when fetch is ok", async () => {
  const component = render(<Fetcher id={0} />);
  await null;

  const [c1] = shift();

  c1({
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

  const [c1, _, c2] = shift();

  c2({
    userId: 42,
    id: 0,
    title: "Second item",
    completed: true,
  });

  await delay();

  c1({
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
