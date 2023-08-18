import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

//DAVE DELETE LINE 5
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { REMOVE_BOOK } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { useQuery } from "@apollo/client";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  const [removeBook, { error: removeError, removeData }] = useMutation(REMOVE_BOOK);


  
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = userData && Object.keys(userData).length;

  // o	Remove the useEffect() Hook that sets the state for UserData.
  // o	Instead, use the useQuery() Hook to execute the GET_ME query on load and save it to a variable named userData.

  const { loading, error, data } = useQuery(GET_ME);

  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);
  

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { removeData } = await removeBook({
        variables: {
          bookId: bookId,
        },
      });

      if (!removeData.removeBook) {
        throw new Error("Failed to remove book");
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
        {userData && userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
        {userData && userData.savedBooks && userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
