import { useAuthContext } from "../hooks/useAuthContext";
import { NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

//Images and svgs
import Logo from "../assets/stock.svg";

const NavBar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="NavBar">
      {/* logo */}
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
        <h1>Investor</h1>
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
            <p>
              Hi,{" "}
              {user.displayName.charAt(0).toUpperCase() +
                user.displayName.slice(1)}
            </p>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
