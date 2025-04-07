import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import { NotificationContext } from "@/context/NotificationContext";

import api from "@/api";

// AdminPlayerPanel component for managing player-related admin functionalities
function AdminPlayerPanel({ player_nickname, refreshPlayer }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const notificationApi = useContext(NotificationContext); // Accessing notification system from context

  // State for controlling visibility of modals
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // Update player modal visibility
  const [isDeletePlayerModalVisible, setIsDeletePlayerModalVisible] =
    useState(false); // Delete player modal visibility

  // Form instance for managing form data and validation
  const [updateForm] = Form.useForm();

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handler to show the update player modal
  const showUpdateModal = () => setIsUpdateModalVisible(true);

  // Handler to update player information
  const handleUpdatePlayer = async (values) => {
    const updatedPlayer = {};
    if (values.steam_id) updatedPlayer.steam_id = values.steam_id; // Add steam_id if provided
    if (values.nickname) updatedPlayer.nickname = values.nickname; // Add nickname if provided
    if (values.name) updatedPlayer.name = values.name; // Add name if provided
    if (values.surname) updatedPlayer.surname = values.surname; // Add surname if provided

    // Check if at least one field is filled for update
    if (Object.keys(updatedPlayer).length > 0) {
      try {
        await api.patch(`/players/${player_nickname}/`, updatedPlayer); // Send PATCH request to update player
        showNotification(
          "success",
          "Success!",
          "Player information updated successfully!",
        );
        await refreshPlayer(); // Refresh player data after update
        setIsUpdateModalVisible(false); // Close the modal
        updateForm.resetFields(); // Clear form fields
      } catch (error) {
        console.error("Error updating player:", error); // Log error details
        const errorDetail =
          error.response?.data?.detail || "Failed to update player information"; // Extract error message
        showNotification("error", "Error!", errorDetail); // Show error notification
      }
    } else {
      showNotification(
        "error",
        "Error!",
        "At least one field must be filled to update.",
      ); // Notify if no fields are filled
    }
  };

  // Handler to show the delete player modal
  const showDeletePlayerModal = () => setIsDeletePlayerModalVisible(true);

  // Handler to delete the player
  const handleDeletePlayer = async () => {
    try {
      await api.delete(`/players/${player_nickname}/`); // Send DELETE request to remove player
      showNotification("success", "Success!", "Player deleted successfully!");
      setIsDeletePlayerModalVisible(false); // Close the modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting player:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete player"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
      setIsDeletePlayerModalVisible(false); // Close the modal even on error
    }
  };

  // Generic handler to close modals and reset forms
  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form?.resetFields(); // Reset form fields if form exists
  };

  // Render admin player panel UI
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20 admin-panel">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Player Management (Admin)
      </h2>
      <div className="space-y-4">
        {/* Update Player Button */}
        <Button
          onClick={showUpdateModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Update Information
        </Button>

        {/* Update Player Modal */}
        <Modal
          title={<span className="text-white">Update Player Information</span>}
          open={isUpdateModalVisible}
          onCancel={() => handleCancel(setIsUpdateModalVisible, updateForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={updateForm}
            onFinish={handleUpdatePlayer}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="steam_id"
              label={
                <span className="text-gray-300">
                  Steam ID{" "}
                  <Tooltip title="Enter new Steam ID (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New Steam ID (optional)"
              />
            </Form.Item>
            <Form.Item
              name="nickname"
              label={
                <span className="text-gray-300">
                  Nickname{" "}
                  <Tooltip title="Enter new nickname (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New nickname (optional)"
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={
                <span className="text-gray-300">
                  Name{" "}
                  <Tooltip title="Enter new name (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New name (optional)"
              />
            </Form.Item>
            <Form.Item
              name="surname"
              label={
                <span className="text-gray-300">
                  Surname{" "}
                  <Tooltip title="Enter new surname (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New surname (optional)"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsUpdateModalVisible, updateForm)
                  }
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:!bg-blue-700"
                >
                  Update
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Player Button */}
        <Button
          onClick={showDeletePlayerModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete Player
        </Button>

        {/* Delete Player Modal */}
        <Modal
          title={<span className="text-white">Delete Player</span>}
          open={isDeletePlayerModalVisible}
          onCancel={() => handleCancel(setIsDeletePlayerModalVisible, null)}
          footer={null}
          className="custom-modal"
        >
          <p className="text-white">
            Are you sure you want to delete the player {player_nickname}?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => handleCancel(setIsDeletePlayerModalVisible, null)}
              className="text-white border-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePlayer}
              className="bg-red-600 hover:!bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminPlayerPanel;
