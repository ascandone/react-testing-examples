import { deferred } from "./deferred";

test("Should resolve synchronously", async () => {
  const [promise, resolve] = deferred();

  resolve(42);

  const value = await promise;
  expect(value).toBe(42);
});

test("Should resolve asynchronously", async () => {
  const [promise, resolve] = deferred();

  setTimeout(() => {
    resolve(42);
  }, 100);

  const value = await promise;

  expect(value).toBe(42);
}, 1000);
