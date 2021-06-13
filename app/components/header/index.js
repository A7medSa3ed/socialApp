import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";
import { StateContext } from "../../store/global/ContextStore";

const Header = props => {
  const { loggedin } = useContext(StateContext);
  const headerContent = loggedin ? <HeaderLoggedIn /> : <HeaderLoggedOut />;

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            Social App
          </Link>
        </h4>
        {/* staticEmpty is come from generateHtml File, 
          if this is true si it will hide header sign in form or signed in user data */}
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
};

export default Header;
