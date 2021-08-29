import React, { useState } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Tooltip, Avatar, Divider } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined, MinusOutlined } from "@ant-design/icons";

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  margin-right: 7px;
  cursor: pointer;
  & > span {
    margin-left: 2px;
  }
`;
const TotalReply = styled.div`
  font-style: italic;
`;
const CommentContainer = styled.div`
  border-radius: 5px;
  border: 1px solid #ddd;
  background: white;
  padding: 0 7px;
  padding-right: 12px;
  margin-bottom: 12px;
`;
const ReplyInput = styled.div`
  width: 100%;
  border: 0;
  outline: none;
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  color: #999;
  background-color: #fafafa;

  &:hover {
    background-color: white;
  }

  ${props =>
    props.disabled
      ? `
    cursor: not-allowed;
  `
      : ""}
  }
`;

const Comment = ({ children }) => {
  const [likes, setLikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setAction("liked");
  };

  const actions = [
    <Tooltip key="comment-like" title="Like">
      <LikeButton onClick={like}>
        <div>{action === "liked" ? <LikeTwoTone /> : <LikeOutlined />}</div>
        <span>{likes}</span>
      </LikeButton>
    </Tooltip>,
    <TotalReply>0 repiles</TotalReply>,
  ];

  return (
    <CommentContainer>
      <AntdComment
        actions={actions}
        author={
          <a href="https://app.ens.domains/name/thechun.eth" target="_blank">
            0x79A3...0c4d
          </a>
        }
        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />}
        content={
          <p>
            We supply a series of design principles, practical patterns and high quality design resources (Sketch and
            Axure), to help people create their product prototypes beautifully and efficiently.
          </p>
        }
        datetime={
          <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
      >
        {children}
        <AntdComment
          content={
            // TODO: If reply > 0; remove marginTop
            <ReplyInput style={{ marginTop: -15 }} disabled={true}>
              Add a comment...
            </ReplyInput>
          }
        />
      </AntdComment>
    </CommentContainer>
  );
};

export default Comment;
