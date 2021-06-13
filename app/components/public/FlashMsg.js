import React, { useContext } from "react";
import { StateContext } from "../../store/global/ContextStore";

const FlashMsg = () => {
  const { flashMsg, flashMsgType } = useContext(StateContext);

  return (
    <div className="floating-alerts">
      {flashMsg.map((msg, index) => (
        <div
          key={index}
          className={
            "alert " +
            (flashMsgType === "success" ? "alert-success" : "alert-danger") +
            " text-center floating-alert shadow-sm"
          }
        >
          {msg}
        </div>
      ))}
    </div>
  );
};

export default FlashMsg;
