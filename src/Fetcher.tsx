import type { FC } from "react";
import { useTodos } from "./useTodos";

export const Fetcher: FC<{ id: number }> = ({ id }) => {
  const asyncTodos = useTodos(id);

  if (asyncTodos === undefined) {
    return <div>Loading...</div>;
  }

  switch (asyncTodos.type) {
    case "ERR":
      return (
        <div>
          ERROR:
          <pre>{asyncTodos.error}</pre>
        </div>
      );

    case "OK":
      const { value } = asyncTodos;
      return (
        <div>
          Item: `
          <code>
            {value.title} {value.completed ? "(Completed)" : ""}
          </code>
          `
        </div>
      );
  }
};
