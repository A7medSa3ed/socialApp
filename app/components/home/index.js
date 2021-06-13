import React, { useContext, useState, useEffect } from "react";
import Page from "../public/Page";
import { StateContext } from "../../store/global/ContextStore";
import Loading from "../public/Loading";
import Axios from "axios";
import Post from "../public/Post";
const Home = () => {
  const { user } = useContext(StateContext);
  const [state, setState] = useState({ isLoading: true, feed: [] });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.post(
          "/getHomeFeed",
          {
            token: user.token,
          },
          { cancelToken: ourRequest.token }
        );
        if (response.data) {
          setState({ ...state, isLoading: false, feed: response.data });
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
  }, [user.username]);

  if (state.isLoading) return <Loading />;

  return (
    <Page title="Your Feed">
      {state.feed.length === 0 ? (
        <>
          <h2 className="text-center">
            Hello{" "}
            <strong style={{ textTransform: "capitalize" }}>
              {user.username}
            </strong>
            , your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-center mb-4">
            The Latest From Those You Are Follow
          </h2>
          <div className="list-group">
            {state.feed.map(post => (
              <Post post={post} key={post._id} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
};

export default Home;
