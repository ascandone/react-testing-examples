export const debounce = <Args extends any[]>(
  callback: (...values: Args) => void,
  ms: number
) => {
  let lastTimeoutId: NodeJS.Timeout | undefined = undefined;

  return (...values: Args) => {
    if (lastTimeoutId !== undefined) {
      clearTimeout(lastTimeoutId);
    }

    lastTimeoutId = setTimeout(callback, ms, ...values);
  };
};
