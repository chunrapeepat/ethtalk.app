import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fbfbfb;
`;
const TextArea = styled.textarea`
  width: 100%;
  border: 0;
  outline: none;
  padding: 7px;
  border-bottom: 1px solid #ddd;

  &:disabled {
    background: white;
    cursor: not-allowed;
  }
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
  padding: 7px;
`;
const Support = styled.div`
  color: #555;
  font-size: 0.8rem;
`;

const CommentEditor = ({ children }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  return (
    <Container>
      <TextArea placeholder="Add a comment..." rows={4} disabled={true} />
      <Footer>
        <Support>Markdown and LaTex supported</Support>
        <Button>Sign in with Ethereum</Button>
      </Footer>
    </Container>
  );
};

export default CommentEditor;
