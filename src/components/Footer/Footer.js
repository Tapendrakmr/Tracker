import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";

import "./footer.css";
class Footer extends Component {
  render() {
    const {
      user: { firstName, lastName },
    } = this.props;
    return (
      <div className="footer">
        <p>{`${firstName} ${lastName}`}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

Footer.propsTypes = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Footer);
