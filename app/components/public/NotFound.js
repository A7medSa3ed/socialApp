import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="post Not Found">
      <div className="text-center">
        <h2>Whoops, We Cannot FInd That Page,</h2>
        <p className="lead text-muted">
          You Can Always Visit The <Link to="/">Home Page</Link> To Get A Fresh
          Start
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
