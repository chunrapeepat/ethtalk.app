import React, { useState } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Tooltip } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import Blockie from "./Blockie";
import Address from "./Address";

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
const Avatar = styled.div`
  & canvas {
    border-radius: 5px;
  }
`;

const Comment = (props, { children }) => {
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
        author={<Address address={props.authorPublicAddress} />}
        avatar={
          <Avatar>
            <Blockie address={props.authorPublicAddress} size={9} />
          </Avatar>
        }
        content={
          // TODO: support latex and markdown
          <p>{props.data}</p>
        }
        datetime={
          <Tooltip title={moment(props.createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment(props.createdAt.toDate()).fromNow()}</span>
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
