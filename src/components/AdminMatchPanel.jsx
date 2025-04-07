import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Form, Input, InputNumber, Button, Tooltip, Select } from "antd";

import api from "@/api";
import { NotificationContext } from "@/context/NotificationContext";

// AdminMatchPanel component for managing match-related admin functionalities
function AdminMatchPanel({ match_id, setMatch, refreshMatch, match }) {
  const { Option } = Select; // Destructuring Option from Select for dropdown options
  const navigate = useNavigate(); // Hook for programmatic navigation
  const notificationApi = useContext(NotificationContext); // Accessing notification system from context

  // State for controlling visibility of modals
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] =
    useState(false);
  const [isAddFaceitStatsModalVisible, setIsAddFaceitStatsModalVisible] =
    useState(false);
  const [isAddPickBanModalVisible, setIsAddPickBanModalVisible] =
    useState(false);
  const [isAddMapResultModalVisible, setIsAddMapResultModalVisible] =
    useState(false);
  const [isAddStatsManualModalVisible, setIsAddStatsManualModalVisible] =
    useState(false);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState(false);
  const [isDeleteMatchModalVisible, setIsDeleteMatchModalVisible] =
    useState(false);
  const [isDeleteMatchStatsModalVisible, setIsDeleteMatchStatsModalVisible] =
    useState(false);
  const [isDeleteLastStatModalVisible, setIsDeleteLastStatModalVisible] =
    useState(false);
  const [isDeletePickBanModalVisible, setIsDeletePickBanModalVisible] =
    useState(false);
  const [isDeleteMapResultModalVisible, setIsDeleteMapResultModalVisible] =
    useState(false);

  // Form instances for managing form data and validation
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();
  const [addFaceitStatsForm] = Form.useForm();
  const [addPickBanForm] = Form.useForm();
  const [addMapResultForm] = Form.useForm();
  const [addStatsManualForm] = Form.useForm();
  const [updateStatusForm] = Form.useForm();

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handler to show update match modal
  const showUpdateModal = () => setIsUpdateModalVisible(true);

  // Handler to update match information
  const handleUpdateMatchInfo = async (values) => {
    const updatedMatch = {};
    if (values.tournament) updatedMatch.tournament = values.tournament;
    if (values.date) updatedMatch.date = values.date;
    if (values.description) updatedMatch.description = values.description;

    if (Object.keys(updatedMatch).length > 0) {
      try {
        await api.patch(`/matches/${match_id}/`, updatedMatch);
        const response = await api.get(`/matches/${match_id}/`);
        setMatch(response.data);
        refreshMatch();
        showNotification("success", "Success!", "Match updated successfully.");
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
      } catch (error) {
        console.error("Error updating match:", error.response?.data || error);
        const errorDetail =
          error.response?.data?.detail || "Failed to update match";
        showNotification("error", "Error!", errorDetail);
      }
    } else {
      showNotification(
        "error",
        "Error!",
        "At least one field must be filled to update.",
      );
    }
  };

  // Handler to cancel update match modal
  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // Handler to show add team modal
  const showAddTeamModal = () => setIsAddTeamModalVisible(true);

  // Handler to add a team to the match
  const handleAddTeam = async (values) => {
    try {
      await api.patch(`/matches/${match_id}/add_team/${values.teamName}/`);
      showNotification(
        "success",
        "Success!",
        `Team ${values.teamName} added successfully.`,
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddTeamModalVisible(false);
      addTeamForm.resetFields();
    } catch (error) {
      console.error("Error adding team:", error.response?.data || error);
      const errorDetail = error.response?.data?.detail || "Failed to add team";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel add team modal
  const handleAddTeamCancel = () => {
    setIsAddTeamModalVisible(false);
    addTeamForm.resetFields();
  };

  // Handler to show delete team modal
  const showDeleteTeamModal = () => setIsDeleteTeamModalVisible(true);

  // Handler to delete a team from the match
  const handleDeleteTeam = async (values) => {
    try {
      await api.delete(`/matches/${match_id}/delete_team/${values.teamName}/`);
      showNotification(
        "success",
        "Success!",
        `Team ${values.teamName} deleted successfully.`,
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsDeleteTeamModalVisible(false);
      deleteTeamForm.resetFields();
    } catch (error) {
      console.error("Error deleting team:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to delete team";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel delete team modal
  const handleDeleteTeamCancel = () => {
    setIsDeleteTeamModalVisible(false);
    deleteTeamForm.resetFields();
  };

  // Handler to show add Faceit stats modal
  const showAddFaceitStatsModal = () => setIsAddFaceitStatsModalVisible(true);

  // Handler to add Faceit stats to the match
  const handleAddFaceitStats = async (values) => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_faceit_stats/`, null, {
        params: { faceit_url: values.faceitUrl },
      });
      showNotification(
        "success",
        "Success!",
        "Faceit stats added successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddFaceitStatsModalVisible(false);
      addFaceitStatsForm.resetFields();
    } catch (error) {
      console.error(
        "Error adding Faceit stats:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to add Faceit stats";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel add Faceit stats modal
  const handleAddFaceitStatsCancel = () => {
    setIsAddFaceitStatsModalVisible(false);
    addFaceitStatsForm.resetFields();
  };

  // Handler to show add pick/ban modal
  const showAddPickBanModal = () => setIsAddPickBanModalVisible(true);

  // Handler to add pick/ban information to the match
  const handleAddPickBanInfo = async (values) => {
    try {
      await api.patch(
        `/matches/stats/${match_id}/add_pick_ban_info_in_match/`,
        {
          map: values.map,
          map_status: values.mapStatus,
          initiator: values.initiator,
        },
      );
      showNotification("success", "Success!", "Pick/Ban added successfully.");
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddPickBanModalVisible(false);
      addPickBanForm.resetFields();
    } catch (error) {
      console.error("Error adding Pick/Ban:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to add Pick/Ban";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel add pick/ban modal
  const handleAddPickBanCancel = () => {
    setIsAddPickBanModalVisible(false);
    addPickBanForm.resetFields();
  };

  // Handler to delete the last pick/ban entry
  const handleDeletePickBanInfo = async () => {
    try {
      await api.delete(
        `/matches/stats/${match_id}/delete_last_pick_ban_info_from_match/`,
      );
      showNotification(
        "success",
        "Success!",
        "Last Pick/Ban deleted successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error("Error deleting Pick/Ban:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to delete Pick/Ban";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to show add map result modal with validation
  const showAddMapResultModal = () => {
    console.log("match:", match);
    if (!match) {
      showNotification(
        "error",
        "Error!",
        "Match data unavailable. Please refresh the page.",
      );
      return;
    }
    if (!match.teams || match.teams.length < 2) {
      showNotification(
        "error",
        "Error!",
        "Not enough teams in the match. Add teams first.",
      );
      return;
    }
    setIsAddMapResultModalVisible(true);
    addMapResultForm.setFieldsValue({
      firstTeam: match.teams[0],
      secondTeam: match.teams[1],
    });
  };

  // Handler to add map result information to the match
  const handleAddMapResultInfo = async (values) => {
    if (!match?.teams || match.teams.length < 2) {
      showNotification(
        "error",
        "Error!",
        "Not enough teams to add map result.",
      );
      return;
    }
    try {
      await api.patch(
        `/matches/stats/${match_id}/add_map_result_info_in_match/`,
        {
          map: values.map,
          first_team: match.teams[0],
          second_team: match.teams[1],
          first_half_score_first_team: values.firstHalfScoreFirstTeam,
          second_half_score_first_team: values.secondHalfScoreFirstTeam,
          overtime_score_first_team: values.overtimeScoreFirstTeam,
          total_score_first_team: values.totalScoreFirstTeam,
          first_half_score_second_team: values.firstHalfScoreSecondTeam,
          second_half_score_second_team: values.secondHalfScoreSecondTeam,
          overtime_score_second_team: values.overtimeScoreSecondTeam,
          total_score_second_team: values.totalScoreSecondTeam,
        },
      );
      showNotification("success", "Success!", "Map result added successfully.");
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddMapResultModalVisible(false);
      addMapResultForm.resetFields();
    } catch (error) {
      console.error("Error adding map result:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to add map result";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel add map result modal
  const handleAddMapResultCancel = () => {
    setIsAddMapResultModalVisible(false);
    addMapResultForm.resetFields();
  };

  // Handler to delete the last map result entry
  const handleDeleteMapResultInfo = async () => {
    try {
      await api.delete(
        `/matches/stats/${match_id}/delete_last_map_result_info_from_match/`,
      );
      showNotification(
        "success",
        "Success!",
        "Last map result deleted successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error(
        "Error deleting map result:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to delete map result";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to show add manual stats modal
  const showAddStatsManualModal = () => setIsAddStatsManualModalVisible(true);

  // Handler to add manual stats to the match
  const handleAddStatsManual = async (values) => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_stats_manual/`, {
        nickname: values.nickname,
        round_of_match: values.roundOfMatch,
        map: values.map,
        Result: values.result,
        Kills: values.kills,
        Assists: values.assists,
        Deaths: values.deaths,
        ADR: values.adr,
        "Headshots %": values.headshotsPercentage,
      });
      showNotification(
        "success",
        "Success!",
        "Manual stats added successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddStatsManualModalVisible(false);
      addStatsManualForm.resetFields();
    } catch (error) {
      console.error(
        "Error adding manual stats:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to add manual stats";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel add manual stats modal
  const handleAddStatsManualCancel = () => {
    setIsAddStatsManualModalVisible(false);
    addStatsManualForm.resetFields();
  };

  // Handler to delete the last stat entry
  const handleDeleteLastStat = async () => {
    try {
      await api.delete(
        `/matches/stats/${match_id}/delete_last_stat_from_match/`,
      );
      showNotification(
        "success",
        "Success!",
        "Last stat deleted successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error("Error deleting last stat:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to delete last stat";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to delete all match stats
  const handleDeleteMatchStats = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_match_stats/`);
      showNotification(
        "success",
        "Success!",
        "Match stats deleted successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error(
        "Error deleting match stats:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to delete match stats";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to show delete match modal
  const showDeleteMatchModal = () => setIsDeleteMatchModalVisible(true);

  // Handler to delete the match
  const handleDeleteMatch = async () => {
    try {
      await api.delete(`/matches/${match_id}/`);
      showNotification("success", "Success!", "Match deleted successfully.");
      setIsDeleteMatchModalVisible(false);
      navigate("/matches");
    } catch (error) {
      console.error("Error deleting match:", error.response?.data || error);
      const errorDetail =
        error.response?.data?.detail || "Failed to delete match";
      showNotification("error", "Error!", errorDetail);
      setIsDeleteMatchModalVisible(false);
    }
  };

  // Handler to cancel delete match modal
  const handleDeleteMatchCancel = () => setIsDeleteMatchModalVisible(false);

  // Handler to show update status modal
  const showUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(true);
    updateStatusForm.setFieldsValue({ match_id });
  };

  // Handler to update match status
  const handleUpdateStatus = async (values) => {
    try {
      await api.patch(
        `/schedules/matches/${values.match_id}/update_status/`,
        null,
        {
          params: { new_status: values.new_status },
        },
      );
      showNotification(
        "success",
        "Success!",
        "Match status updated successfully.",
      );
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsUpdateStatusModalVisible(false);
      updateStatusForm.resetFields();
    } catch (error) {
      console.error(
        "Error updating match status:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to update match status";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to cancel update status modal
  const handleUpdateStatusCancel = () => {
    setIsUpdateStatusModalVisible(false);
    updateStatusForm.resetFields();
  };

  // Handler to show delete match stats modal
  const showDeleteMatchStatsModal = () =>
    setIsDeleteMatchStatsModalVisible(true);

  // Handler to show delete last stat modal
  const showDeleteLastStatModal = () => setIsDeleteLastStatModalVisible(true);

  // Handler to show delete pick/ban modal
  const showDeletePickBanModal = () => setIsDeletePickBanModalVisible(true);

  // Handler to show delete map result modal
  const showDeleteMapResultModal = () => setIsDeleteMapResultModalVisible(true);

  // Render admin match panel UI
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20 max-h-[90vh] overflow-y-auto admin-panel">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Match Management (Admin)
      </h2>
      <div className="space-y-4">
        {/* Match Actions Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Match Actions</h3>
          <Button
            onClick={showUpdateModal}
            className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Update Match
          </Button>
          <Modal
            title={<span className="text-white">Update Match</span>}
            open={isUpdateModalVisible}
            onCancel={handleUpdateCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={updateForm}
              onFinish={handleUpdateMatchInfo}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="tournament"
                label={
                  <span className="text-gray-300">
                    Tournament{" "}
                    <Tooltip title="Enter new tournament name (leave blank to keep unchanged)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  className="custom-input"
                  placeholder="New tournament (optional)"
                />
              </Form.Item>
              <Form.Item
                name="date"
                label={
                  <span className="text-gray-300">
                    Match Start Date{" "}
                    <Tooltip title="Enter new date and time in ISO format (leave blank to keep unchanged)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  type="date"
                  className="custom-input"
                  placeholder="Match start date"
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <span className="text-gray-300">
                    Description{" "}
                    <Tooltip title="Enter new match description (leave blank to keep unchanged)">
                      <InfoCircleOutlined />
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
                    onClick={handleUpdateCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Update
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showUpdateStatusModal}
            className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Update Match Status
          </Button>
          <Modal
            title={<span className="text-white">Update Match Status</span>}
            open={isUpdateStatusModalVisible}
            onCancel={handleUpdateStatusCancel}
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
                name="match_id"
                label={
                  <span className="text-gray-300">
                    Match ID{" "}
                    <Tooltip title="Match ID (cannot be changed)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify match ID" }]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="new_status"
                label={
                  <span className="text-gray-300">
                    New Status{" "}
                    <Tooltip title="Select new match status">
                      <InfoCircleOutlined />
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
                    onClick={handleUpdateStatusCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Update
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeleteMatchModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete Match
          </Button>
          <Modal
            title={<span className="text-white">Delete Match</span>}
            open={isDeleteMatchModalVisible}
            onCancel={handleDeleteMatchCancel}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">
              Are you sure you want to delete this match?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={handleDeleteMatchCancel}
                className="button text-white border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteMatch}
                type="primary"
                className="button bg-red-600 hover:!bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>

        {/* Matches Manager Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Manager</h3>
          <Button
            onClick={showAddTeamModal}
            className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Add Team
          </Button>
          <Modal
            title={<span className="text-white">Add Team</span>}
            open={isAddTeamModalVisible}
            onCancel={handleAddTeamCancel}
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
                name="teamName"
                label={
                  <span className="text-gray-300">
                    Team Name{" "}
                    <Tooltip title="Enter team name to add to the match">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify team name" },
                ]}
              >
                <Input
                  className="custom-input"
                  placeholder="e.g., Team Liquid"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddTeamCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeleteTeamModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete Team
          </Button>
          <Modal
            title={<span className="text-white">Delete Team</span>}
            open={isDeleteTeamModalVisible}
            onCancel={handleDeleteTeamCancel}
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
                name="teamName"
                label={
                  <span className="text-gray-300">
                    Team Name{" "}
                    <Tooltip title="Enter team name to remove from the match">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify team name" },
                ]}
              >
                <Input
                  className="custom-input"
                  placeholder="e.g., Team Liquid"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleDeleteTeamCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>

        {/* Matches Stats Manager Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Stats Manager</h3>
          <Button
            onClick={showAddFaceitStatsModal}
            className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Add Faceit Stats
          </Button>
          <Modal
            title={<span className="text-white">Add Faceit Stats</span>}
            open={isAddFaceitStatsModalVisible}
            onCancel={handleAddFaceitStatsCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={addFaceitStatsForm}
              onFinish={handleAddFaceitStats}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="faceitUrl"
                label={
                  <span className="text-gray-300">
                    Faceit URL{" "}
                    <Tooltip title="Enter Faceit match URL to fetch stats">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify Faceit URL" },
                ]}
              >
                <Input
                  className="custom-input"
                  placeholder="e.g., https://www.faceit.com/en/match/12345"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddFaceitStatsCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeleteMatchStatsModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete All Match Stats
          </Button>
          <Modal
            title={<span className="text-white">Delete All Match Stats</span>}
            open={isDeleteMatchStatsModalVisible}
            onCancel={() => setIsDeleteMatchStatsModalVisible(false)}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">
              Are you sure you want to delete all stats for this match?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setIsDeleteMatchStatsModalVisible(false)}
                className="button text-white border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteMatchStats}
                type="primary"
                className="button bg-red-600 hover:!bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </Modal>

          <Button
            onClick={showAddStatsManualModal}
            className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Add Manual Stats
          </Button>
          <Modal
            title={<span className="text-white">Add Manual Stats</span>}
            open={isAddStatsManualModalVisible}
            onCancel={handleAddStatsManualCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={addStatsManualForm}
              onFinish={handleAddStatsManual}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="nickname"
                label={
                  <span className="text-gray-300">
                    Player Nickname{" "}
                    <Tooltip title="Enter player nickname">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify player nickname" },
                ]}
              >
                <Input className="custom-input" placeholder="e.g., s1mple" />
              </Form.Item>
              <Form.Item
                name="roundOfMatch"
                label={
                  <span className="text-gray-300">
                    Match Round{" "}
                    <Tooltip title="Enter match round number (e.g., 1 for first map)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify round number" },
                ]}
              >
                <Select
                  className="custom-select"
                  placeholder="Select match round"
                >
                  <Option value={1}>First Map</Option>
                  <Option value={2}>Second Map</Option>
                  <Option value={3}>Third Map</Option>
                  <Option value={4}>Fourth Map</Option>
                  <Option value={5}>Fifth Map</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="map"
                label={
                  <span className="text-gray-300">
                    Map{" "}
                    <Tooltip title="Enter map name (e.g., de_dust2)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify map name" }]}
              >
                <Select className="custom-select" placeholder="Select map">
                  <Option value="Anubis">Anubis</Option>
                  <Option value="Dust2">Dust2</Option>
                  <Option value="Mirage">Mirage</Option>
                  <Option value="Nuke">Nuke</Option>
                  <Option value="Vertigo">Vertigo</Option>
                  <Option value="Ancient">Ancient</Option>
                  <Option value="Inferno">Inferno</Option>
                  <Option value="Train">Train</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="result"
                label={
                  <span className="text-gray-300">
                    Result{" "}
                    <Tooltip title="Specify result (1 for win, 0 for loss)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify result" }]}
              >
                <Select className="custom-select" placeholder="Select result">
                  <Option value={0}>Loss</Option>
                  <Option value={1}>Win</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="kills"
                label={
                  <span className="text-gray-300">
                    Kills{" "}
                    <Tooltip title="Enter number of kills">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify number of kills" },
                ]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 20"
                />
              </Form.Item>
              <Form.Item
                name="assists"
                label={
                  <span className="text-gray-300">
                    Assists{" "}
                    <Tooltip title="Enter number of assists">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please specify number of assists",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 5"
                />
              </Form.Item>
              <Form.Item
                name="deaths"
                label={
                  <span className="text-gray-300">
                    Deaths{" "}
                    <Tooltip title="Enter number of deaths">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please specify number of deaths",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 15"
                />
              </Form.Item>
              <Form.Item
                name="adr"
                label={
                  <span className="text-gray-300">
                    ADR{" "}
                    <Tooltip title="Enter average damage per round">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify ADR" }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  className="custom-input-number w-full"
                  placeholder="e.g., 85.5"
                />
              </Form.Item>
              <Form.Item
                name="headshotsPercentage"
                label={
                  <span className="text-gray-300">
                    Headshots %{" "}
                    <Tooltip title="Enter headshots percentage (0-100)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please specify headshots percentage",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  className="custom-input-number w-full"
                  placeholder="e.g., 40"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddStatsManualCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeleteLastStatModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete Last Stat
          </Button>
          <Modal
            title={<span className="text-white">Delete Last Stat</span>}
            open={isDeleteLastStatModalVisible}
            onCancel={() => setIsDeleteLastStatModalVisible(false)}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">
              Are you sure you want to delete the last added stat?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setIsDeleteLastStatModalVisible(false)}
                className="button text-white border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteLastStat}
                type="primary"
                className="button bg-red-600 hover:!bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>

        {/* Matches Info Manager Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Info Manager</h3>
          <Button
            onClick={showAddPickBanModal}
            className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Add Pick/Ban
          </Button>
          <Modal
            title={<span className="text-white">Add Pick/Ban</span>}
            open={isAddPickBanModalVisible}
            onCancel={handleAddPickBanCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={addPickBanForm}
              onFinish={handleAddPickBanInfo}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="map"
                label={
                  <span className="text-gray-300">
                    Map{" "}
                    <Tooltip title="Enter map name (e.g., Anubis)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify map name" }]}
              >
                <Select className="custom-select" placeholder="Select map">
                  <Option value="Anubis">Anubis</Option>
                  <Option value="Dust2">Dust2</Option>
                  <Option value="Mirage">Mirage</Option>
                  <Option value="Nuke">Nuke</Option>
                  <Option value="Vertigo">Vertigo</Option>
                  <Option value="Ancient">Ancient</Option>
                  <Option value="Inferno">Inferno</Option>
                  <Option value="Train">Train</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="mapStatus"
                label={
                  <span className="text-gray-300">
                    Map Status{" "}
                    <Tooltip title="Specify map status (e.g., Banned or Picked)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify map status" },
                ]}
              >
                <Select
                  className="custom-select"
                  placeholder="Select map status"
                >
                  <Option value="Banned">Banned</Option>
                  <Option value="Picked">Picked</Option>
                  <Option value="Default">Default</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="initiator"
                label={
                  <span className="text-gray-300">
                    Initiator{" "}
                    <Tooltip title="Specify which team initiated the action (e.g., first_team)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify initiator" },
                ]}
              >
                <Select
                  className="custom-select"
                  placeholder="Select initiator"
                >
                  {match?.teams?.[0] && (
                    <Option value={match.teams[0]}>{match.teams[0]}</Option>
                  )}
                  {match?.teams?.[1] && (
                    <Option value={match.teams[1]}>{match.teams[1]}</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddPickBanCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeletePickBanModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete Last Pick/Ban
          </Button>
          <Modal
            title={<span className="text-white">Delete Last Pick/Ban</span>}
            open={isDeletePickBanModalVisible}
            onCancel={() => setIsDeletePickBanModalVisible(false)}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">
              Are you sure you want to delete the last Pick/Ban for this match?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setIsDeletePickBanModalVisible(false)}
                className="button text-white border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeletePickBanInfo}
                type="primary"
                className="button bg-red-600 hover:!bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </Modal>

          <Button
            onClick={showAddMapResultModal}
            className="bg-green-600 hover:!bg-green-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Add Map Result
          </Button>
          <Modal
            title={<span className="text-white">Add Map Result</span>}
            open={isAddMapResultModalVisible}
            onCancel={handleAddMapResultCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={addMapResultForm}
              onFinish={handleAddMapResultInfo}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="map"
                label={
                  <span className="text-gray-300">
                    Map{" "}
                    <Tooltip title="Select map from the list">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please select a map" }]}
              >
                <Select className="custom-select" placeholder="Select map">
                  <Option value="Anubis">Anubis</Option>
                  <Option value="Dust2">Dust2</Option>
                  <Option value="Mirage">Mirage</Option>
                  <Option value="Nuke">Nuke</Option>
                  <Option value="Vertigo">Vertigo</Option>
                  <Option value="Ancient">Ancient</Option>
                  <Option value="Inferno">Inferno</Option>
                  <Option value="Train">Train</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="firstTeam"
                label={
                  <span className="text-gray-300">
                    First Team (Left){" "}
                    <Tooltip title="First team from match data (cannot be changed)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "First team is missing from match data",
                  },
                ]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="secondTeam"
                label={
                  <span className="text-gray-300">
                    Second Team (Right){" "}
                    <Tooltip title="Second team from match data (cannot be changed)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Second team is missing from match data",
                  },
                ]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="firstHalfScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    First Team First Half Score{" "}
                    <Tooltip title="Enter first team’s score in first half">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 4"
                />
              </Form.Item>
              <Form.Item
                name="firstHalfScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Second Team First Half Score{" "}
                    <Tooltip title="Enter second team’s score in first half">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 8"
                />
              </Form.Item>
              <Form.Item
                name="secondHalfScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    First Team Second Half Score{" "}
                    <Tooltip title="Enter first team’s score in second half">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 3"
                />
              </Form.Item>
              <Form.Item
                name="secondHalfScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Second Team Second Half Score{" "}
                    <Tooltip title="Enter second team’s score in second half">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 5"
                />
              </Form.Item>
              <Form.Item
                name="overtimeScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    First Team Overtime Score{" "}
                    <Tooltip title="Enter first team’s score in overtime (0 if no overtime)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 0"
                />
              </Form.Item>
              <Form.Item
                name="overtimeScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Second Team Overtime Score{" "}
                    <Tooltip title="Enter second team’s score in overtime (0 if no overtime)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please specify score" }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 0"
                />
              </Form.Item>
              <Form.Item
                name="totalScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    First Team Total Score{" "}
                    <Tooltip title="Enter first team’s total score">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify total score" },
                ]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 7"
                />
              </Form.Item>
              <Form.Item
                name="totalScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Second Team Total Score{" "}
                    <Tooltip title="Enter second team’s total score">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify total score" },
                ]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="e.g., 13"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddMapResultCancel}
                    className="button text-white border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button bg-blue-600 hover:!bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            onClick={showDeleteMapResultModal}
            className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500 mb-2"
          >
            Delete Last Result
          </Button>
          <Modal
            title={<span className="text-white">Delete Last Result</span>}
            open={isDeleteMapResultModalVisible}
            onCancel={() => setIsDeleteMapResultModalVisible(false)}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">
              Are you sure you want to delete the last map result?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setIsDeleteMapResultModalVisible(false)}
                className="button text-white border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteMapResultInfo}
                type="primary"
                className="button bg-red-600 hover:!bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchPanel;
