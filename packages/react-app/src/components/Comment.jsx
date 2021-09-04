import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Comment as AntdComment, Popconfirm, Tooltip } from "antd";
import moment from "moment";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import Blockie from "./Blockie";
import Address from "./Address";
import useFirebaseAuth from "../hooks/FirebaseAuth";
import { doc, addDoc, onSnapshot, updateDoc, deleteDoc, collection, query, orderBy } from "@firebase/firestore";
import { firestore } from "../utils/firebase";
import { hashURL } from "../utils/helper";
import CommentEditor from "./CommentEditor";
import { Button, OutlineButton } from "./Button";
import Reply from "./Reply";
import MathJax from "react-mathjax2";

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
  padding: 0 12px;
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
const PanelContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Comment = ({ id, authorPublicAddress, createdAt, data, commentURL }) => {
  const [likes, setLikes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [editedValue, setEditedValue] = useState(data);
  const [replyError, setReplyError] = useState();
  const { publicAddress } = useFirebaseAuth();
  const [replies, setReplies] = useState([]);

  // load all replies
  useEffect(() => {
    const replyCollectionRef = collection(firestore, "comment-boxes", hashURL(commentURL), "comments", id, "replies");
    const q = query(replyCollectionRef, orderBy("createdAt", "asc"));

    onSnapshot(q, snapshot => {
      setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

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
            const commentDocRef = doc(firestore, "comment-boxes", hashURL(commentURL), "comments", id);
            await updateDoc(commentDocRef, {
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

  const replyEditorFooter = (
    <>
      <PanelContainer>
        <OutlineButton
          white
          onClick={() => {
            setReplyValue("");
            setIsReply(false);
            setReplyError("");
          }}
          style={{ marginRight: 5 }}
        >
          Cancel
        </OutlineButton>
        <Button
          onClick={async () => {
            setReplyError("");

            if (!replyValue.trim()) return;
            if (replyValue.length > 2000) {
              setReplyError("character limit exceeded (maximum: 2000 characters)");
              return;
            }

            try {
              const replyRef = collection(firestore, "comment-boxes", hashURL(commentURL), "comments", id, "replies");
              await addDoc(replyRef, {
                data: replyValue.trim(),
                likes: [],
                authorPublicAddress: publicAddress,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              setReplyValue("");
              setIsReply(false);
            } catch (e) {
              setReplyError(e.message);
            }
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
      <div>{replies.length} replies</div>
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
      >
        {replies.length === 0 && <div style={{ display: "inline-block", marginTop: 25 }}></div>}
        {replies.map((reply, i) => {
          return <Reply commentId={id} commentURL={commentURL} {...reply} key={`reply_${id}_${i}`} />;
        })}
        {isReply && (
          <div style={{ marginTop: replies.length === 0 ? -30 : 15, marginBottom: 15 }}>
            <CommentEditor
              error={replyError}
              placeholder="Write a reply..."
              value={replyValue}
              onChange={setReplyValue}
              footer={replyEditorFooter}
            />
          </div>
        )}
        {!isReply && (
          <ReplyInput
            style={{ marginTop: replies.length === 0 ? -30 : 15, marginBottom: 15 }}
            disabled={!publicAddress}
            onClick={() => {
              if (publicAddress) {
                setIsReply(true);
              }
            }}
          >
            Write a reply...
          </ReplyInput>
        )}
      </AntdComment>
    </CommentContainer>
  );
};

export default Comment;
