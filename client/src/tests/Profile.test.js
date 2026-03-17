import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react");

describe("Profile Component Tests", () => {
  const mockUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    picture: "http://example.com/picture.jpg",
    sub: "auth0|123456",
    email_verified: true,
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: mockUser,
    });
  });

  test("displays user information correctly", () => {
    render(<Profile />);

    const image = screen.getByAltText("profile avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockUser.picture);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();

    expect(screen.getByText(`📨:${mockUser.email}`)).toBeInTheDocument();

    expect(screen.getByText(`🔑:${mockUser.sub}`)).toBeInTheDocument();

    const emailVerifiedText = mockUser.email_verified ? "Yes" : "No";
    expect(
      screen.getByText(`Email Verified: ${emailVerifiedText}`)
    ).toBeInTheDocument();
  });
});
