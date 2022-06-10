import { useAuthContext } from "../hooks/useAuthContext";
import { NavLink } from "react-router-dom";

import Logo from "../assets/stock.svg";

const NavBar = () => {
  const { user } = useAuthContext();

  const handleLogout = () => {
    window.location = "/logout";
  };

  return (
    <div className="NavBar">
      {/* logo */}
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
        <h1>Investor</h1>
      </div>
      {/* searchbar */}
      <div className="header__search">
        <div className="header__searchContainer">
          <input placeholder="Search" type="text" />
        </div>
      </div>
      {/* menu items */}
      <div className="header__menuItems">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
        {user && (
          <>
            <p>Hi, {user.displayName}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
