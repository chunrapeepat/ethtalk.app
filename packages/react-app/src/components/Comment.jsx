import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Popconfirm, Tooltip } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import Blockie from "./Blockie";
import Address from "./Address";
import useFirebaseAuth from "../hooks/FirebaseAuth";
import { doc, onSnapshot, updateDoc, deleteDoc } from "@firebase/firestore";
import { firestore } from "../utils/firebase";
import { hashURL } from "../utils/helper";
import CommentEditor from "./CommentEditor";

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  & > span {
    margin-left: 2px;
  }
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
const ActionContainer = styled.div`
  width: inherit;
  display: flex;

  & > div {
    margin-right: 10px;
  }

  & > div.action {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Comment = ({ children, id, authorPublicAddress, createdAt, data, commentURL }) => {
  const [likes, setLikes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
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
      if (snapshot.data()) {
        setLikes(snapshot.data().likes);
      }
    });
  }, []);

  const deleteComment = () => {
    const commentDocRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", id);
    deleteDoc(commentDocRef);
  };

  const actions = [
    <ActionContainer>
      <div>
        <Tooltip key="comment-like" title={publicAddress ? "Like" : "Sign in to like"}>
          <LikeButton onClick={like}>
            <div>{publicAddress && likes.includes(publicAddress) ? <LikeTwoTone /> : <LikeOutlined />}</div>
            <span>{likes.length}</span>
          </LikeButton>
        </Tooltip>
      </div>
      <div>0 replies</div>
      {publicAddress === authorPublicAddress && (
        <>
          <div className="action" onClick={() => setIsEdit(true)}>
            Edit
          </div>
          <Popconfirm
            title="Are you sure to delete this comment?"
            onConfirm={deleteComment}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <div className="action">Delete</div>
          </Popconfirm>
        </>
      )}
    </ActionContainer>,
  ];

  return (
    <CommentContainer>
      <AntdComment
        actions={!isEdit ? actions : undefined}
        author={<Address address={authorPublicAddress} />}
        avatar={
          <Avatar>
            <Blockie address={authorPublicAddress} size={9} />
          </Avatar>
        }
        content={
          // TODO: support latex and markdown
          <>
            {!isEdit && <p>{data}</p>}
            {isEdit && <CommentEditor commentURL={commentURL} defaultValue={data} />}
          </>
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
            <ReplyInput style={{ marginTop: -15 }} disabled={!publicAddress}>
              Add a comment...
            </ReplyInput>
          }
        />
      </AntdComment>
    </CommentContainer>
  );
};

export default Comment;
