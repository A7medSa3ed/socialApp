import React, { useState, useContext, useRef, useEffect } from "react";
import Axios from "axios";
import { DispatchContext, StateContext } from "../../store/global/ContextStore";
import { FLASH_MSG, LOGGED_IN } from "../../store/global/action";

const HeaderLoggedOut = () => {
  const globalDispatch = useContext(DispatchContext);
  const { loggedin } = useContext(StateContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const name = useRef(null);
  const pass = useRef(null);

  useEffect(() => {
    if (!loggedin) {
      document.getElementById("icon").href =
        "https://lh3.googleusercontent.com/Zw2GEfEad4kQ-ILZpmB7Z36NSV_vQPlnV7dG9QL4CCzsk_podpHQI8j1frgRpyzBqog";
    }
  }, [loggedin]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (username.trim() !== "" && password.trim() !== "") {
      try {
        const response = await Axios.post("/login", {
          username,
          password,
        });
        setUsername("");
        setPassword("");
        if (response.data) {
          globalDispatch({ type: LOGGED_IN, value: response.data });
          globalDispatch({
            type: FLASH_MSG,
            value: "You Logged In Successfully",
            msgType: "success",
          });
        } else {
          console.log("Incorrect Username / password");
          globalDispatch({
            type: FLASH_MSG,
            value: "Incorrect Username / password",
            msgType: "danger",
          });
          name.current.classList.remove("is-invalid");
          pass.current.classList.remove("is-invalid");
        }
      } catch (e) {
        console.warn("There Is Error OR Request Was Cancelled");
      }
    } else {
      username === "" && (name.current.classList += " is-invalid ");
      password === "" && (pass.current.classList += " is-invalid ");
    }
  };
  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            ref={name}
            className={"form-control form-control-sm input-dark "}
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={e => {
              if (e.target.value.trim() === "") {
                name.current.classList += " is-invalid ";
                setUsername("");
              } else {
                name.current.classList.remove("is-invalid");
                setUsername(e.target.value);
              }
            }}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            ref={pass}
            className={"form-control form-control-sm input-dark "}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              if (e.target.value.trim() === "") {
                pass.current.classList += " is-invalid ";
                setPassword("");
              } else {
                pass.current.classList.remove("is-invalid");
                setPassword(e.target.value);
              }
            }}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
