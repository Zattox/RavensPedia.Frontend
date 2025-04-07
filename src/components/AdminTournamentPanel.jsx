import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Button, Tooltip, Select } from "antd";
import { NotificationContext } from "@/context/NotificationContext";
import api from "@/api";

const { Option } = Select;

// AdminTournamentPanel component for managing tournament-related admin functionalities
function AdminTournamentPanel({ tournamentName, refreshTournament }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const notificationApi = useContext(NotificationContext); // Accessing notification system from context

  // State for controlling visibility of modals
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // Update tournament modal visibility
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false); // Add team modal visibility
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] =
    useState(false); // Delete team modal visibility
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState(false); // Update status modal visibility
  const [isAddResultModalVisible, setIsAddResultModalVisible] = useState(false); // Add result modal visibility
  const [isDeleteResultModalVisible, setIsDeleteResultModalVisible] =
    useState(false); // Delete result modal visibility
  const [
    isAssignTeamToResultModalVisible,
    setIsAssignTeamToResultModalVisible,
  ] = useState(false); // Assign team to result modal visibility
  const [
    isRemoveTeamFromResultModalVisible,
    setIsRemoveTeamFromResultModalVisible,
  ] = useState(false); // Remove team from result modal visibility
  const [isDeleteTournamentModalVisible, setIsDeleteTournamentModalVisible] =
    useState(false); // Delete tournament modal visibility

  // Form instances for managing form data and validation
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();
  const [updateStatusForm] = Form.useForm();
  const [addResultForm] = Form.useForm();
  const [assignTeamToResultForm] = Form.useForm();
  const [removeTeamFromResultForm] = Form.useForm();

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handler to show the update tournament modal
  const showUpdateModal = () => setIsUpdateModalVisible(true);

  // Handler to update tournament information
  const handleUpdateTournament = async (values) => {
    const updatedTournament = {};
    if (values.name) updatedTournament.name = values.name; // Add name if provided
    if (values.description) updatedTournament.description = values.description; // Add description if provided
    if (values.prize) updatedTournament.prize = values.prize; // Add prize if provided
    if (values.start_date) updatedTournament.start_date = values.start_date; // Add start date if provided
    if (values.end_date) updatedTournament.end_date = values.end_date; // Add end date if provided

    // Check if at least one field is filled for update
    if (Object.keys(updatedTournament).length > 0) {
      try {
        await api.patch(`/tournaments/${tournamentName}/`, updatedTournament); // Send PATCH request to update tournament
        showNotification(
          "success",
          "Success!",
          "Tournament updated successfully!",
        );
        await refreshTournament(); // Refresh tournament data after update
        setIsUpdateModalVisible(false); // Close the modal
        updateForm.resetFields(); // Clear form fields
      } catch (error) {
        console.error("Error updating tournament:", error); // Log error details
        const errorDetail =
          error.response?.data?.detail || "Failed to update tournament"; // Extract error message
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

  // Handler to show the update status modal
  const showUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(true);
    updateStatusForm.setFieldsValue({ tournament_name: tournamentName }); // Pre-fill tournament name
  };

  // Handler to update tournament status
  const handleUpdateStatus = async (values) => {
    try {
      await api.patch(
        `/schedules/tournaments/${values.tournament_name}/update_status/`,
        null,
        {
          params: { new_status: values.new_status },
        },
      ); // Send PATCH request to update status
      showNotification(
        "success",
        "Success!",
        "Tournament status updated successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsUpdateStatusModalVisible(false); // Close the modal
      updateStatusForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error(
        "Error updating tournament status:",
        error.response?.data || error,
      ); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to update tournament status"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the delete tournament modal
  const showDeleteTournamentModal = () =>
    setIsDeleteTournamentModalVisible(true);

  // Handler to delete the tournament
  const handleDeleteTournament = async () => {
    try {
      await api.delete(`/tournaments/${tournamentName}/`); // Send DELETE request to remove tournament
      showNotification(
        "success",
        "Success!",
        "Tournament deleted successfully!",
      );
      setIsDeleteTournamentModalVisible(false); // Close the modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting tournament:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete tournament"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
      setIsDeleteTournamentModalVisible(false); // Close the modal even on error
    }
  };

  // Handler to show the add team modal
  const showAddTeamModal = () => setIsAddTeamModalVisible(true);

  // Handler to add a team to the tournament
  const handleAddTeam = async (values) => {
    try {
      await api.patch(
        `/tournaments/${tournamentName}/add_team/${values.team_name}/`,
      ); // Send PATCH request to add team
      showNotification(
        "success",
        "Success!",
        "Team added to tournament successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsAddTeamModalVisible(false); // Close the modal
      addTeamForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error adding team:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to add team to tournament"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the delete team modal
  const showDeleteTeamModal = () => setIsDeleteTeamModalVisible(true);

  // Handler to delete a team from the tournament
  const handleDeleteTeam = async (values) => {
    try {
      await api.delete(
        `/tournaments/${tournamentName}/delete_team/${values.team_name}/`,
      ); // Send DELETE request to remove team
      showNotification(
        "success",
        "Success!",
        "Team removed from tournament successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsDeleteTeamModalVisible(false); // Close the modal
      deleteTeamForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error deleting team:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to remove team from tournament"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the add result modal
  const showAddResultModal = () => setIsAddResultModalVisible(true);

  // Handler to add a result to the tournament
  const handleAddResult = async (values) => {
    try {
      await api.patch(`/tournaments/${tournamentName}/add_result/`, {
        place: values.place,
        prize: values.prize,
      }); // Send PATCH request to add result
      showNotification("success", "Success!", "Result added successfully!");
      await refreshTournament(); // Refresh tournament data after update
      setIsAddResultModalVisible(false); // Close the modal
      addResultForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error adding result:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to add result"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the delete result modal
  const showDeleteResultModal = () => setIsDeleteResultModalVisible(true);

  // Handler to delete the last result from the tournament
  const handleDeleteResult = async () => {
    try {
      await api.delete(`/tournaments/${tournamentName}/delete_last_result/`); // Send DELETE request to remove last result
      showNotification(
        "success",
        "Success!",
        "Last result deleted successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsDeleteResultModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error deleting result:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete result"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the assign team to result modal
  const showAssignTeamToResultModal = () =>
    setIsAssignTeamToResultModalVisible(true);

  // Handler to assign a team to a tournament result
  const handleAssignTeamToResult = async (values) => {
    try {
      await api.patch(
        `/tournaments/${tournamentName}/assign_team_to_result/`,
        null,
        {
          params: { place: values.place, team_name: values.team_name },
        },
      ); // Send PATCH request to assign team to result
      showNotification(
        "success",
        "Success!",
        "Team assigned to result successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsAssignTeamToResultModalVisible(false); // Close the modal
      assignTeamToResultForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error assigning team to result:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to assign team to result"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Handler to show the remove team from result modal
  const showRemoveTeamFromResultModal = () =>
    setIsRemoveTeamFromResultModalVisible(true);

  // Handler to remove a team from a tournament result
  const handleRemoveTeamFromResult = async (values) => {
    try {
      await api.delete(
        `/tournaments/${tournamentName}/remove_team_from_result/`,
        {
          params: { place: values.place },
        },
      ); // Send DELETE request to remove team from result
      showNotification(
        "success",
        "Success!",
        "Team removed from result successfully!",
      );
      await refreshTournament(); // Refresh tournament data after update
      setIsRemoveTeamFromResultModalVisible(false); // Close the modal
      removeTeamFromResultForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error removing team from result:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to remove team from result"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
    }
  };

  // Generic handler to close modals and reset forms
  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form?.resetFields(); // Reset form fields if form exists
  };

  // Render admin tournament panel UI
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20 max-h-[90vh] overflow-y-auto admin-panel">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Tournament Management (Admin)
      </h2>
      <h3 className="text-lg font-semibold mb-2">Tournament Actions</h3>
      <div className="space-y-4">
        {/* Update Tournament Button */}
        <Button
          onClick={showUpdateModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Update Information
        </Button>

        {/* Update Tournament Modal */}
        <Modal
          title={
            <span className="text-white">Update Tournament Information</span>
          }
          open={isUpdateModalVisible}
          onCancel={() => handleCancel(setIsUpdateModalVisible, updateForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={updateForm}
            onFinish={handleUpdateTournament}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="name"
              label={
                <span className="text-gray-300">
                  Name{" "}
                  <Tooltip title="Enter new tournament name (leave blank to keep unchanged)">
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
                  <Tooltip title="Enter new description (leave blank to keep unchanged)">
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
            <Form.Item
              name="prize"
              label={
                <span className="text-gray-300">
                  Prize Pool{" "}
                  <Tooltip title="Enter new prize pool (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New prize pool (optional)"
              />
            </Form.Item>
            <Form.Item
              name="start_date"
              label={
                <span className="text-gray-300">
                  Start Date{" "}
                  <Tooltip title="Enter new start date (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                type="date"
                className="custom-input"
                placeholder="New start date (optional)"
              />
            </Form.Item>
            <Form.Item
              name="end_date"
              label={
                <span className="text-gray-300">
                  End Date{" "}
                  <Tooltip title="Enter new end date (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                type="date"
                className="custom-input"
                placeholder="New end date (optional)"
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

        {/* Update Status Button */}
        <Button
          onClick={showUpdateStatusModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Update Tournament Status
        </Button>

        {/* Update Status Modal */}
        <Modal
          title={<span className="text-white">Update Tournament Status</span>}
          open={isUpdateStatusModalVisible}
          onCancel={() =>
            handleCancel(setIsUpdateStatusModalVisible, updateStatusForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={updateStatusForm}
            onFinish={handleUpdateStatus}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="tournament_name"
              label={
                <span className="text-gray-300">
                  Tournament Name{" "}
                  <Tooltip title="Tournament name (cannot be changed)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please specify the tournament name",
                },
              ]}
            >
              <Input className="custom-input" disabled />
            </Form.Item>
            <Form.Item
              name="new_status"
              label={
                <span className="text-gray-300">
                  New Status{" "}
                  <Tooltip title="Select the new tournament status">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: "Please select a new status" },
              ]}
            >
              <Select className="custom-select" placeholder="Select status">
                <Option value="SCHEDULED">Scheduled</Option>
                <Option value="IN_PROGRESS">In Progress</Option>
                <Option value="COMPLETED">Completed</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(
                      setIsUpdateStatusModalVisible,
                      updateStatusForm,
                    )
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

        {/* Delete Tournament Button */}
        <Button
          onClick={showDeleteTournamentModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete Tournament
        </Button>

        {/* Delete Tournament Modal */}
        <Modal
          title={<span className="text-white">Delete Tournament</span>}
          open={isDeleteTournamentModalVisible}
          onCancel={() => handleCancel(setIsDeleteTournamentModalVisible, null)}
          footer={null}
          className="custom-modal"
        >
          <p className="text-white">
            Are you sure you want to delete the tournament {tournamentName}?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() =>
                handleCancel(setIsDeleteTournamentModalVisible, null)
              }
              className="text-white border-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTournament}
              className="bg-red-600 hover:!bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </Modal>

        <h3 className="text-lg font-semibold mb-2">Team Management</h3>

        {/* Add Team Button */}
        <Button
          onClick={showAddTeamModal}
          className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Add Team
        </Button>

        {/* Add Team Modal */}
        <Modal
          title={<span className="text-white">Add Team to Tournament</span>}
          open={isAddTeamModalVisible}
          onCancel={() => handleCancel(setIsAddTeamModalVisible, addTeamForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={addTeamForm}
            onFinish={handleAddTeam}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="team_name"
              label={
                <span className="text-gray-300">
                  Team Name{" "}
                  <Tooltip title="Enter the name of the team to add">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: "Please specify the team name" },
              ]}
            >
              <Input className="custom-input" placeholder="Team name" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsAddTeamModalVisible, addTeamForm)
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

        {/* Delete Team Button */}
        <Button
          onClick={showDeleteTeamModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete Team
        </Button>

        {/* Delete Team Modal */}
        <Modal
          title={
            <span className="text-white">Delete Team from Tournament</span>
          }
          open={isDeleteTeamModalVisible}
          onCancel={() =>
            handleCancel(setIsDeleteTeamModalVisible, deleteTeamForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={deleteTeamForm}
            onFinish={handleDeleteTeam}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="team_name"
              label={
                <span className="text-gray-300">
                  Team Name{" "}
                  <Tooltip title="Enter the name of the team to remove">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: "Please specify the team name" },
              ]}
            >
              <Input className="custom-input" placeholder="Team name" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsDeleteTeamModalVisible, deleteTeamForm)
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
                  Delete
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <h3 className="text-lg font-semibold mb-2">Result Management</h3>

        {/* Add Result Button */}
        <Button
          onClick={showAddResultModal}
          className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Add Result
        </Button>

        {/* Add Result Modal */}
        <Modal
          title={<span className="text-white">Add Result</span>}
          open={isAddResultModalVisible}
          onCancel={() =>
            handleCancel(setIsAddResultModalVisible, addResultForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={addResultForm}
            onFinish={handleAddResult}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="place"
              label={
                <span className="text-gray-300">
                  Place{" "}
                  <Tooltip title="Enter the place (e.g., 1, 2, 3)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Please specify the place" }]}
            >
              <Input
                type="number"
                className="custom-input"
                placeholder="Place"
              />
            </Form.Item>
            <Form.Item
              name="prize"
              label={
                <span className="text-gray-300">
                  Prize{" "}
                  <Tooltip title="Enter the prize (e.g., $1000)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Please specify the prize" }]}
            >
              <Input className="custom-input" placeholder="Prize" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsAddResultModalVisible, addResultForm)
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

        {/* Delete Result Button */}
        <Button
          onClick={showDeleteResultModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete Last Result
        </Button>

        {/* Delete Result Modal */}
        <Modal
          title={<span className="text-white">Delete Last Result</span>}
          open={isDeleteResultModalVisible}
          onCancel={() => handleCancel(setIsDeleteResultModalVisible, null)}
          footer={null}
          className="custom-modal"
        >
          <p className="text-white">
            Are you sure you want to delete the last result?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => handleCancel(setIsDeleteResultModalVisible, null)}
              className="text-white border-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteResult}
              className="bg-red-600 hover:!bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </Modal>

        {/* Assign Team to Result Button */}
        <Button
          onClick={showAssignTeamToResultModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Assign Team to Result
        </Button>

        {/* Assign Team to Result Modal */}
        <Modal
          title={<span className="text-white">Assign Team to Result</span>}
          open={isAssignTeamToResultModalVisible}
          onCancel={() =>
            handleCancel(
              setIsAssignTeamToResultModalVisible,
              assignTeamToResultForm,
            )
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={assignTeamToResultForm}
            onFinish={handleAssignTeamToResult}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="place"
              label={
                <span className="text-gray-300">
                  Place{" "}
                  <Tooltip title="Enter the place to assign the team to">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Please specify the place" }]}
            >
              <Input
                type="number"
                className="custom-input"
                placeholder="Place"
              />
            </Form.Item>
            <Form.Item
              name="team_name"
              label={
                <span className="text-gray-300">
                  Team Name{" "}
                  <Tooltip title="Enter the team name">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: "Please specify the team name" },
              ]}
            >
              <Input className="custom-input" placeholder="Team name" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(
                      setIsAssignTeamToResultModalVisible,
                      assignTeamToResultForm,
                    )
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
                  Assign
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Remove Team from Result Button */}
        <Button
          onClick={showRemoveTeamFromResultModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Remove Team from Result
        </Button>

        {/* Remove Team from Result Modal */}
        <Modal
          title={<span className="text-white">Remove Team from Result</span>}
          open={isRemoveTeamFromResultModalVisible}
          onCancel={() =>
            handleCancel(
              setIsRemoveTeamFromResultModalVisible,
              removeTeamFromResultForm,
            )
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={removeTeamFromResultForm}
            onFinish={handleRemoveTeamFromResult}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="place"
              label={
                <span className="text-gray-300">
                  Place{" "}
                  <Tooltip title="Enter the place to remove the team from">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Please specify the place" }]}
            >
              <Input
                type="number"
                className="custom-input"
                placeholder="Place"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(
                      setIsRemoveTeamFromResultModalVisible,
                      removeTeamFromResultForm,
                    )
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
                  Remove
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default AdminTournamentPanel;
