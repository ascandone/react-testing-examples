import { FetchQueue } from "./FetchQueue";

const queue = new FetchQueue();

beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn(queue.getMockFetch);
});

beforeEach(() => {
  queue.reset();
});

test("req.resolve() resolves the promise with the given value", async () => {
  const p = fetch("/api/users");

  const [req1] = queue.shift();

  req1.resolve({ value: 42 });

  const res = await p;
  const json = await res.json();

  expect(json).toEqual({ value: 42 });
}, 500);

test("AbortController prevent the promise to resolve", () => {
  const abortController = new AbortController();
  const p = fetch("/api/users", { signal: abortController.signal });

  const [req1] = queue.shift();

  const cb = jest.fn();
  p.then(cb);

  abortController.abort();
  req1.resolve({ value: 42 });

  expect(cb).not.toBeCalled();
}, 1000);

test("shift preserves the given order", async () => {
  const p1 = fetch("/api/users/1");
  const p2 = fetch("/api/users/2");
  const p3 = fetch("/api/users/3");

  const [req1, req2, req3] = queue.shift();

  req3.resolve({ value: "user-3" });
  req2.resolve({ value: "user-2" });
  req1.resolve({ value: "user-1" });

  const [res2, res1, res3] = await Promise.all([
    p2.then((r) => r.json()),
    p1.then((r) => r.json()),
    p3.then((r) => r.json()),
  ]);

  expect(res1).toEqual({ value: "user-1" });
  expect(res2).toEqual({ value: "user-2" });
  expect(res3).toEqual({ value: "user-3" });
}, 500);
