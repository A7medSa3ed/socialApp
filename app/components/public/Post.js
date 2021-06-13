import React from "react";
import { Link } from "react-router-dom";
const Post = ({ post, handleClose, noAuthor }) => {
  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
      onClick={handleClose}
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && (
          <>
            by{" "}
            <span style={{ textTransform: "capitalize" }}>
              {post.author.username}
            </span>{" "}
          </>
        )}
        on {formattedDate}
      </span>
    </Link>
  );
};

export default Post;
