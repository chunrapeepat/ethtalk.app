import styled from "styled-components";
import { CommentWidget } from "./components";
import { useLocation } from "react-router";

const Footer = styled.span`
  display: block;
  color: #555;
  font-weight: normal;
  font-size: 0.8rem;
  margin-top: 12px;
`;

const EmbedPage = () => {
  const search = useLocation().search;
  const url = new URLSearchParams(search).get("url");

  if (!url) {
    return <span>Error: no url specified</span>;
  }

  return (
    <>
      <CommentWidget commentURL={url} />
      <Footer>
        Powered by{" "}
        <a href="https://ethtalk.app" target="_blank">
          ETHTalk
        </a>
      </Footer>
    </>
  );
};

export default EmbedPage;
