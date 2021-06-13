import React, { useContext, useReducer, useEffect } from "react";
import Page from "../public/Page";
import Axios from "axios";
import { FLASH_MSG } from "../../store/global/action";
import { DispatchContext } from "../../store/global/ContextStore";
import { reducer, initialState } from "../../store/registeration/reducer";
import {
  HANDLE_USERNAME_CHANGE,
  HANDLE_PASSWORD_CHANGE,
  HANDLE_EMAIL_CHANGE,
  DELAY_USERNAME,
  UNIQUE_USERNAME_RESULTS,
  DELAY_EMAIL,
  UNIQUE_EMAIL_RESULTS,
  DELAY_PASSWORD,
  SUBMIT_FORM,
} from "../../store/registeration/action";
import { CSSTransition } from "react-transition-group";
import { LOGGED_IN } from "../../store/global/action";

const HomeGuest = () => {
  const globalDispatch = useContext(DispatchContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  // This is responsible for delay error message till the user finish
  /* for example here, if he write 1 letter, useEffect will wait 800ms and show the error msg 
     but if he write any thing before this time it will reset timer and calculate again
     until he reach 3 letter or more */
  // this for username
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: DELAY_USERNAME });
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  // this for email
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: DELAY_EMAIL });
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  // this for password
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: DELAY_PASSWORD });
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  // after username.checkCount changed, this will be run
  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            "/doesUsernameExist",
            {
              username: state.username.value,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            dispatch({ type: UNIQUE_USERNAME_RESULTS, value: response.data });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // Self Invoked
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.username.checkCount]);

  // after email.checkCount changed, this will be run
  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            "/doesEmailExist",
            {
              email: state.email.value,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            dispatch({
              type: UNIQUE_EMAIL_RESULTS,
              value: response.data,
            });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // Self Invoked
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            globalDispatch({
              type: LOGGED_IN,
              value: response.data,
            });
            globalDispatch({
              type: FLASH_MSG,
              value: "Your Account Created Successfully, Please Sign In",
              msgType: "success",
            });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // Self Invoked
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.submitCount]);

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch({ type: HANDLE_USERNAME_CHANGE, value: state.username.value });
    dispatch({ type: HANDLE_EMAIL_CHANGE, value: state.email.value });
    dispatch({ type: HANDLE_PASSWORD_CHANGE, value: state.password.value });
    dispatch({
      type: DELAY_USERNAME,
      value: state.username.value,
      noRequest: true,
    });
    dispatch({ type: DELAY_EMAIL, value: state.email.value, noRequest: true });
    dispatch({ type: DELAY_PASSWORD, value: state.password.value });
    dispatch({ type: SUBMIT_FORM });
  };
  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                value={state.username.value}
                onChange={e =>
                  dispatch({
                    type: HANDLE_USERNAME_CHANGE,
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.msg}
                </div>
              </CSSTransition>
            </div>

            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                value={state.email.value}
                onChange={e =>
                  dispatch({
                    type: HANDLE_EMAIL_CHANGE,
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.email.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.msg}
                </div>
              </CSSTransition>
            </div>

            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                value={state.password.value}
                placeholder="Create a password"
                onChange={e =>
                  dispatch({
                    type: HANDLE_PASSWORD_CHANGE,
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.msg}
                </div>
              </CSSTransition>
            </div>

            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for Social App
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
