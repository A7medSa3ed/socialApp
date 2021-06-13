import React, { useState, useContext } from "react";
import Page from "../public/Page";
import Axios from "axios";
import { Redirect, withRouter, Link } from "react-router-dom";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";
import { FLASH_MSG } from "../../store/global/action";

const CreatePost = props => {
  const globalDispatch = useContext(DispatchContext);
  const { user } = useContext(StateContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: user.token,
      });
      setTitle("");
      setBody("");
      globalDispatch({
        type: FLASH_MSG,
        value: "Your Post Is Published",
        msgType: "success",
      });
      props.history.push(`/post/${response.data}`);
    } catch (e) {
      console.warn("There Is Error OR Request Was Cancelled");
    }
  };
  if (!user.username) {
    globalDispatch({
      type: FLASH_MSG,
      value: "You Must Signin / Signup First",
      msgType: "danger",
    });
    return <Redirect to="/" />;
  }

  return (
    <Page title="Create Post">
      <Link className="small font-weight-bold" to="/">
        &laquo;Back To Home
      </Link>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={body}
            onChange={e => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default withRouter(CreatePost);
