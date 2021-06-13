import React, { useEffect, useReducer, useContext } from "react";
import Page from "../public/Page";
import Axios from "axios";
import { Link, useParams, withRouter } from "react-router-dom";
import { initialState, reducer } from "../../store/editPost/reducer";
import {
  DATA_FETCHED,
  TITLE_CHANGE,
  BODY_CHANGE,
  SUBMIT_REQUEST,
  REQUEST_STARTED,
  REQUEST_FINISHED,
  TITLE_RULES,
  BODY_RULES,
} from "../../store/editPost/action";

import { StateContext, DispatchContext } from "../../store/global/ContextStore";
import { FLASH_MSG, NOT_FOUND } from "../../store/global/action";
import Loading from "../public/Loading";
import NotFound from "../public/NotFound";

const EditPost = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, notFound } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const { id } = useParams();

  // Fetch Post Data On Page Load
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        if (response.data) {
          dispatch({ type: DATA_FETCHED, value: response.data });
          if (user.username != response.data.author.username) {
            globalDispatch({
              type: FLASH_MSG,
              value: "You Don't Authorized To Edit This Post",
            });
            props.history.push("/");
          }
        } else {
          globalDispatch({ type: NOT_FOUND });
        }
      } catch (e) {
        console.warn("There Is Error OR Request Was Cancelled");
      }
    })(); // self invoked

    return () => {
      ourRequest.cancel();
    };
  }, []);

  // Update Post Every Time You Click On Submit Button
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: REQUEST_STARTED });
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            `/post/${id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          if (response.data) {
            dispatch({ type: REQUEST_FINISHED });
            props.history.push(`/post/${id}`);
            globalDispatch({
              type: FLASH_MSG,
              value: "Post Updated Successfully",
              msgType: "success",
            });
          } else {
            globalDispatch({ type: NOT_FOUND });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // self invoked

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: TITLE_RULES, value: state.title.value });
    dispatch({ type: BODY_RULES, value: state.body.value });
    dispatch({ type: SUBMIT_REQUEST });
  };

  if (notFound && state.isFetching) {
    return <NotFound />;
  } else if (state.isFetching) {
    return (
      <Page title="...">
        <Loading />
      </Page>
    );
  }
  return (
    <Page title="Create Post">
      <Link className="small font-weight-bold" to={`/post/${id}`}>
        &laquo;Back To Post Page
      </Link>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.errorMsg}
            </div>
          )}
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={e =>
              dispatch({ type: TITLE_CHANGE, value: e.target.value })
            }
            onBlur={e => dispatch({ type: TITLE_RULES, value: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.errorMsg}
            </div>
          )}
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={e =>
              dispatch({ type: BODY_CHANGE, value: e.target.value })
            }
            onBlur={e => dispatch({ type: BODY_RULES, value: e.target.value })}
          />
        </div>

        <button className="btn btn-primary" disabled={state.isUpdating}>
          Update Post
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
