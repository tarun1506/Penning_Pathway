import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import { useAuthToken } from "../AuthTokenContext";

import "../style/profile.scss";

export default function Profile() {
  const { user } = useAuth0();
  

  return (
    <>
      <div className="proifle-edit">
        <Container className="container mt-4 mb-4 p-3 d-flex justify-content-center ">
          {" "}
          <Card className="card-profile p-4">
            {" "}
            <div className=" image d-flex flex-column justify-content-center align-items-center">
              {" "}
              <Image
                className="profile-image"
                roundedCircle
                src={user.picture}
                width="150"
                alt="profile avatar"
              ></Image>{" "}
              <Card.Body className="profile-card">
                <Card.Title className="fs-3 mt-2">{user.name}</Card.Title>{" "}
                <Card.Subtitle className="fs-5 responsive-subtitle ">
                  <span className="text-box">📨:{user.email}</span>
                </Card.Subtitle>
                <Card.Text className="card-text">
                  <span className="text-box">🔑:{user.sub}</span>
                </Card.Text>
                <Card.Text className="card-text">
                  Email Verified: {user.email_verified ? "Yes" : "No"}
                </Card.Text>
              </Card.Body>
            </div>{" "}
          </Card>
        </Container>
      </div>
    </>
  );
}
