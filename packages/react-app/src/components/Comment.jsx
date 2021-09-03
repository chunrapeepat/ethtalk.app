import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Tooltip } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import Blockie from "./Blockie";
import Address from "./Address";
import useFirebaseAuth from "../hooks/FirebaseAuth";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { firestore } from "../utils/firebase";
import { hashURL } from "../utils/helper";

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

const Comment = ({ children, id, authorPublicAddress, createdAt, data, commentURL }) => {
  const [likes, setLikes] = useState([]);
  const { publicAddress } = useFirebaseAuth();

  const like = async () => {
    if (!publicAddress) return;

    const prevLikes = likes;
    let _likes = likes;
    if (likes.includes(publicAddress)) {
      _likes.splice(_likes.indexOf(publicAddress), 1);
    } else {
      _likes = [...likes, publicAddress];
    }
    setLikes(_likes);

    try {
      const commentDocRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", id);
      await updateDoc(commentDocRef, {
        likes: _likes,
        updatedAt: new Date(),
      });
    } catch (e) {
      setLikes(prevLikes);
    }
  };

  useEffect(() => {
    const commentDocRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", id);
    onSnapshot(commentDocRef, snapshot => {
      setLikes(snapshot.data().likes);
    });
  }, []);

  const actions = [
    <Tooltip key="comment-like" title={publicAddress ? "Like" : "Sign in to like"}>
      <LikeButton onClick={like}>
        <div>{publicAddress && likes.includes(publicAddress) ? <LikeTwoTone /> : <LikeOutlined />}</div>
        <span>{likes.length}</span>
      </LikeButton>
    </Tooltip>,
    <TotalReply>0 repiles</TotalReply>,
  ];

  return (
    <CommentContainer>
      <AntdComment
        actions={actions}
        author={<Address address={authorPublicAddress} />}
        avatar={
          <Avatar>
            <Blockie address={authorPublicAddress} size={9} />
          </Avatar>
        }
        content={
          // TODO: support latex and markdown
          <p>{data}</p>
        }
        datetime={
          <Tooltip title={moment(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment(createdAt.toDate()).fromNow()}</span>
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
