import { useState, useEffect } from "react";
import { Divider } from "antd";
import { collection, query, orderBy, onSnapshot } from "@firebase/firestore";
import { Comment, CommentEditor } from "./index";
import { hashURL } from "../utils/helper";
import { firestore } from "../utils/firebase";

const commentURL = "https://ethtalk.app";

const CommentWidget = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentCollectionRef = collection(firestore, "comment-boxes", hashURL(commentURL), "comments");
    const q = query(commentCollectionRef, orderBy("createdAt", "asc"));

    onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <>
      <h3>{comments.length} comments</h3>
      <div style={{ marginTop: 24 }}>
        {comments.map((comment, i) => {
          return <Comment {...comment} key={`comment_${i}`} />;
        })}
      </div>
      <Divider />
      <CommentEditor commentURL={commentURL} />
    </>
  );
};

export default CommentWidget;
