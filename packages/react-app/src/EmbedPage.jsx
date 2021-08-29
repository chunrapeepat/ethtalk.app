import styled from "styled-components";
import Comment from "./components/Comment";
import { Divider } from "antd";

const Footer = styled.span`
  display: block;
  color: #555;
  font-weight: normal;
  font-size: 0.8rem;
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
      <div>Comment Writing</div>
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
