import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">Home</Link>
      <Link to="/manage-movies">Quản lý phim</Link>
      <Link to="/manage-users">Quản lý người dùng</Link>
      <Link to="/manage-shoppe-links">Quản lý link Shopee</Link>
      <Link to="/manage-payments">Quản lý thanh toán</Link>
    </div>
  );
};

export default Sidebar;
