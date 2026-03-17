import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "../components/Home";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Home Component Tests", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByText("Penning Pathways")).toBeInTheDocument();
  });

  test("Login button triggers loginWithRedirect", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Start your journey now"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Navigates to /app/journals when authenticated", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
    });
    render(<Home />);
    fireEvent.click(screen.getByText("Start your journey now"));
    expect(mockNavigate).toHaveBeenCalledWith("/app/journals");
  });

  test("Displays quote from external API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ quote: "Test Quote" }),
      })
    );
    render(<Home />);
    const expectedHeaders = new Headers();
    expectedHeaders.append(
      "X-RapidAPI-Key",
      "a78dd71dfamshdd128f788fe70f3p17a394jsncd4fafe8dafb"
    );
    expectedHeaders.append("X-RapidAPI-Host", "olato-quotes.p.rapidapi.com");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://olato-quotes.p.rapidapi.com/motivation?quotes=random%20quotes",
      {
        method: "GET",
        headers: expectedHeaders,
        redirect: "follow",
      }
    );
    expect(await screen.findByText("Test Quote")).toBeInTheDocument();
  });


});



