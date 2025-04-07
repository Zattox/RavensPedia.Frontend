import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext.jsx";

// LogoutButton component to handle user logout functionality
function LogoutButton() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { logout } = useAuth(); // Access logout function from AuthContext

  // Handler to perform logout and redirect to login page
  const handleLogout = async () => {
    await logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 border border-gray-500"
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
