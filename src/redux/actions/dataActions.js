import {
  LOADING_DATA,
  SET_PROJECTS,
  LOADING_UI,
  SET_PROJECT,
  STOP_LOADING_UI,
} from "../types";

import { BASE_URL } from "../../common/config";
import axios from "axios";

// Fetch projects under user
export const getUserTask = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`${BASE_URL}​/projectMember/contractProjects`)
    .then((res) => {
      console.log("data comes");
      console.log(res.data);
      dispatch({
        type: SET_PROJECTS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log("Error comes");
      console.log(err);
    });
};

// Fetch single project with their projectID
export const getSingleTask = (projectId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`${BASE_URL}/project/${projectId}`)
    .then((res) => {
      console.log("Project details ======", res.data.data);
      dispatch({
        type: SET_PROJECT,
        payload: res.data.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
};

// Start new Session wth ProjectId
export const sessionLog = (data, callback) => (dispatch) => {
  console.log(data);
  axios
    .post(`${BASE_URL}​/sessionLog`, data)
    .then((res) => {
      console.log("response comes on submiting projectId");
      console.log(res);
      callback(res.data.data._id);
    })
    .catch((err) => {
      console.log("Eror comes on submiting projectId");
      console.log(err);
    });
};

// Stop the session with sessionId which comes during starting of session
export const sessionLogOut = (sessionId) => (dispatch) => {
  console.log("cloase session" + sessionId);
  axios
    .put(`${BASE_URL}​/sessionLog/${sessionId}`)
    .then((res) => {
      console.log("Session Stop");
      console.log(res);
    })
    .catch((err) => {
      console.log("Something Error occur");
      console.group(err);
    });
};

// Add screen shot to provided session Id
export const sessionScreenShot = (data) => (dispatch) => {
  console.log("Session Screen Shot");
  console.log(data);
  axios
    .post(`${BASE_URL}/sessionScreenShot`, data)
    .then((res) => {
      console.log("SuccessFull Submission");
      console.log(res);
    })
    .catch((err) => {
      console.log("error in session Screen Shot");
      console.log(err);
    });
};

// Remove Screen Shot with screenShot
export const removeScreenShot = (screenShotId) => (dispatch) => {
  console.log("Remove ScreenShot From Backende Database");
  axios
    .delete(`${BASE_URL}/sessionScreenShot/${screenShotId}`)
    .then((res) => {
      console.log("Succesfully Remove ScreenShotID");
      console.log(res);
    })
    .catch((err) => {
      console.log("Problem to remove ScreenShot");
      console.log(err);
    });
};
