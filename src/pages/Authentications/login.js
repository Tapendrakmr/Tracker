import React, { Component } from "react";
import "./login.css";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
// Axios
import axios from "axios";
// REdux
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions/userActions";

// MaterialUI
import CircularProgress from "@material-ui/core/CircularProgress";
class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: "",
    };
  }
  componentDidMount() {
    var authenticated = this.props.authenticated;
    console.log(authenticated);
    if (authenticated === true) {
      this.props.history.push("/projects");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    var userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData, this.props.history);
  };
  render() {
    const {
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    let buttn;
    if (loading) {
      buttn = <CircularProgress size={22} />;
    } else {
      buttn = "SUBMIT";
    }
    return (
      <div className="main">
        <center>
          <span className="heading">Bigdesk</span>

          <h4>Login</h4>

          <form onSubmit={this.handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              name="password"
              type="password"
              placeholder="Password"
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <br />

            <button type="submit" id="login-button">
              {buttn}
            </button>
          </form>
        </center>

        <a href="#">Forgot Password ?</a>
        <center>{errors && <p className="error">{errors}</p>}</center>
      </div>
    );
  }
}
login.propType = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  loginUser,
};
export default connect(mapStateToProps, mapActionsToProps)(login);
