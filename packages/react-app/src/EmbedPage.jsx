import styled from "styled-components";
import { CommentWidget } from "./components";

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
      <CommentWidget />
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
