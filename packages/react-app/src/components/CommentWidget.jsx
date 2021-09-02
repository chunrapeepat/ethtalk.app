import styled from "styled-components";
import { Comment, Reply, CommentEditor } from "./index";
import { Divider } from "antd";

const CommentWidget = () => {
  return (
    <>
      <h3>26 comments</h3>
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
    </>
  );
};

export default CommentWidget;
