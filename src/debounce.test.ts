import { debounce } from "./debounce";

jest.useFakeTimers();

const TIME_UNIT = 100;

test("Should not call the given function if not called", () => {
  const callback = jest.fn();
  debounce(callback, TIME_UNIT);

  jest.runAllTimers();

  expect(callback).not.toBeCalled();
});

test("Should not call the function synchronously", () => {
  const callback = jest.fn();
  const debouncedCallback = debounce(callback, TIME_UNIT);

  //   Call function
  debouncedCallback();

  expect(callback).not.toBeCalled();
});

test("Should debounce the given function", () => {
  const callback = jest.fn() as (x: number) => void;
  const debouncedCallback = debounce(callback, TIME_UNIT);

  debouncedCallback(0);
  jest.advanceTimersByTime(TIME_UNIT - 5);
  debouncedCallback(1);
  jest.advanceTimersByTime(TIME_UNIT - 20);
  debouncedCallback(2);
  jest.advanceTimersByTime(TIME_UNIT + 1);
  debouncedCallback(3);

  expect(callback).toHaveBeenLastCalledWith(2);
  expect(callback).toHaveBeenCalledTimes(1);

  jest.runAllTimers();
  expect(callback).toHaveBeenLastCalledWith(3);
  expect(callback).toHaveBeenCalledTimes(2);
});
