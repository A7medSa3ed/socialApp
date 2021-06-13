import React, { useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";
import {
  FLASH_MSG,
  LOGGED_OUT,
  OPEN_SEARCH,
  TOGGLE_CHAT,
} from "../../store/global/action";
import ReactTooltip from "react-tooltip";

const HeaderLoggedIn = props => {
  const globalDispatch = useContext(DispatchContext);
  const { loggedin, user, unReadChatMsg } = useContext(StateContext);

  useEffect(() => {
    if (loggedin) {
      document.getElementById("icon").href = user.avatar;
    }
  }, [loggedin]);

  const handleLoggout = () => {
    globalDispatch({ type: LOGGED_OUT });
    props.history.push("/");
    globalDispatch({
      type: FLASH_MSG,
      value: "You Logged Out",
      msgType: "danger",
    });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={() => globalDispatch({ type: OPEN_SEARCH })}
        href="#"
        className="text-white mr-2 header-search-icon"
        data-tip="Search"
        data-for="search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip id="search" place="bottom" className=" custom-tooltip" />{" "}
      <span
        className={
          "mr-2 header-chat-icon " +
          (unReadChatMsg ? "text-danger" : "text-white")
        }
        data-tip="Chat"
        data-for="chat"
        onClick={() => globalDispatch({ type: TOGGLE_CHAT })}
      >
        <i className="fas fa-comment" style={{ fontSize: "20px" }}></i>
        {unReadChatMsg ? (
          <span className="chat-count-badge text-white" style={{ left: "3px" }}>
            {unReadChatMsg < 10 ? unReadChatMsg : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip id="chat" place="bottom" className=" custom-tooltip" />{" "}
      <Link
        to={`/profile/${user.username}`}
        className="mr-2"
        data-tip={user.username}
        data-for="userImg"
      >
        <img className="small-header-avatar" src={user.avatar} />
      </Link>{" "}
      <ReactTooltip id="userImg" place="bottom" className=" custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={handleLoggout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default withRouter(HeaderLoggedIn);
