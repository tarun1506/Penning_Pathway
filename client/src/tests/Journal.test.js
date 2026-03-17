import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Journals from "../components/Journals";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("../AuthTokenContext");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));



describe("Journal Component Tests", () => {
  const mockaddNewTag = jest.fn();
  beforeEach(() => {
    useAuthToken.mockReturnValue({ accessToken: "fake-token" });
    global.fetch = jest.fn((url, options) => {
      if (
        url === `${process.env.REACT_APP_API_URL}/journals` &&
        options.method !== "POST"
      ) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                createdAt: "2024-04-22T21:29:28.340Z",
                updatedAt: "2024-04-23T02:47:05.558Z",
                title: "Test Title 1",
                content: "Test content 1",
                tagDetailId: 1,
                userId: 1,
                tagDetail: {
                  id: 1,
                  tagName: "Test",
                  userId: 1,
                },
              },
              {
                id: 2,
                createdAt: "2024-04-22T21:29:28.340Z",
                updatedAt: "2024-04-23T02:47:05.558Z",
                title: "Test Title 2",
                content: "Test content 2",
                tagDetailId: 1,
                userId: 1,
                tagDetail: {
                  id: 1,
                  tagName: "Test",
                  userId: 1,
                },
              },
            ]),
        });
      }

      if (
        url === `${process.env.REACT_APP_API_URL}/tags` &&
        options.method === "POST"
      ) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              tagName: "Test2",
            }),
        });
      }

      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders and interacts correctly", async () => {
    render(<Journals />);

    await waitFor(() => {
      expect(screen.getByText("Test Title 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Test Title 2")).toBeInTheDocument();

    

    fireEvent.change(screen.getByLabelText("Enter New Tag"), {
      target: { value: "Test2" },
    });
    fireEvent.click(screen.getByText("Insert Tag"));  
  });
});
