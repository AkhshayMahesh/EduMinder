import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";

const Layout = (props) => {

  return (
    <div>
      <nav>
        <div className="item logo"><Link to="/">EduMinder</Link></div>
        <ul className="menu">
          <li className="item"><Link to="/">Home</Link></li>
          {/* <li className="item"><Link to="/create">Create Assignment</Link></li> */}
          <li className="item button"><Link to="">Profile</Link></li>
          <li className="item button"><Link to="/calendar">Calendar</Link></li>
          <li className="item button"><Link to="/login">Log In</Link></li>
          {/* <li className="item button secondary"><Link to="/register">Sign Up</Link></li> */}
        </ul>
      </nav>
      <div className="loading">
        {props.isLoad &&
          <div className="bar"></div>
        }
      </div>
    </div>
  );
}

export default Layout;