import styled from "styled-components";
import Comment from "./components/Comment";
import CommentEditor from "./components/CommentEditor";
import { Divider } from "antd";

const Footer = styled.span`
  display: block;
  color: #555;
  font-weight: normal;
  font-size: 0.8rem;
  margin-top: 12px;
`;

const EmbedPage = () => {
  return (
    <>
      <h3>26 comments</h3>
      <Comment>
        <Comment />
        <Comment />
        <Comment />
      </Comment>
      <Comment>
        <Comment />
        <Comment />
        <Comment />
      </Comment>
      <Divider />
      <CommentEditor />
      <Footer>
        Powered by{" "}
        <a href="https://ethtalk.app" target="_blank">
          EthTalk
        </a>
      </Footer>
    </>
  );
};

export default EmbedPage;
