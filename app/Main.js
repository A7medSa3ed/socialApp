import React, { useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

// Our Store
import { StateContext, DispatchContext } from "./store/global/ContextStore";
import { reducer, initState } from "./store/global/reducer";
import { FLASH_MSG, LOGGED_OUT } from "./store/global/action";

// Components
import Header from "./components/header";
import Footer from "./components/footer";
import About from "./components/footer/About";
import Terms from "./components/footer/Terms";
import Home from "./components/home";
import HomeGuest from "./components/home/HomeGuest";
import CreatePost from "./components/posts/CreatePost";
import ViewSinglePost from "./components/posts/ViewSinglePost";
import EditPost from "./components/posts/EditPost";
import Profile from "./components/profile";
import Chat from "./components/chat";
import FlashMsg from "./components/public/FlashMsg";
import NotFound from "./components/public/NotFound";
import Search_Box from "./components/public/Search_Box";

// to avoid write this url evry get/post request
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://socialappbackendserver.herokuapp.com/";

function Main() {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (state.loggedin) {
      localStorage.setItem("socialAppToken", state.user.token);
      localStorage.setItem("socialAppUsername", state.user.username);
      localStorage.setItem("socialAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("socialAppToken");
      localStorage.removeItem("socialAppUsername");
      localStorage.removeItem("socialAppAvatar");
    }
  }, [state.loggedin]);

  // Check If the Token Is Expired Or Not
  useEffect(() => {
    if (state.loggedin) {
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            "/checkToken",
            {
              token: state.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: LOGGED_OUT });
            dispatch({
              type: FLASH_MSG,
              value: "Your Session Is Expired, Please Loggin Again",
              msgType: "danger",
            });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // Self Invoked
    }
  }, []);
  return (
    /* we make isolated context for state and dispatch
       because if there is component doesn't need to change it's state
       and want to access to dispatch only so
       it doesn't need to rerender if state is changes in another component
       so we avoid this by this way */

    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMsg />
          <Header />
          <Switch>
            <Route exact path="/">
              {state.loggedin ? <Home /> : <HomeGuest />}
            </Route>
            <Route exact path="/create-post">
              <CreatePost />
            </Route>
            <Route exact path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route exact path="/post/:id/edit">
              <EditPost />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route exact path="/about-us">
              <About />
            </Route>
            <Route exact path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            timeout={330}
            in={state.searchOpen} // if this is true, it will appear it's componenent <Search_Box/>
            unmountOnExit // if (in) is false, it will run this and unmount <Search_Box/>
            classNames="search-overlay"
          >
            <Search_Box />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

// this condition is used to tell browser if there is any change, make a hot reload
if (module.hot) {
  module.hot.accept();
}
