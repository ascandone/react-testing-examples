import { Btn } from "./Button";

import { fireEvent, render } from "@testing-library/react";

test("Should call onClick handler when clicked", () => {
  const callback = jest.fn();

  const component = render(<Btn onClick={callback}>Click me</Btn>);

  fireEvent.click(component.getByText(/Click me/));

  expect(callback).toBeCalled();
});
