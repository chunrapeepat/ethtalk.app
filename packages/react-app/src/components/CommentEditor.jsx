import styled from "styled-components";
import { Alert } from "antd";

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
  resize: none;

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
const Error = styled.div`
  margin-bottom: 7px;
`;
const Support = styled.a`
  color: #555;
  font-size: 0.8rem;

  &:hover {
    color: #555;
    text-decoration: underline;
  }
`;

const CommentEditor = ({ value, onChange, placeholder, footer, error, loading }) => {
  return (
    <>
      {error && (
        <Error>
          <Alert message={`Error: ${error}`} type="error" />
        </Error>
      )}
      <Container>
        <TextArea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={2000}
          disabled={loading}
        />
        <Footer>
          <Support
            target="_blank"
            href="https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference"
          >
            LaTex is supported
          </Support>
          {footer}
        </Footer>
      </Container>
    </>
  );
};

export default CommentEditor;
