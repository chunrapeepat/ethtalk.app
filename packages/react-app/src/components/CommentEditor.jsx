import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import { InfoCircleOutlined } from "@ant-design/icons";

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
const Support = styled.a`
  color: #555;
  font-size: 0.8rem;

  &:hover {
    color: #555;
    text-decoration: underline;
  }
`;
const Patron = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 12px;
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
    <>
      <Patron>
        <InfoCircleOutlined /> For patronizing, you can treat the author a beer 🍺 and attach it with this comment (1x🍺
        = 0.001 ETH)
      </Patron>
      <Container>
        <TextArea placeholder="Add a comment..." rows={4} disabled={true} />
        <Footer>
          {/* TODO: Add link for writing instruction (to markdown file) */}
          <Support target="_blank" href="">
            Markdown and LaTex supported
          </Support>
          <Button>Sign in with Ethereum</Button>
        </Footer>
      </Container>
    </>
  );
};

export default CommentEditor;
