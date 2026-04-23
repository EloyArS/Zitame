import { render, screen } from "@testing-library/react";
import App from "./App";

test("debe renderizar el sistema de rutas sin colapsar", () => {
  render(<App />);

  const linkElement = screen.getByText(/Sesion/i);

  expect(linkElement).toBeInTheDocument();
});
