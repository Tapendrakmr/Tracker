import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_UI,
  LOADING_USER,
  SET_ERRORS,
  SET_USER_INFO,
  CLEAR_ERRORS,
} from "../types";
import { BASE_URL } from "../../common/config";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`${BASE_URL}/login`, userData)
    .then((res) => {
      console.log("Login Data ======================", res.data.data.data);
      setAuthorizationHeader(res.data.data.token);
      dispatch({ type: SET_USER, payload: res.data.data });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/projects");
    })
    .catch((err) => {
      console.log("error in login *************", err);

      dispatch({
        type: SET_ERRORS,
        payload: "Account does not exist",
      });
    });
};

export const getUserData = (userInfo) => (dispatch) => {
  console.log("inside get user data ============", userInfo);
  dispatch({ type: LOADING_UI });
  dispatch({
    type: SET_USER,
    payload: userInfo,
  });
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};
