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
        <Footer>{footer}</Footer>
      </Container>
    </>
  );
};

export default CommentEditor;
