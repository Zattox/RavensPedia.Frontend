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

  // State for managing password change form data and messages (for current user)
  const [changePasswordData, setChangePasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [changePasswordMessage, setChangePasswordMessage] = useState(null);
  const [changePasswordError, setChangePasswordError] = useState(null);

  // State for managing admin password change form data and messages (for super admin)
  const [adminChangePasswordData, setAdminChangePasswordData] = useState({
    user_email: "",
    new_password: "",
  });
  const [adminChangePasswordMessage, setAdminChangePasswordMessage] =
    useState(null);
  const [adminChangePasswordError, setAdminChangePasswordError] =
    useState(null);

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
      await api.patch("/auth/change_user_role/", {
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

  // Handle input changes for password change form (current user)
  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change form submission (current user)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordMessage(null);
    setChangePasswordError(null);

    if (
      !changePasswordData.current_password ||
      !changePasswordData.new_password
    ) {
      setChangePasswordError("Please fill in all fields.");
      return;
    }

    if (
      changePasswordData.new_password.length < 5 ||
      changePasswordData.new_password.length > 50
    ) {
      setChangePasswordError(
        "New password must be between 5 and 50 characters.",
      );
      return;
    }

    try {
      await api.patch("/auth/change_password/", {
        current_password: changePasswordData.current_password,
        new_password: changePasswordData.new_password,
      });
      setChangePasswordMessage("Password successfully changed!");
      setChangePasswordData({ current_password: "", new_password: "" });
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
          setChangePasswordError(errorMessages);
        } else {
          setChangePasswordError(error.response.data.detail);
        }
      } else {
        setChangePasswordError("Error changing password. Please try again.");
      }
    }
  };

  // Handle input changes for admin password change form (super admin)
  const handleAdminChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setAdminChangePasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle admin password change form submission (super admin)
  const handleAdminChangePassword = async (e) => {
    e.preventDefault();
    setAdminChangePasswordMessage(null);
    setAdminChangePasswordError(null);

    if (
      !adminChangePasswordData.user_email ||
      !adminChangePasswordData.new_password
    ) {
      setAdminChangePasswordError("Please fill in all fields.");
      return;
    }

    if (
      adminChangePasswordData.new_password.length < 5 ||
      adminChangePasswordData.new_password.length > 50
    ) {
      setAdminChangePasswordError(
        "New password must be between 5 and 50 characters.",
      );
      return;
    }

    try {
      await api.patch("/auth/admin/change_user_password/", {
        user_email: adminChangePasswordData.user_email,
        new_password: adminChangePasswordData.new_password,
      });
      setAdminChangePasswordMessage(
        "Password successfully changed for the user!",
      );
      setAdminChangePasswordData({ user_email: "", new_password: "" });
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
          setAdminChangePasswordError(errorMessages);
        } else if (error.response.data.detail === "User not found") {
          setAdminChangePasswordError(
            "User with this email not found. Please register the user first.",
          );
        } else {
          setAdminChangePasswordError(error.response.data.detail);
        }
      } else {
        setAdminChangePasswordError(
          "Error changing password. Please try again.",
        );
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

            {/* Form for changing password (available to all users) */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="current_password"
                    className="block text-gray-300 font-semibold mb-2"
                  >
                    Current Password:
                  </label>
                  <Input.Password
                    id="current_password"
                    name="current_password"
                    value={changePasswordData.current_password}
                    onChange={handleChangePasswordInput}
                    className="w-full custom-input"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="new_password"
                    className="block text-gray-300 font-semibold mb-2"
                  >
                    New Password:
                  </label>
                  <Input.Password
                    id="new_password"
                    name="new_password"
                    value={changePasswordData.new_password}
                    onChange={handleChangePasswordInput}
                    className="w-full custom-input"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 hover:!bg-blue-700"
                >
                  Change Password
                </Button>
              </form>
              {changePasswordMessage && (
                <p className="text-green-500 text-center mt-4">
                  {changePasswordMessage}
                </p>
              )}
              {changePasswordError && (
                <p className="text-red-500 text-center mt-4">
                  {changePasswordError}
                </p>
              )}
            </div>

            {/* Form for changing user role (available to super admin) */}
            {isSuperAdmin() && (
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Change User Role (Super Admin)
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

            {/* Form for changing user password (available to super admin) */}
            {isSuperAdmin() && (
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Change User Password (Super Admin)
                </h3>
                <form
                  onSubmit={handleAdminChangePassword}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="admin_user_email"
                      className="block text-gray-300 font-semibold mb-2"
                    >
                      User Email:
                    </label>
                    <Input
                      type="email"
                      id="admin_user_email"
                      name="user_email"
                      value={adminChangePasswordData.user_email}
                      onChange={handleAdminChangePasswordInput}
                      className="w-full custom-input"
                      placeholder="Enter user email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin_new_password"
                      className="block text-gray-300 font-semibold mb-2"
                    >
                      New Password:
                    </label>
                    <Input.Password
                      id="admin_new_password"
                      name="new_password"
                      value={adminChangePasswordData.new_password}
                      onChange={handleAdminChangePasswordInput}
                      className="w-full custom-input"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-600 hover:!bg-blue-700"
                  >
                    Change User Password
                  </Button>
                </form>
                {adminChangePasswordMessage && (
                  <p className="text-green-500 text-center mt-4">
                    {adminChangePasswordMessage}
                  </p>
                )}
                {adminChangePasswordError && (
                  <p className="text-red-500 text-center mt-4">
                    {adminChangePasswordError}
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
