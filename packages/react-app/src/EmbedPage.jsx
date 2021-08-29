import styled from "styled-components";
import { Comment, Reply, CommentEditor } from "./components";
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
      {/* TODO: remove margin if total comment = 0 */}
      <div style={{ marginTop: 24 }}>
        <Comment>
          <Reply />
          <Reply />
          <Reply />
        </Comment>
        <Comment />
        <Comment>
          <Reply />
        </Comment>
      </div>
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
