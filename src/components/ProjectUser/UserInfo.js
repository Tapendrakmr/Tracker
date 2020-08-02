import React, { Component } from "react";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./userinfo.css";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";

class UserInfo extends Component {
  render() {
    const { projectId, projectdesc, projectTitle, user } = this.props;

    console.log("inside project user filessss=====", this.props);
    return (
      // <div className="UserMain">
      //   <div className="user">
      //     <span className="title">Develope Android Healthray App...</span>
      //     <div className="work">
      //       <p className="userName">User Name</p>
      //       <p className="timeperiod">12 Hours worked</p>
      //       {/* <KeyboardArrowRight className="rightIcon" /> */}

      //     </div>
      //   </div>
      //   <div className="rightArrowIcon">
      //     <Link to="/tracking">
      //       {" "}
      //       <KeyboardArrowRight className="rightIcon" />
      //     </Link>
      //   </div>
      // </div>

      // Temp
      <div className="UserMain">
        <div className="user">
          <span className="title">{projectTitle}</span>
          <div className="work">
            <p className="userName">{`${user.firstName} ${user.lastName}`}</p>
            <p className="timeperiod">12 Hours worked</p>
            {/* <KeyboardArrowRight className="rightIcon" /> */}
          </div>
        </div>
        <div className="rightArrowIcon">
          <Link to={`/project/${projectId}`}>
            <KeyboardArrowRight className="rightIcon" />
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

UserInfo.propsTypes = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(UserInfo);
