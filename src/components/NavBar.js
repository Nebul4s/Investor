import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

//Images and svgs
import Logo from "../assets/stock.svg";
import menuSVG from "../assets/menu.svg";
import closeSVG from "../assets/close.svg";

const NavBar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);

    document.querySelector(".mobile__nav").classList.toggle("menu__active");
  };

  return (
    <div className="NavBar">
      {/* logo */}
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
        <h1>Investor</h1>
      </div>
      <div className="mobile-menu__btn">
        {!showMobileMenu && (
          <img onClick={handleMobileMenu} src={menuSVG} alt="Mobile menu" />
        )}
        {showMobileMenu && (
          <img onClick={handleMobileMenu} src={closeSVG} alt="Mobile menu" />
        )}
      </div>
      <div className="mobile__nav">
        <div className="mobileItems">
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
      {/* menu items */}
      <div className="normalMenu header__menuItems">
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
