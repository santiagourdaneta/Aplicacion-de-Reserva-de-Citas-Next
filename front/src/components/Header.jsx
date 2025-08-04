import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const Header = () => {
  return (
    <nav className="navbar is-info" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <FaCalendarAlt size={24} style={{ marginRight: '8px' }} />
          <h1 className="is-size-4 has-text-weight-bold">
            Tu App de Citas
          </h1>
        </a>
      </div>
    </nav>
  );
};

export default Header;