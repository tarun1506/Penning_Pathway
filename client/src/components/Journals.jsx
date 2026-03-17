import React, { useEffect } from "react";
import { useState } from "react";
import useJournal from "../hooks/useJournal";
import { useAuthToken } from "../AuthTokenContext";
import {
  Container,
  Button,
  InputGroup,
  Form,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "../style/journals.scss";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

function NewJournalForm({
  handleClose,
  tags,
  setJournalItems,
  accessToken,
  journalItems,
  isAdding,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagId, setTagId] = useState("");
  const [tag, setTag] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setTagOptions(tags);
  }, [tags]);

  const addJournal = async () => {
    if (!title || !content || !tagId) {
      setError("Please fill in all fields");
      return;
    }
    const data = await fetch(`${process.env.REACT_APP_API_URL}/journals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title,
        content,
        tagId,
      }),
    });
    if (data.status !== 200) {
      const newJournal = await data.json();
      setJournalItems([...journalItems, newJournal]);
    }
    handleClose();
    window.location.reload();
  };

  return (
    <Modal show={isAdding} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Journal Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="journalForm.ControlInput1">
            <Form.Label>Journal Title</Form.Label>
            <Form.Control
              value={title}
              type="text"
              placeholder="Enter Title"
              aria-label="Enter Title"
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="journalForm.ControlInput2">
            <Form.Label>Enter Journal Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              aria-label="Enter Content"
              value={content}
              placeholder="Start writing your journal here"
              onChange={(e) => setContent(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="journalForm.ControlInput3">
            <Form.Label>Select Tag</Form.Label>
            <Form.Control
              as="select"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setTagId(e.target.options[e.target.selectedIndex].id);
              }}
            >
              <option label="Select Tag" value="">
                Select Tag
              </option>
              {tagOptions.map((tag) => (
                <option key={tag.id} id={tag.id} value={tag.tagName}>
                  {tag.tagName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button className="submit-btn" variant="primary" onClick={addJournal}>
          Add Journal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Journals() {
  const [newTagText, setNewTagText] = useState("");
  const [journalItems, setJournalItems, tags, setTags] = useJournal();
  const { accessToken } = useAuthToken();
  const [isAdding, setIsAdding] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editingIndices, setEditingIndices] = useState([]);
  const [editTagId, setEditTagId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClose = () => setIsAdding(false);
  const navigate = useNavigate();

  function waitThreeSeconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  }

  const toggleShowToast = () => setShowToast(!showToast);

  const addNewTag = async () => {
    if (!newTagText) {
      return;
    }
    const data = await fetch(`${process.env.REACT_APP_API_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tagName: newTagText,
      }),
    });
    if (data.status === 200) {
      const newTag = await data.json();
      setTags([...tags, newTag]);
      setNewTagText("");
      setShowToast(true);
      waitThreeSeconds().then(() => {
        setShowToast(false);
      });
    }
  };

  const addNewJournal = async () => {
    setIsAdding(true);
  };

  const deleteJournal = async (id) => {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/journals/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (data.status === 200) {
      setJournalItems(journalItems.filter((journal) => journal.id !== id));
    } else {
      console.log("Error deleting journal");
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditingIndices((prevIndices) => {
      const updatedIndices = [...prevIndices];
      updatedIndices[index] = !updatedIndices[index];
      return updatedIndices;
    });

    const journal = journalItems[index];
    console.log("journal in editing", journal);
    setEditTitle(journal.title);
    setEditTag(journal.tagDetail.tagName);
  };

  const handleSave = async (index) => {
    const journal = journalItems[index];
    if (editTitle !== journal.title || editTag !== journal.tagDetail.tagName) {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/journal/${journal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: editTitle,
            tagId: editTagId,
          }),
        }
      );

      if (data.status === 200) {
        const updatedJournal = await data.json();
        const updatedJournals = [...journalItems];
        updatedJournals[index] = updatedJournal;
        setJournalItems(updatedJournals);
        window.location.reload();
      }
    }

    setIsEditing(false);
    setEditingIndices((prevIndices) => {
      const updatedIndices = [...prevIndices];
      updatedIndices[index] = !updatedIndices[index];
      return updatedIndices;
    });
  };

  return (
    <>
      <div className="main-div">
        <Container className="p2 rounded-4">
          <br />
          <div className="button-div">
            <InputGroup className="mb-3 tag-textbox">
              <Form.Control
                placeholder="Enter New Tag"
                aria-label="Enter New Tag"
                aria-describedby="Adding New Tag"
                value={newTagText}
                onChange={(e) => setNewTagText(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                id="button-addon2"
                onClick={addNewTag}
                className="tag-btn-responsive"
              >
                Insert Tag
              </Button>
            </InputGroup>
            <Button
              className="newJournal-btn"
              variant="primary"
              onClick={addNewJournal}
            >
              Add Journal
            </Button>
          </div>

          <div class="tbl-header">
            <table
              className="journal-table"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Journal Title</th>
                  <th>Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content journal-table">
            <table
              className="journal-table "
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tbody>
                {journalItems.map((journal, index) => (
                  <tr
                    className="tr-custom"
                    key={journal.id}
                    onClick={() => navigate(`/app/journals/${journal.id}`)}
                  >
                    <td>{index + 1}</td>
                    <td>
                      {editingIndices[index] ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => {
                            setEditTitle(e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        journal.title
                      )}
                    </td>
                    <td>
                      {editingIndices[index] ? (
                        <select
                          value={editTag}
                          onChange={(e) => {
                            setEditTag(e.target.value);
                            setEditTagId(
                              e.target.options[e.target.selectedIndex].id
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option arial-labe="Select Tag" value="">
                            Select Tag
                          </option>
                          {tags.map((tag) => (
                            <option
                              key={tag.id}
                              id={tag.id}
                              value={tag.tagName}
                            >
                              {tag.tagName}
                            </option>
                          ))}
                          onClick={(e) => e.stopPropagation()}
                        </select>
                      ) : (
                        journal.tagDetail.tagName
                      )}
                    </td>
                    <td>
                      {!isEditing ? (
                        <Button
                          className="table-btn edit-btn"
                          variant="primary"
                          arial-labe="Edit Button"
                          value={journal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                        >
                          <GrEdit
                            style={{
                              color: "black",
                            }}
                          />
                        </Button>
                      ) : (
                        <Button
                          className="table-btn"
                          variant="success"
                          arial-label="Save Button"
                          value={journal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(index);
                          }}
                        >
                          <IoCheckmarkDoneCircle
                            style={{
                              color: "green",
                            }}
                          />
                        </Button>
                      )}
                      <Button
                        className="table-btn del-btn"
                        variant="danger"
                        arial-label="Delete Button"
                        value={journal.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJournal(journal.id);
                        }}
                      >
                        <RiDeleteBin6Line
                          style={{
                            color: "red",
                          }}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
      {isAdding ? (
        <NewJournalForm
          handleClose={handleClose}
          tags={tags}
          setJournalItems={setJournalItems}
          accessToken={accessToken}
          journalItems={journalItems}
          isAdding={isAdding}
        />
      ) : null}
      <ToastContainer
        className="p-3"
        position="top-center"
        style={{ zIndex: 1 }}
      >
        <Toast show={showToast} onClose={toggleShowToast}>
          <Toast.Header>
            <strong className="me-auto">New Tag Added</strong>
          </Toast.Header>
          <Toast.Body>Woohoo, New Tag Added</Toast.Body>
        </Toast>
      </ToastContainer>
     
    </>
  );
}
