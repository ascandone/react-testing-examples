export const deferred = <T>(): [Promise<T>, (value: T) => void] => {
  let resolver;

  const promise = new Promise<T>((resolve) => {
    resolver = resolve;
  });

  return [promise, resolver as any];
};
