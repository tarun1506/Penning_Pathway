import React, { useEffect, useState } from "react";

import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SlBookOpen } from "react-icons/sl";
import { BsBookmarkCheck } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { EXT_API_URL } from "../scripts/constants";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/Home.scss";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const myHeaders = new Headers();
  myHeaders.append(
    "X-RapidAPI-Key",
    "a78dd71dfamshdd128f788fe70f3p17a394jsncd4fafe8dafb"
  );
  myHeaders.append("X-RapidAPI-Host", "olato-quotes.p.rapidapi.com");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const [quote, setQuote] = useState("");

  const login = () => {
    loginWithRedirect();
  };

  useEffect(() => {
    const getQuote = async () => {
      try {
        const response = await fetch(EXT_API_URL, requestOptions);
        const data = await response.json();
        const quote = data.quote;
        setQuote(quote);
      } catch (err) {
        console.log(err);
      }
    };
    getQuote();
  }, []);
  return (
    <>
      <Navbar bg="pp" expand="lg" sticky="top">
        <Container className="p-2">
          <Navbar.Brand className="fs-3 cursive" href="#home">
            Penning Pathways
          </Navbar.Brand>
          <Nav>
            <Nav.Link className="link" onClick={loginWithRedirect}>
              Sign In
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="bg">
        <Container className="p-2 contentDiv rounded-4">
          <Row xs={1} md={2} className="childDiv ">
            <Col className="d-flex flex-column justify-content-center">
              <span className="fs-1">
                <h1 className="cursive">Welcome to Penning Pathways</h1>
              </span>
              <span className="fs-1">
                <h3 className="cursive">
                  Private Customizable <br /> Online Journal
                </h3>
              </span>
              <br />
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg loginButton"
                  id="loginButton"
                  onClick={!isAuthenticated?(login) : () => navigate("/app/journals")}
                >
                  Start your journey now &nbsp;
                </button>
              </div>
            </Col>
            <Col className="d-flex justify-content-center">
              <br />
              <br />
              <img
                src={require("../assets/homePageDisplay1.jpeg")}
                alt="homePageDisplay"
                className="img-fluid"
                width={350}
                height={350}
              />
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container className="p-5">
          <span className="fantasy tagLine">A journey to higher self </span>
          <br />
          <br />
          <Row className="d-flex flex-row justify-content-center">
            <Col>
              <div className="iconDiv">
                <span className="imgContainer">
                  <SlBookOpen />
                </span>
              </div>
              <br />
              <span>
                <h3>Unlimited entries</h3>
              </span>
              <span>
                <p>
                  Unlike other journaling platforms, you can write as much and
                  as often as you like, all for free.
                </p>
              </span>
            </Col>
            <Col>
              <div className="iconDiv">
                <span className="imgContainer">
                  <BsBookmarkCheck />
                </span>
              </div>
              <br />
              <span>
                <h3>Saves as you go</h3>
              </span>
              <span>
                <p>
                  Never worry about losing your work — Penning Pathway saves as
                  you type at your computer or on the go.
                </p>
              </span>
            </Col>
            <Col>
              <div className="iconDiv">
                <span className="imgContainer">
                  <SlCalender />
                </span>
              </div>
              <br />
              <span>
                <h3>A Perfect Planner</h3>
              </span>
              <span>
                <p>
                  Expertly orchestrating your events with precision and ease,
                  ensuring every detail is flawlessly executed for a seamless
                  experience.
                </p>
              </span>
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container className="p-5 rounded-4 qouteDiv">
          <div className="qoute monospace">
            <p>{quote}</p>
          </div>
        </Container>
      </div>
    </>
  );
}


