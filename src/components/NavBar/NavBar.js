import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ user, signOut }) {
  // The user prop could be the auth user (with username as id) or the db user.
  // We wait for the db user which has both .id and .username
  if (!user || !user.username) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">MyInstagram</Link>
          </div>
        </div>
      </nav>
    );
  }

  // If dbUser is loaded, user.id will be the ID. If only auth user is loaded, user.username is the ID.
  const userId = user.id || user.username;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">MyInstagram</Link>
        </div>
        <div className="navbar-menu">
          <Link to={`/profile/${userId}`}>Profile</Link>
          <span className="navbar-user">Hello, {user.username}</span>
          <button className="navbar-button" onClick={signOut}>Sign Out</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

