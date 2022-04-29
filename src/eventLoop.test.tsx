export {};

test("roba", () => {
  let x = 0;

  async function f() {
    await null;
    x++;
  }

  f();

  expect(x).toBe(0);
});
