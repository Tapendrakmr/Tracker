import React, { Component } from "react";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import PropTypes from "prop-types";
import "./tracking.css";
import moment from "moment";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

import Timer from "react-compound-timer";

// Function call
import {
  databaseTableCreate,
  snipScreen,
  UnsendImage,
  every10Min,
  // selectAll,
  keyMouse,
} from "../TestPurpose/test";
// Fetch component
// import ScreenCapture from "../../components/Capture/ScreenCapture";

// Import function
import {
  getSingleTask,
  sessionLog,
  sessionLogOut,
} from "../../redux/actions/dataActions";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
class tracking extends Component {
  constructor() {
    super();
    this.state = {
      connectionBtn: "off",
      networkConnection: "offline",
      snipfunction: "",
      userId: "",
      projectId: "",
      sessionDate: "",
      sessionStartTime: "",
      startTimer: false,
      sessionId: "",
      keyboard: 0,
      mouse: 0,
    };
  }
  componentDidMount() {
    // Fetch userId
    // delete table

    const projectId = this.props.match.params.projectId;
    this.props.getSingleTask(projectId);
    // Set required variable
    const { _id } = this.props.user;
    console.log("userid :" + _id);
    this.setState({
      userId: _id,
      projectId: projectId,
    });

    // Intialise Database
    var result = databaseTableCreate();
    console.log("database Start" + result);

    // Execute taskfunction
    console.log("Start tracking");

    // All Data in database
    // const alldata = selectAll();
    // console.log(alldata);

    // Fetch all unsendData
    var allUnsendata = UnsendImage(projectId);

    // Connection
    setInterval(this.handleCheckConnection, 1000);
    // window.addEventListener("keypress", this.handleKeyboard);
    // window.addEventListener("mousemove", this.handlemouse);
  }

  //  Track keyboard and mouse

  handleKeyboard = () => {
    this.setState({
      keyboard: this.state.keyboard + 1,
    });
    console.log(this.state.keyboard);
  };

  handlemouse = () => {
    this.setState({
      mouse: this.state.mouse + 1,
    });
    console.log(this.state.mouse);
  };

  // Activate capturing  on 'ON' state and  'Of' on 'OFF' state
  handleButton = async (e) => {
    // deleteTable();
    if (e.target.checked) {
      keyMouse();
      console.log("Tracker is on ===================");
      //Set the sessionStartTime and Date
      let today = new Date();

      let date = `${today.getDate()}_${
        today.getMonth() + 1
      }_${today.getFullYear()}`;
      console.log("date --------------------", date);
      let time = `${today.getHours()}_${today.getMinutes()}`;
      console.log("time ===============", time);
      this.setState({
        sessionDate: date,
        sessionStartTime: time,
        startTimer: true,
      });
      console.log("current session date =============", this.state);
      // Submit the project detail to backend user on click
      console.log("projectID :" + this.state.projectId);

      //   Start the session and assigned value to valueId
      this.props.sessionLog({ project: this.state.projectId }, (res) => {
        console.log("Session work");
        console.log(res);
        this.setState({
          sessionId: `${res}`,
        });
      });

      var dataFromtrack = {
        userId: this.state.userId,
        projectId: this.state.projectId,
        sessionDate: `${today.getDate()}_${
          today.getMonth() + 1
        }_${today.getFullYear()}`,
        sessionStartTime: `${today.getHours()}_${today.getMinutes()}`,
        networkConnection: this.state.networkConnection,
      };

      let startCapturing = setInterval(
        every10Min,
        10 * 60 * 1000,
        dataFromtrack
      );
      this.setState({
        snipfunction: startCapturing,
      });
    } else {
      this.setState({
        startTimer: false,
      });
      console.log("stop capturing off");
      clearInterval(this.state.snipfunction);

      // Close the session
      this.props.sessionLogOut(this.state.sessionId);
    }
  };

  // Other function not call by any component
  handleCheckConnection = () => {
    var ifConnected = navigator.onLine;
    console.log("Network connection ======", ifConnected);
    if (ifConnected) {
      return this.setState({
        networkConnection: "online",
      });
    } else {
      return this.setState({
        networkConnection: "offline",
      });
    }
  };

  render() {
    const {
      project: { title },
    } = this.props.data;
    const { startTimer } = this.state;

    return (
      <div className="MainProject">
        <div className="user-information">
          <Link to="/projects">
            <KeyboardArrowLeftIcon className="back-button-icon" />
          </Link>
          <h3 className="project-name">Develop an Android App: {title}</h3>
          <span className="user-name">{`${this.props.user.firstName} ${this.props.user.lastName}`}</span>
        </div>
        <div className="timer-section">
          <p>Current Session</p>

          <span className="time">
            <p>{String(startTimer) === "true"}</p>

            <p>{Boolean(String(startTimer))}</p>
            <Timer startImmediately={false} className={`time`}>
              <Timer.Hours formatValue={(value) => `${value} hrs `} />
              <Timer.Minutes formatValue={(value) => ` ${value} min `} />
              <Timer.Seconds formatValue={(value) => ` ${value}`} />
            </Timer>
          </span>
          {/* <span className="time">5 hrs 00 min</span> */}

          <label className="switch">
            <input
              type="checkbox"
              id="togBtn"
              onChange={(e) => this.handleButton(e)}
            />
            <div className="slider round">
              <span className="on">ON</span>
              <span className="off">OFF</span>
            </div>
          </label>
        </div>

        <div className="days">
          <div>
            <p className="current-day">{`Today ${moment().format("dddd")}`}</p>
            <span className="work-time">12:10 hrs</span>
          </div>
          <div>
            <p>This Week</p>
            <span className="work-time">12:10 hrs</span>
          </div>
        </div>
        {this.state.networkConnection}
        <div className="message">
          <textarea placeholder="What are you working on? Please enter your task details here."></textarea>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}
tracking.propTypes = {
  getSingleTask: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  sessionLog: PropTypes.func.isRequired,
  sessionLogOut: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

export default connect(mapStateToProps, {
  getSingleTask,
  sessionLog,
  sessionLogOut,
})(tracking);
