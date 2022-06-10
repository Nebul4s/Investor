import { useEffect } from "react";
import { useLogout } from "../hooks/useLogout";

const Logout = () => {
  const { logout } = useLogout();

  useEffect(() => {
    setTimeout(() => {
      logout();
      window.location = "/";
    }, 2000);
  }, []);

  return (
    <div className="Logout">
      <div className="logout-modal">
        <h2>You have succesfully logged out</h2>
        <span>Redirecting to homepage...</span>
      </div>
    </div>
  );
};

export default Logout;
