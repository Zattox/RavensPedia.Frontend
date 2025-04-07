import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { useState } from "react";
import { Button, Input, Select } from "antd";
import api from "@/api";

function ProfilePage() {
  const { user, loading, isSuperAdmin, checkAuth } = useAuth();
  // State for managing role change form data and messages
  const [changeRoleData, setChangeRoleData] = useState({
    user_email: "",
    new_role: "",
  });
  const [changeRoleMessage, setChangeRoleMessage] = useState(null);
  const [changeRoleError, setChangeRoleError] = useState(null);

  // Handle input changes for role change form
  const handleChangeRoleInput = (e) => {
    const { name, value } = e.target;
    setChangeRoleData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle role change form submission
  const handleChangeRole = async (e) => {
    e.preventDefault();
    setChangeRoleMessage(null);
    setChangeRoleError(null);

    if (!changeRoleData.user_email || !changeRoleData.new_role) {
      setChangeRoleError("Please fill in all fields.");
      return;
    }

    if (!["user", "admin"].includes(changeRoleData.new_role)) {
      setChangeRoleError('Invalid role. Choose "user" or "admin".');
      return;
    }

    try {
      const response = await api.patch("/auth/change_user_role/", {
        user_email: changeRoleData.user_email,
        new_role: changeRoleData.new_role,
      });
      setChangeRoleMessage("Role successfully changed!");
      setChangeRoleData({ user_email: "", new_role: "" });
      await checkAuth();
    } catch (error) {
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail
            .map((err) => {
              if (typeof err === "object") {
                const field = err.loc ? err.loc.join(".") : "unknown field";
                const message = err.msg || err.toString();
                return `${field}: ${message}`;
              }
              return err.toString();
            })
            .join(", ");
          setChangeRoleError(errorMessages);
        } else if (error.response.data.detail === "User not found") {
          setChangeRoleError(
            "User with this email not found. Please register the user first.",
          );
        } else {
          setChangeRoleError(error.response.data.detail);
        }
      } else {
        setChangeRoleError("Error changing role. Check data and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-7xl bg-gray-800 p-10 rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold mb-10 text-white text-center">
          Profile
        </h2>
        {loading ? (
          <p className="text-white text-center text-xl">Loading...</p>
        ) : user ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-700 p-6 rounded-lg">
              <span className="text-gray-300 font-semibold text-xl">
                Email:
              </span>
              <span className="text-white text-xl">{user.email}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-6 rounded-lg">
              <span className="text-gray-300 font-semibold text-xl">Role:</span>
              <span className="text-white text-xl">
                {user.role || "Not specified"}
              </span>
            </div>

            {isSuperAdmin() && (
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Change User Role
                </h3>
                <form onSubmit={handleChangeRole} className="space-y-4">
                  <div>
                    <label
                      htmlFor="user_email"
                      className="block text-gray-300 font-semibold mb-2"
                    >
                      User Email:
                    </label>
                    <Input
                      type="email"
                      id="user_email"
                      name="user_email"
                      value={changeRoleData.user_email}
                      onChange={handleChangeRoleInput}
                      className="w-full custom-input"
                      placeholder="Enter user email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new_role"
                      className="block text-gray-300 font-semibold mb-2"
                    >
                      New Role:
                    </label>
                    <Select
                      id="new_role"
                      name="new_role"
                      value={changeRoleData.new_role}
                      onChange={(value) =>
                        setChangeRoleData((prev) => ({
                          ...prev,
                          new_role: value,
                        }))
                      }
                      className="w-full custom-select"
                      placeholder="Select role"
                      required
                    >
                      <Select.Option value="user">User</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-600 hover:!bg-blue-700"
                  >
                    Change Role
                  </Button>
                </form>
                {changeRoleMessage && (
                  <p className="text-green-500 text-center mt-4">
                    {changeRoleMessage}
                  </p>
                )}
                {changeRoleError && (
                  <p className="text-red-500 text-center mt-4">
                    {changeRoleError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center text-xl">
            Failed to load profile data. Please log in again.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
