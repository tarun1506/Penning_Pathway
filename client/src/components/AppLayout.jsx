import "../style/appLayout.scss";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { SlLogout } from "react-icons/sl";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar bg="pp" expand="lg" className="nav-main">
        <Container className="p-2 responsive-edit ">
          <Nav className="align-items-center justify-content-space-evenly nav-div" as="ul">
            <Nav.Link as="li">
              <img
                className="logo-container"
                src={require("../assets/logo.png")}
                alt="Logo"
              ></img>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/app">Profile</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/app/debugger">Auth Debugger</Link>
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center justify-content-space-evenly nav-div res-edit" as="ul">
            <Nav.Link as="li">
              <Link to="/app/journals">Journals</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link as="li" onClick={() => logout({ returnTo: window.location.origin })}>
              <SlLogout className="logout-btn"/>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}
