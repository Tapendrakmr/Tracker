import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";

// Call Component
import UserInfo from "../../components/ProjectUser/UserInfo";
import Footer from "../../components/Footer/Footer";
import "./Project.css";

// Redux
import { connect } from "react-redux";
import { getUserTask } from "../../redux/actions/dataActions";
class Project extends Component {
  componentDidMount() {
    this.refreshPage();
  }

  refreshPage = () => {
    console.log("Working");
    this.props.getUserTask();
  };
  render() {
    const { projects, loading } = this.props.data;
    console.log("All projects list ==============", this.props);
    let recentProject = !loading ? (
      projects.map((element) => (
        <UserInfo
          key={element._id}
          projectId={element.project._id}
          projectdesc={element.project.description}
          projectTitle={element.project.title}
        />
      ))
    ) : (
      <p>loading ..</p>
    );

    return (
      <div className="MainProject">
        {/* SearchBox start */}
        <div className="searchBox">
          <input
            type="search-Box"
            name="searchBox"
            placeholder="Search Projects"
            id="search-Box"
          />
          <div className="search">
            <div className="icon search-Icon">
              <SearchIcon />
            </div>
            <RefreshIcon
              className="icon refresh-icon"
              style={{ cursor: "pointer" }}
              onClick={this.refreshPage}
            />
          </div>
        </div>
        {/* Searchbox End */}
        <div className="UserProjects">
          <p> {loading}</p>
          {recentProject}
        </div>
        <div className="Footer_bootom">
          <Footer />
        </div>
      </div>
    );
  }
}
Project.propTypes = {
  getUserTask: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserTask })(Project);
