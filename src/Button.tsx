import { FC, ReactNode } from "react";

export const Btn: FC<{
  onClick: () => void;
  children: ReactNode;
}> = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;
