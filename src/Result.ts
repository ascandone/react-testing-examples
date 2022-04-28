export type Result<T, E = string> =
  | { type: "OK"; value: T }
  | { type: "ERR"; error: E };
