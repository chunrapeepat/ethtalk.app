import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Tooltip, Popconfirm } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import Address from "./Address";
import Blockie from "./Blockie";
import useFirebaseAuth from "../hooks/FirebaseAuth";
import { doc, onSnapshot, updateDoc, deleteDoc } from "@firebase/firestore";
import { firestore } from "../utils/firebase";
import { hashURL } from "../utils/helper";
import { OutlineButton, Button } from "./Button";
import CommentEditor from "./CommentEditor";
import MathJax from "react-mathjax2";

const PanelContainer = styled.div`
  display: flex;
  align-items: center;
`;
const LikeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  & > span {
    margin-left: 2px;
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

const Reply = ({ commentId, id, authorPublicAddress, createdAt, data, commentURL }) => {
  const [likes, setLikes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editedValue, setEditedValue] = useState(data);
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
      const replyRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", commentId, "replies", id);
      await updateDoc(replyRef, {
        likes: _likes,
        updatedAt: new Date(),
      });
    } catch (e) {
      setLikes(prevLikes);
    }
  };

  useEffect(() => {
    const replyRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", commentId, "replies", id);
    onSnapshot(replyRef, snapshot => {
      if (snapshot.data()) {
        setLikes(snapshot.data().likes);
      }
    });
  }, []);

  const deleteReply = () => {
    const replyRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", commentId, "replies", id);
    deleteDoc(replyRef);
  };

  const editEditorFooter = (
    <>
      <PanelContainer>
        <OutlineButton
          white
          onClick={() => {
            setEditedValue(data);
            setIsEdit(false);
          }}
          style={{ marginRight: 5 }}
        >
          Cancel
        </OutlineButton>
        <Button
          onClick={async () => {
            const replyRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", commentId, "replies", id);
            await updateDoc(replyRef, {
              data: editedValue,
            });
            setIsEdit(false);
          }}
        >
          Update
        </Button>
      </PanelContainer>
    </>
  );

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
      {publicAddress === authorPublicAddress && (
        <>
          <div className="action" onClick={() => setIsEdit(true)}>
            Edit
          </div>
          <Popconfirm
            title="Are you sure to delete this comment?"
            onConfirm={deleteReply}
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
    <AntdComment
      actions={actions}
      author={<Address address={authorPublicAddress} />}
      avatar={
        <Avatar>
          <Blockie address={authorPublicAddress} size={9} />
        </Avatar>
      }
      content={
        <>
          {!isEdit && (
            <p>
              <MathJax.Context
                input="ascii"
                onLoad={() => console.log("Loaded MathJax script!")}
                onError={(MathJax, error) => {
                  console.warn(error);
                  console.log("Encountered a MathJax error, re-attempting a typeset!");
                  MathJax.Hub.Queue(MathJax.Hub.Typeset());
                }}
                script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
                options={{
                  asciimath2jax: {
                    useMathMLspacing: true,
                    delimiters: [["$$", "$$"]],
                    preview: "none",
                  },
                }}
              >
                <MathJax.Text text={data} />
              </MathJax.Context>
            </p>
          )}
          {isEdit && <CommentEditor value={editedValue} onChange={setEditedValue} footer={editEditorFooter} />}
        </>
      }
      datetime={
        <Tooltip title={moment(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(createdAt.toDate()).fromNow()}</span>
        </Tooltip>
      }
    ></AntdComment>
  );
};

export default Reply;
