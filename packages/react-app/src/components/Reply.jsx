import React, { useState } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Tooltip, Avatar } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  margin-right: 7px;
  cursor: pointer;
  & > span {
    margin-left: 2px;
  }
`;

const Reply = ({ children }) => {
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
  ];

  return (
    <AntdComment
      actions={actions}
      author={
        <Tooltip title="0x79A375feFbF90878502eADBA4A89697896B60c4d">
          <a href="https://app.ens.domains/name/thechun.eth" target="_blank">
            0x79A3...0c4d
          </a>
        </Tooltip>
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
    </AntdComment>
  );
};

export default Reply;
