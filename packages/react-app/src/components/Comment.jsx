import React, { createElement, useState } from "react";
import { Comment as AntdComment, Tooltip, Avatar } from "antd";
import moment from "moment";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from "@ant-design/icons";

const Comment = ({ children }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(action === "disliked" ? DislikeFilled : DislikeOutlined)}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-repjkly-to">3 repiles</span>,
  ];

  return (
    <AntdComment
      actions={actions}
      author={<a>thechun.eth</a>}
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

export default Comment;
