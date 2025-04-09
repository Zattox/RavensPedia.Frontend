import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import { NotificationContext } from "@/context/NotificationContext";

import api from "@/api";

// AdminTeamPanel component for managing team-related admin functionalities
function AdminTeamPanel({ team_name, refreshTeam }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const notificationApi = useContext(NotificationContext); // Accessing notification system from context

  // State for controlling visibility of modals
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // Update team modal visibility
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false); // Add player modal visibility
  const [isDeletePlayerModalVisible, setIsDeletePlayerModalVisible] =
    useState(false); // Delete player modal visibility
  const [isDeleteTeamConfirmModalVisible, setIsDeleteTeamConfirmModalVisible] =
    useState(false); // Delete team confirmation modal visibility

  // Form instances for managing form data and validation
  const [updateForm] = Form.useForm();
  const [addPlayerForm] = Form.useForm();
  const [deletePlayerForm] = Form.useForm();

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handler to show the update team modal
  const showUpdateModal = () => setIsUpdateModalVisible(true);

  // Handler to update team information
  const handleUpdateTeam = async (values) => {
    const updatedTeam = {};
    if (values.name) updatedTeam.name = values.name; // Add name if provided
    if (values.description) updatedTeam.description = values.description; // Add description if provided

    // Check if at least one field is filled for update
    if (Object.keys(updatedTeam).length > 0) {
      try {
        await api.patch(`/teams/${team_name}/`, updatedTeam); // Send PATCH request to update team
        await refreshTeam(); // Refresh team data after update
        showNotification(
          "success",
          "Success!",
          "Team information updated successfully!",
        );
        setIsUpdateModalVisible(false); // Close the modal
        updateForm.resetFields(); // Clear form fields
      } catch (error) {
        console.error("Error updating team:", error); // Log error details
        const errorDetail =
          error.response?.data?.detail || "Failed to update team information"; // Extract error message
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

  // Handler to show the add player modal
  const showAddPlayerModal = () => setIsAddPlayerModalVisible(true);

  // Handler to add a player to the team
  const handleAddPlayer = async (values) => {
    try {
      await api.patch(
        `/teams/${team_name}/add_player/${values.player_nickname}/`,
      ); // Send PATCH request to add player
      showNotification(
        "success",
        "Success!",
        `Player ${values.player_nickname} added successfully!`,
      );
      await refreshTeam(); // Refresh team data after update
      setIsAddPlayerModalVisible(false); // Close the modal
      addPlayerForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error adding player:", error.response?.data || error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to add player"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the delete player modal
  const showDeletePlayerModal = () => setIsDeletePlayerModalVisible(true);

  // Handler to delete a player from the team
  const handleDeletePlayer = async (values) => {
    try {
      await api.delete(
        `/teams/${team_name}/delete_player/${values.player_nickname}/`,
      ); // Send DELETE request to remove player
      showNotification(
        "success",
        "Success!",
        `Player ${values.player_nickname} deleted successfully!`,
      );
      await refreshTeam(); // Refresh team data after update
      setIsDeletePlayerModalVisible(false); // Close the modal
      deletePlayerForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error deleting player:", error.response?.data || error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete player"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the delete team confirmation modal
  const showDeleteTeamConfirmModal = () =>
    setIsDeleteTeamConfirmModalVisible(true);

  // Handler to delete the team
  const handleDeleteTeam = async () => {
    try {
      await api.delete(`/teams/${team_name}/`); // Send DELETE request to remove team
      showNotification("success", "Success!", "Team deleted successfully!");
      setIsDeleteTeamConfirmModalVisible(false); // Close the modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting team:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete team"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
      setIsDeleteTeamConfirmModalVisible(false); // Close the modal even on error
    }
  };

  // Generic handler to close modals and reset forms
  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form?.resetFields(); // Reset form fields if form exists
  };

  // Render admin team panel UI
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20 max-h-[90vh] overflow-y-auto admin-panel">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Team Management (Admin)
      </h2>
      <h3 className="text-lg font-semibold mb-2">Team Actions</h3>
      <div className="space-y-4">
        {/* Update Team Button */}
        <Button
          onClick={showUpdateModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Update Information
        </Button>

        {/* Update Team Modal */}
        <Modal
          title={<span className="text-white">Update Team Information</span>}
          open={isUpdateModalVisible}
          onCancel={() => handleCancel(setIsUpdateModalVisible, updateForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={updateForm}
            onFinish={handleUpdateTeam}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="name"
              label={
                <span className="text-gray-300">
                  Team Name{" "}
                  <Tooltip title="Enter new team name (leave blank to keep unchanged)">
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
              name="description"
              label={
                <span className="text-gray-300">
                  Description{" "}
                  <Tooltip title="Enter new team description (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="New description (optional)"
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

        {/* Delete Team Button */}
        <Button
          onClick={showDeleteTeamConfirmModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete Team
        </Button>

        {/* Delete Team Confirmation Modal */}
        <Modal
          title={<span className="text-white">Delete Team</span>}
          open={isDeleteTeamConfirmModalVisible}
          onCancel={() =>
            handleCancel(setIsDeleteTeamConfirmModalVisible, null)
          }
          footer={null}
          className="custom-modal"
        >
          <p className="text-white">
            Are you sure you want to delete the team {team_name}?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() =>
                handleCancel(setIsDeleteTeamConfirmModalVisible, null)
              }
              className="text-white border-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTeam}
              className="delete-button text-white"
            >
              Delete
            </Button>
          </div>
        </Modal>

        <h3 className="text-lg font-semibold mb-2">Player Management</h3>

        {/* Add Player Button */}
        <Button
          onClick={showAddPlayerModal}
          className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Add Player
        </Button>

        {/* Add Player Modal */}
        <Modal
          title={<span className="text-white">Add Player</span>}
          open={isAddPlayerModalVisible}
          onCancel={() =>
            handleCancel(setIsAddPlayerModalVisible, addPlayerForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={addPlayerForm}
            onFinish={handleAddPlayer}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="player_nickname"
              label={
                <span className="text-gray-300">
                  Player Nickname{" "}
                  <Tooltip title="Enter the nickname of the player to add to the team">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter the player's nickname",
                },
              ]}
            >
              <Input className="custom-input" placeholder="e.g., s1mple" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsAddPlayerModalVisible, addPlayerForm)
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
                  Add
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
          onCancel={() =>
            handleCancel(setIsDeletePlayerModalVisible, deletePlayerForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={deletePlayerForm}
            onFinish={handleDeletePlayer}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="player_nickname"
              label={
                <span className="text-gray-300">
                  Player Nickname{" "}
                  <Tooltip title="Enter the nickname of the player to remove from the team">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter the player's nickname",
                },
              ]}
            >
              <Input className="custom-input" placeholder="e.g., s1mple" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(
                      setIsDeletePlayerModalVisible,
                      deletePlayerForm,
                    )
                  }
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="delete-button text-white"
                >
                  Delete
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default AdminTeamPanel;
