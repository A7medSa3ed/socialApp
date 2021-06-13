import React, { useContext, useRef, useEffect, useState } from "react";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";
import {
  CLOSE_CHAT,
  CLEAR_UNREADED_MESSAGES_COUNT,
  INCREMENT_UNREAD_MSG,
} from "../../store/global/action";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const index = () => {
  const socket = useRef(null);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const { user, isChatOpen } = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [fieldValue, setFieldValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // focus on chat inut field on click on chat icon
  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus();
      globalDispatch({ type: CLEAR_UNREADED_MESSAGES_COUNT });
    }
  }, [isChatOpen]);

  // make chat log scroll to last message
  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (chatMessages.length && !isChatOpen) {
      globalDispatch({ type: INCREMENT_UNREAD_MSG });
    }
  }, [chatMessages.length]);

  // Start Send Chat
  useEffect(() => {
    socket.current = io(
      process.env.BACKENDURL || "https://socialappbackendserver.herokuapp.com/"
    );
    socket.current.on("chatFromServer", message => {
      setChatMessages(prev => [...prev, message]);
    });
    return () => socket.current.disconnect();
  }, []);

  const handleChange = e => {
    const { value } = e.target;
    setFieldValue(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    socket.current.emit("chatFromBrowser", {
      message: fieldValue,
      token: user.token,
    });
    if (fieldValue.trim() !== "") {
      setChatMessages(prev => [
        ...prev,
        {
          message: fieldValue,
          username: user.username,
          avatar: user.avatar,
        },
      ]);
      setFieldValue("");
    }
  };
  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper " +
        (isChatOpen ? "chat-wrapper--is-visible" : "") +
        " shadow border-top border-left border-right"
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => globalDispatch({ type: CLOSE_CHAT })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>

      <div ref={chatLog} id="chat" className="chat-log">
        {chatMessages.map((message, index) => {
          if (message.username == user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          onChange={handleChange}
          value={fieldValue}
        />
      </form>
    </div>
  );
};

export default index;
