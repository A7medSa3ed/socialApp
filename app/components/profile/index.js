import React, { useEffect, useContext, useState } from "react";
import {
  useParams,
  Redirect,
  NavLink,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import Axios from "axios";
import { StateContext, DispatchContext } from "../../store/global/ContextStore";
import Page from "../public/Page";
import ProfilePosts from "./ProfilePosts";
import Loading from "../public/Loading";
import { NOT_FOUND, FLASH_MSG } from "../../store/global/action";
import NotFound from "../public/NotFound";
import UserFollowers from "./UserFollowers";
import UserFollowing from "./UserFollowing";

const Profile = () => {
  const { username } = useParams();
  const { user, notFound, loggedin } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    followActionLoading: false,
    startFollowingReqCount: 0,
    stopFollowingReqCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  // Get Profile Data On Page Load
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: user.token,
          },
          { cancelToken: ourRequest.token }
        );
        setIsLoading(false);
        if (response.data) {
          setState({ ...state, profileData: response.data });
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
  }, [username]);

  // Start Follow Action
  useEffect(() => {
    if (state.startFollowingReqCount) {
      setState({ ...state, followActionLoading: true });
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            setState({
              ...state,
              followActionLoading: false,
              profileData: {
                ...state.profileData,
                isFollowing: true,
                counts: {
                  ...state.profileData.counts,
                  followerCount: state.profileData.counts.followerCount + 1,
                },
              },
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
  }, [state.startFollowingReqCount]);

  // Start UnFollow Action
  useEffect(() => {
    if (state.stopFollowingReqCount) {
      setState({ ...state, followActionLoading: true });
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            setState({
              ...state,
              followActionLoading: false,
              profileData: {
                ...state.profileData,
                isFollowing: false,
                counts: {
                  ...state.profileData.counts,
                  followerCount: state.profileData.counts.followerCount - 1,
                },
              },
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
  }, [state.stopFollowingReqCount]);

  if (isLoading)
    return (
      <Page title="...">
        <Loading />
      </Page>
    );

  if (notFound) return <NotFound />;

  if (!user.username) {
    globalDispatch({
      type: FLASH_MSG,
      value: "You Must Signin / Signup First",
      msgType: "danger",
    });
    return <Redirect to="/" />;
  }

  const handleFollow = () => {
    setState({
      ...state,
      startFollowingReqCount: state.startFollowingReqCount + 1,
    });
  };
  const handleUnfollow = () => {
    setState({
      ...state,
      stopFollowingReqCount: state.stopFollowingReqCount + 1,
    });
  };
  return (
    <Page title="Your Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}
        {loggedin &&
          !state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername && (
            <button
              onClick={handleFollow}
              className="btn btn-primary btn-sm ml-2"
              disabled={state.followActionLoading}
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {loggedin &&
          state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername && (
            <button
              onClick={handleUnfollow}
              className="btn btn-danger btn-sm ml-2"
              disabled={state.followActionLoading}
            >
              UnFollow <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <UserFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <UserFollowing />
        </Route>
      </Switch>
    </Page>
  );
};

export default withRouter(Profile);
