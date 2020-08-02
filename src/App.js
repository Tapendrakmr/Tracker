import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";

// page
import login from "./pages/Authentications/login";
import project from "./pages/Project/Project";
import tracking from "./pages/Tracking/tracking";

// Component
import AuthRoute from "./util/AuthRoute";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
import axios from "axios";

// TestPage
import test from "./pages/TestPurpose/test";
import Page from "./pages/pageCapture";
let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodeToken = jwtDecode(token);
  // console.log("decoded");
  // console.log(decodeToken);
  if (decodeToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/";
    console.log("experire");
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    // console.log("headerS");
    store.dispatch(getUserData(decodeToken.data));
  }
  // console.log(decodeToken.exp);
}

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {/* test start */}
            {/* <Route exact path="/" component={test} /> */}
            {/* <Route exact path="/" component={Page} /> */}
            {/* <Route exact path="/" component={tracking} /> */}
            {/* /test end */}
            <Route exact path="/" component={tracking} />
            <Route exact path="/projects" component={project} />
            <Route exact path="/project/:projectId" component={tracking} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  );
}

export default App;
