/* istanbul ignore file */
export type QueueItem = {
  url: string;
  resolve: (value: unknown) => void;
};

export class FetchQueue {
  private _queue: Array<QueueItem> = [];

  getMockFetch = async (
    url: string,
    options: {
      signal?: AbortSignal;
    } = {}
  ) => {
    let aborted = false;

    if (options.signal != undefined) {
      options.signal.addEventListener("abort", () => {
        aborted = true;
      });
    }

    const promise = new Promise((resolve) => {
      this._queue.push({
        url,
        resolve(value) {
          if (!aborted) {
            resolve(value);
          }
        },
      });
    });

    return {
      json: () => promise,
    };
  };

  reset() {
    this._queue = [];
  }

  *shift() {
    for (;;) {
      const queueItem = this._queue.shift();
      if (queueItem === undefined) {
        throw new Error("Empty queue");
      }
      yield queueItem;
    }
  }
}
