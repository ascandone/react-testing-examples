import type { FC } from "react";
import { useTodos } from "./useTodos";

export const Fetcher: FC<{ id: number }> = ({ id }) => {
  const asyncTodos = useTodos(id);

  if (asyncTodos === undefined) {
    return <div data-testid="loading-view">Loading...</div>;
  }

  switch (asyncTodos.type) {
    case "ERR":
      return (
        <div data-testid="error-view">
          ERROR:
          <pre>{asyncTodos.error}</pre>
        </div>
      );

    case "OK":
      const { value } = asyncTodos;
      return (
        <div data-testid="success-view">
          Item: `
          <code>
            {value.title} {value.completed ? "(Completed)" : ""}
          </code>
          `
        </div>
      );
  }
};
