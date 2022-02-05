import { useEffect } from "react";
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

  useEffect(() => {
    setInterval(() => {
      const height = document.documentElement.scrollHeight;
      parent.postMessage(`height:${height}`, "*");
    }, 500);
  }, []);

  if (!url) {
    return <span>Error: no url specified</span>;
  }

  return (
    <>
      <CommentWidget commentURL={url} />
      <Footer>
        Powered by{" "}
        <a href={`${process.env.NODE_ENV === "development"?"http":"https"}://${document.domain}`} target="_blank">
          ETHTalk
        </a>
      </Footer>
    </>
  );
};

export default EmbedPage;
