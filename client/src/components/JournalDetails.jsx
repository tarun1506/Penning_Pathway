import { useAuthToken } from "../AuthTokenContext";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/journalDet.scss";
import { Container, Card, Button } from "react-bootstrap";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { BsBackspace } from "react-icons/bs";

export default function JournalDetails() {
  const { accessToken } = useAuthToken();
  const [repository, setRepository] = useState();
  const params = useParams();
  console.log("repository", repository);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(repository?.content);

  async function getJournalDetails() {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/journals/${params.journalsId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (data.status === 200) {
      const journal = await data.json();
      setRepository(journal);
    }
  }

  const onSaving = async () => {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/journals/${params.journalsId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tagDetailId: repository?.tagDetail?.id,
          content: content,
        }),
      }
    );
    if (data.status === 200) {
      setEditMode(false);
      getJournalDetails();
    }
  };

  useEffect(() => {
    if (accessToken) {
      getJournalDetails();
    }
  }, [accessToken, params]);

  return (
    <>
      <div className="detail-div">
        <Container className="p-2 contentDiv rounded-4">
          <br />
            <Link classname="back-link" to="/app/journals">
              {" "}
              <BsBackspace /> Journals
            </Link>
          <Card className="content-card">
            <Card.Header>
              <h3>{repository?.title}</h3>
              Tag to: {repository?.tagDetail?.tagName}
            </Card.Header>
            <Card.Body className="content-card-body">
              <blockquote className="blockquote mb-0">
                <p className="content-text"
                  onClick={() => {
                    setContent(repository?.content);
                    setEditMode(true);
                  }}
                >
                  {editMode ? (
                    <textarea
                      className="edit-area"
                      label="Edit Content"
                      placeholder="Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  ) : (
                    repository?.content
                  )}{" "}
                </p>
              </blockquote>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Last updated on: {repository?.updatedAt}
              </small>
              {editMode ? (
                <Button className="save-content" onClick={onSaving}>
                  <IoCheckmarkDoneOutline /> Save Changes
                </Button>
              ) : null}
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </>
  );
}
