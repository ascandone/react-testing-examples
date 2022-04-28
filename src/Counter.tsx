import { FC, useState } from "react";

export const Counter: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      Count: <span data-testid="count-value">{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
