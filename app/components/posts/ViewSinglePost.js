import React, { useState, useEffect, useContext } from "react";
import Page from "../public/Page";
import Axios from "axios";
import { useParams, Link, withRouter } from "react-router-dom";
import Loading from "../public/Loading";
import ReactMarkDown from "react-markdown";
import ReactTooltip from "react-tooltip";
import {
  StateContext,
  DispatchContext,
} from "../../store/global/ContextStore.js";
import NotFound from "../public/NotFound";
import { FLASH_MSG, LOADING, NOT_FOUND } from "../../store/global/action";

const ViewSinglePost = props => {
  const { loggedin, user, notFound, loading } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    globalDispatch({ type: LOADING, value: true });
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        globalDispatch({ type: LOADING, value: false });

        if (response.data) {
          setPost(response.data);
        } else {
          globalDispatch({ type: NOT_FOUND });
        }
      } catch (e) {
        console.warn("There Is Error OR Request Was Cancelled");
      }
    })(); // self invoked

    // we provide CleanUp funciton that used as (componentWillUnmount)
    /* if there is no cleanup function it will throw warning 
        if you enter this component and back to other component before axios request isn't complete 
        so if this is occured, so you till the browser
        if the axios request doesn't complete don't fail but cancel component request */

    return () => {
      ourRequest.cancel();
    };
  }, [id]); // Self Invoked

  if (loading)
    return (
      <Page title="...">
        <Loading />
      </Page>
    );

  if (notFound) return <NotFound />;

  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (loggedin) {
      return user.username === post.author?.username;
    }
    return false;
  };

  const handleDelete = async () => {
    const areYouSure = window.confirm("Are You Sure To Delete This Post ?");
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: user.token },
        });
        if (response.data === "Success") {
          globalDispatch({
            type: FLASH_MSG,
            value: "Your Post Deleted",
            msgType: "danger",
          });
          props.history.push(`/profile/${user.username}`);
        }
      } catch (e) {
        console.warn(e.response.data);
      }
    }
  };
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2 style={{ textTransform: "capitalize" }}>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <Link
              to={`/post/${id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <ReactTooltip id="delete" className="custom-tooltip" />{" "}
            <a
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i>
            </a>{" "}
          </span>
        )}
      </div>

      {post?.author && (
        <p className="text-muted small mb-4">
          <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar} />
          </Link>
          Posted by
          <Link to={`/profile/${post.author.username}`}>
            {" "}
            <span style={{ textTransform: "capitalize" }}>
              {post.author.username}{" "}
            </span>
          </Link>
          on {formattedDate}
        </p>
      )}

      <div className="body-content">
        {/* ReactMarkDown allow you to make simple text format depend on many symbols
         like (-, ., # ...etc) */}
        <ReactMarkDown
          children={post.body}
          allowedyTpes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        />
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
