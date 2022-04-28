import { Counter } from "./Counter";
import { cleanup, fireEvent, render } from "@testing-library/react";

test("Increment", () => {
  const component = render(<Counter />);

  fireEvent.click(component.getByText(/Increment/));

  expect(component.getByTestId("count-value").textContent).toBe("1");
});
