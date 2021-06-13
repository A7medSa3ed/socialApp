import React, { useState, useContext, useEffect } from "react";
import { DispatchContext } from "../../store/global/ContextStore";
import { CLOSE_SEARCH } from "../../store/global/action";
import Axios from "axios";
import Post from "./Post";
const Search_Box = () => {
  const [state, setState] = useState({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });
  const globalDispatch = useContext(DispatchContext);

  // this will run every time searchTerm will change
  // but setTimeout() will make it run every 2 sec
  /* when useEffect will run again due to searchTerm change, 
    cleanup function will run first and remove previous call and start again */
  /* so, when (searchTerm) is changed it will wait 2 sec then make increase requestCount,
      after the first 2 sec, if there is change on searchTerm it will run cleanup funciton
      and repeat this process again  */
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState({ ...state, show: "loading" });
    }
    const delay = setTimeout(() => {
      state.searchTerm.trim() &&
        setState({ ...state, requestCount: state.requestCount + 1 });
    }, 750);
    return () => {
      clearTimeout(delay);
    };
  }, [state.searchTerm]);

  // after requestCount changed, this will be run
  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      (async function fetchData() {
        try {
          const response = await Axios.post(
            "/search",
            {
              searchTerm: state.searchTerm,
            },
            { cancelToken: ourRequest.token }
          );
          if (response.data) {
            setState({ ...state, results: response.data, show: "results" });
          }
        } catch (e) {
          console.warn("There Is Error OR Request Was Cancelled");
        }
      })(); // Self Invoked
    }
  }, [state.requestCount]);

  const handleChange = e => {
    const { value } = e.target;

    value.trim() !== "" && setState({ ...state, searchTerm: value });
  };

  // enable Esc key to close search box
  useEffect(() => {
    document.addEventListener("keyup", handleExit);
    return () => document.removeEventListener("keyup", handleExit);
  }, []);

  // this function work when componentWillUnmount (cleanup function in useEffect)
  // it's used to close search box when press on Esc button
  const handleExit = e => {
    if (e.keyCode === 27) {
      globalDispatch({ type: CLOSE_SEARCH });
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>

          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleChange}
          />
          <span
            onClick={() => globalDispatch({ type: CLOSE_SEARCH })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            {state.results.length === 0 ? (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry, We Couldn't Find Any Result For That Search.
              </p>
            ) : (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map(post => (
                  <Post
                    post={post}
                    key={post._id}
                    handleClose={() => globalDispatch({ type: CLOSE_SEARCH })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search_Box;
