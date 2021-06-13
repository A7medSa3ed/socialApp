import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loading from "../public/Loading";
import { LOADING } from "../../store/global/action";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";

const UserFollowing = () => {
  const { loading } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    globalDispatch({ type: LOADING, value: true });
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, {
          cancelToken: ourRequest.token,
        });
        globalDispatch({ type: LOADING, value: false });
        setFollowing(response.data);
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
      {following.map((following, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${following.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={following.avatar} />
            {following.username}
          </Link>
        );
      })}
    </div>
  );
};

export default UserFollowing;
