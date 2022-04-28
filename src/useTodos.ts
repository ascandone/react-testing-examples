import {
  number,
  object,
  Infer,
  reasonToXmlString,
  string,
  boolean,
} from "ts-decode";
import { FC, useEffect, useState } from "react";
import type { Result } from "./Result";

export type TodoItem = Infer<typeof todo>;

const todo = object({
  userId: number.required,
  id: number.required,
  title: string.required,
  completed: boolean.required,
});

export const useTodos = (id: number) => {
  const [asyncData, setAsyncData] = useState<Result<TodoItem> | undefined>(
    undefined
  );

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = todo.decode(data);
        if (parsed.error) {
          setAsyncData({
            type: "ERR",
            error: reasonToXmlString(parsed.reason),
          });
        } else {
          setAsyncData({
            type: "OK",
            value: parsed.value,
          });
        }
      })
      .catch((err) => {
        setAsyncData({
          type: "ERR",
          error: err.message,
        });
      });

    return () => {
      abortController.abort();
    };
  }, [id]);

  return asyncData;
};
