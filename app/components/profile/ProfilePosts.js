import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loading from "../public/Loading";
import { LOADING } from "../../store/global/action";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";
import Post from "../public/Post";

const ProfilePosts = () => {
  const { loading } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    globalDispatch({ type: LOADING, value: true });
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        globalDispatch({ type: LOADING, value: false });
        setPosts(response.data);
      } catch (e) {
        console.warn("There Is Error OR Request Was Cancelled");
      }
    })(); // self invoked
    return () => {
      ourRequest.cancel();
    };
  }, [username]);
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="list-group">
      {posts.map(post => (
        <Post post={post} key={post._id} noAuthor={true} />
      ))}
    </div>
  );
};

export default ProfilePosts;
