import { useState, useContext } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { NotificationContext } from "@/context/NotificationContext";

// AdminMainPanel component for managing admin functionalities like creating news, matches, players, teams, and tournaments
function AdminMainPanel({ setNewsData, refreshNewsData }) {
  // Destructuring props to update news data and refresh it
  const { isAdmin } = useAuth(); // Accessing admin status from AuthContext
  const notificationApi = useContext(NotificationContext); // Accessing notification system from NotificationContext

  // State for controlling visibility of modals
  const [isNewsModalVisible, setIsNewsModalVisible] = useState(false);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);
  const [isTournamentModalVisible, setIsTournamentModalVisible] =
    useState(false);

  // Form instances for managing form data and validation
  const [newsForm] = Form.useForm();
  const [matchForm] = Form.useForm();
  const [playerForm] = Form.useForm();
  const [teamForm] = Form.useForm();
  const [tournamentForm] = Form.useForm();

  // State for tracking loading status of various actions
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingPlayersElo, setLoadingPlayersElo] = useState(false);
  const [loadingTeamsElo, setLoadingTeamsElo] = useState(false);
  const [loadingMatchesStatuses, setLoadingMatchesStatuses] = useState(false);
  const [loadingTournamentsStatuses, setLoadingTournamentsStatuses] =
    useState(false);

  // If user is not an admin, render nothing
  if (!isAdmin) return null;

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // News modal handlers
  const showNewsModal = () => setIsNewsModalVisible(true);

  const handleCreateNews = async (values) => {
    setLoadingNews(true); // Set loading state to true during API call
    try {
      // Send POST request to create a new news item
      await api.post("/news/", {
        title: values.title,
        content: values.content,
        author: values.author,
      });
      // Fetch updated news data after creation
      const updatedNews = await api.get("/news/");
      setNewsData(updatedNews.data); // Update parent component state
      refreshNewsData(); // Trigger refresh of news data
      newsForm.resetFields(); // Clear form fields
      showNotification("success", "Success!", "News created successfully!");
      setIsNewsModalVisible(false); // Close modal
    } catch (error) {
      console.error("Error creating news:", error);
      const errorDetail =
        error.response?.data?.detail || "Failed to create news";
      showNotification("error", "Error!", errorDetail);
    } finally {
      setLoadingNews(false); // Reset loading state
    }
  };

  // Match modal handlers
  const showMatchModal = () => setIsMatchModalVisible(true);

  const handleCreateMatch = async (values) => {
    try {
      // Send POST request to create a new match
      await api.post("/matches/", {
        best_of: values.best_of,
        max_number_of_teams: 2, // Fixed value for matches
        max_number_of_players: 10, // Fixed value for matches
        tournament: values.tournament,
        date: values.date,
        description: values.description,
      });
      showNotification("success", "Success!", "Match created successfully!");
      setIsMatchModalVisible(false); // Close modal
      matchForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error creating match:", error);
      const errorDetail =
        error.response?.data?.detail || "Failed to create match";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Player modal handlers
  const showPlayerModal = () => setIsPlayerModalVisible(true);

  const handleCreatePlayer = async (values) => {
    try {
      // Send POST request to create a new player
      await api.post("/players/", {
        steam_id: values.steam_id,
        nickname: values.nickname,
        name: values.name || undefined, // Optional field
        surname: values.surname || undefined, // Optional field
      });
      showNotification("success", "Success!", "Player created successfully!");
      setIsPlayerModalVisible(false); // Close modal
      playerForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error creating player:", error);
      const errorDetail =
        error.response?.data?.detail || "Failed to create player";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Team modal handlers
  const showTeamModal = () => setIsTeamModalVisible(true);

  const handleCreateTeam = async (values) => {
    try {
      // Send POST request to create a new team
      await api.post("/teams/", {
        max_number_of_players: 10, // Fixed value for teams
        name: values.name,
        description: values.description || undefined, // Optional field
      });
      showNotification("success", "Success!", "Team created successfully!");
      setIsTeamModalVisible(false); // Close modal
      teamForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error creating team:", error);
      const errorDetail =
        error.response?.data?.detail || "Failed to create team";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Tournament modal handlers
  const showTournamentModal = () => setIsTournamentModalVisible(true);

  const handleCreateTournament = async (values) => {
    try {
      // Send POST request to create a new tournament
      await api.post("/tournaments/", {
        max_count_of_teams: values.max_count_of_teams,
        name: values.name,
        prize: values.prize || undefined, // Optional field
        description: values.description || undefined, // Optional field
        start_date: values.start_date,
        end_date: values.end_date,
      });
      showNotification(
        "success",
        "Success!",
        "Tournament created successfully!",
      );
      setIsTournamentModalVisible(false); // Close modal
      tournamentForm.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error creating tournament:", error);
      const errorDetail =
        error.response?.data?.detail || "Failed to create tournament";
      showNotification("error", "Error!", errorDetail);
    }
  };

  // Handler to update Faceit ELO for players
  const handleUpdatePlayersFaceitElo = async () => {
    setLoadingPlayersElo(true); // Set loading state
    try {
      await api.patch("/players/update_faceit_elo/");
      showNotification("success", "Success!", "Players Faceit ELO updated.");
    } catch (error) {
      console.error(
        "Error updating players Faceit ELO:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to update players Faceit ELO";
      showNotification("error", "Error!", errorDetail);
    } finally {
      setLoadingPlayersElo(false); // Reset loading state
    }
  };

  // Handler to update Faceit ELO for teams
  const handleUpdateTeamsFaceitElo = async () => {
    setLoadingTeamsElo(true); // Set loading state
    try {
      await api.patch("/teams/update_team_faceit_elo/");
      showNotification("success", "Success!", "Teams Faceit ELO updated.");
    } catch (error) {
      console.error(
        "Error updating teams Faceit ELO:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to update teams Faceit ELO";
      showNotification("error", "Error!", errorDetail);
    } finally {
      setLoadingTeamsElo(false); // Reset loading state
    }
  };

  // Handler to update match statuses
  const handleUpdateMatchesStatuses = async () => {
    setLoadingMatchesStatuses(true); // Set loading state
    try {
      await api.patch("/schedules/matches/update_statuses/");
      showNotification("success", "Success!", "Match statuses updated.");
    } catch (error) {
      console.error(
        "Error updating match statuses:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to update match statuses";
      showNotification("error", "Error!", errorDetail);
    } finally {
      setLoadingMatchesStatuses(false); // Reset loading state
    }
  };

  // Handler to update tournament statuses
  const handleUpdateTournamentsStatuses = async () => {
    setLoadingTournamentsStatuses(true); // Set loading state
    try {
      await api.patch("/schedules/tournaments/update_statuses/");
      showNotification("success", "Success!", "Tournament statuses updated.");
    } catch (error) {
      console.error(
        "Error updating tournament statuses:",
        error.response?.data || error,
      );
      const errorDetail =
        error.response?.data?.detail || "Failed to update tournament statuses";
      showNotification("error", "Error!", errorDetail);
    } finally {
      setLoadingTournamentsStatuses(false); // Reset loading state
    }
  };

  // Generic handler to close modals and reset forms
  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form.resetFields();
  };

  // JSX rendering of the admin panel
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>
      <div className="space-y-4">
        {/* News Button and Modal */}
        <Button
          onClick={showNewsModal}
          loading={loadingNews}
          className="text-white font-bold bg-green-600 hover:!bg-green-700 px-3 py-5 w-full border border-gray-500"
        >
          Add News
        </Button>
        <Modal
          title={<span className="text-white">Create New News</span>}
          open={isNewsModalVisible}
          onCancel={() => handleCancel(setIsNewsModalVisible, newsForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={newsForm}
            onFinish={handleCreateNews}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="title"
              label={<span className="text-gray-300">Title</span>}
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input
                className="custom-input"
                placeholder="e.g., Media: m0NESY set to join Falcons in blockbuster move"
              />
            </Form.Item>
            <Form.Item
              name="content"
              label={<span className="text-gray-300">Content</span>}
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="e.g., It feels amazing..."
              />
            </Form.Item>
            <Form.Item
              name="author"
              label={<span className="text-gray-300">Author</span>}
              rules={[{ required: true, message: "Please enter an author" }]}
            >
              <Input className="custom-input" placeholder="e.g., MIRAA" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleCancel(setIsNewsModalVisible, newsForm)}
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  loading={loadingNews}
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Match Button and Modal */}
        <Button
          onClick={showMatchModal}
          className="text-white font-bold bg-green-600 hover:!bg-green-700 px-3 py-5 w-full border border-gray-500"
        >
          Add Match
        </Button>
        <Modal
          title={<span className="text-white">Create New Match</span>}
          open={isMatchModalVisible}
          onCancel={() => handleCancel(setIsMatchModalVisible, matchForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={matchForm}
            onFinish={handleCreateMatch}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="best_of"
              label={<span className="text-gray-300">Best of</span>}
              rules={[{ required: true, message: "Please select best of" }]}
            >
              <Select
                className="custom-select"
                placeholder="Select max number of match maps"
                options={[
                  { value: 1, label: "Best of 1" },
                  { value: 2, label: "Best of 2" },
                  { value: 3, label: "Best of 3" },
                  { value: 5, label: "Best of 5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="tournament"
              label={<span className="text-gray-300">Tournament</span>}
              rules={[{ required: true, message: "Please enter a tournament" }]}
            >
              <Input
                className="custom-input"
                placeholder="e.g., ESL Pro League"
              />
            </Form.Item>
            <Form.Item
              name="date"
              label={<span className="text-gray-300">Date</span>}
              rules={[{ required: true, message: "Please enter a date" }]}
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
                <span className="text-gray-300">Description (optional)</span>
              }
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="e.g., Tournament final..."
              />
            </Form.Item>
            {/* Hidden fields for max_number_of_teams and max_number_of_players */}
            <Form.Item name="max_number_of_teams" hidden initialValue={2}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="max_number_of_players" hidden initialValue={10}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsMatchModalVisible, matchForm)
                  }
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Player Button and Modal */}
        <Button
          onClick={showPlayerModal}
          className="text-white font-bold bg-green-600 hover:!bg-green-700 px-3 py-5 w-full border border-gray-500"
        >
          Add Player
        </Button>
        <Modal
          title={<span className="text-white">Create New Player</span>}
          open={isPlayerModalVisible}
          onCancel={() => handleCancel(setIsPlayerModalVisible, playerForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={playerForm}
            onFinish={handleCreatePlayer}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="steam_id"
              label={<span className="text-gray-300">Steam ID</span>}
              rules={[{ required: true, message: "Please enter a Steam ID" }]}
            >
              <Input
                className="custom-input"
                placeholder="e.g., 76561199043678160"
              />
            </Form.Item>
            <Form.Item
              name="nickname"
              label={<span className="text-gray-300">Nickname</span>}
              rules={[{ required: true, message: "Please enter a nickname" }]}
            >
              <Input className="custom-input" placeholder="e.g., s1mple" />
            </Form.Item>
            <Form.Item
              name="name"
              label={<span className="text-gray-300">Name (optional)</span>}
            >
              <Input className="custom-input" placeholder="e.g., Alexander" />
            </Form.Item>
            <Form.Item
              name="surname"
              label={<span className="text-gray-300">Surname (optional)</span>}
            >
              <Input className="custom-input" placeholder="e.g., Kostylov" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsPlayerModalVisible, playerForm)
                  }
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Team Button and Modal */}
        <Button
          onClick={showTeamModal}
          className="text-white font-bold bg-green-600 hover:!bg-green-700 px-3 py-5 w-full border border-gray-500"
        >
          Add Team
        </Button>
        <Modal
          title={<span className="text-white">Create New Team</span>}
          open={isTeamModalVisible}
          onCancel={() => handleCancel(setIsTeamModalVisible, teamForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={teamForm}
            onFinish={handleCreateTeam}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="name"
              label={<span className="text-gray-300">Name</span>}
              rules={[{ required: true, message: "Please enter a team name" }]}
            >
              <Input className="custom-input" placeholder="e.g., Team Spirit" />
            </Form.Item>
            <Form.Item
              name="description"
              label={
                <span className="text-gray-300">Description (optional)</span>
              }
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="e.g., Esports team..."
              />
            </Form.Item>
            <Form.Item name="max_number_of_players" hidden initialValue={10}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleCancel(setIsTeamModalVisible, teamForm)}
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Tournament Button and Modal */}
        <Button
          onClick={showTournamentModal}
          className="text-white font-bold bg-green-600 hover:!bg-green-700 px-3 py-5 w-full border border-gray-500"
        >
          Add Tournament
        </Button>
        <Modal
          title={<span className="text-white">Create New Tournament</span>}
          open={isTournamentModalVisible}
          onCancel={() =>
            handleCancel(setIsTournamentModalVisible, tournamentForm)
          }
          footer={null}
          className="custom-modal"
        >
          <Form
            form={tournamentForm}
            onFinish={handleCreateTournament}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="max_count_of_teams"
              label={<span className="text-gray-300">Max Teams</span>}
              rules={[{ required: true, message: "Please enter max teams" }]}
            >
              <InputNumber
                min={2}
                className="w-full custom-input-number"
                placeholder="e.g., 16"
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={<span className="text-gray-300">Name</span>}
              rules={[
                { required: true, message: "Please enter a tournament name" },
              ]}
            >
              <Input
                className="custom-input"
                placeholder="e.g., ESL Pro League"
              />
            </Form.Item>
            <Form.Item
              name="start_date"
              label={<span className="text-gray-300">Start Date</span>}
              rules={[{ required: true, message: "Please enter a start date" }]}
            >
              <Input
                type="date"
                className="custom-input"
                placeholder="Tournament start date"
              />
            </Form.Item>
            <Form.Item
              name="end_date"
              label={<span className="text-gray-300">End Date</span>}
              rules={[{ required: true, message: "Please enter an end date" }]}
            >
              <Input
                type="date"
                className="custom-input"
                placeholder="Tournament end date"
              />
            </Form.Item>
            <Form.Item
              name="prize"
              label={
                <span className="text-gray-300">Prize Pool (optional)</span>
              }
            >
              <Input className="custom-input" placeholder="e.g., $100,000" />
            </Form.Item>
            <Form.Item
              name="description"
              label={
                <span className="text-gray-300">Description (optional)</span>
              }
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="e.g., International tournament..."
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() =>
                    handleCancel(setIsTournamentModalVisible, tournamentForm)
                  }
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Data Update Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Data Updates</h3>
          <Button
            onClick={handleUpdatePlayersFaceitElo}
            loading={loadingPlayersElo}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Update Players Faceit ELO
          </Button>
          <Button
            onClick={handleUpdateTeamsFaceitElo}
            loading={loadingTeamsElo}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Update Teams Faceit ELO
          </Button>
          <Button
            onClick={handleUpdateMatchesStatuses}
            loading={loadingMatchesStatuses}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Update Match Statuses
          </Button>
          <Button
            onClick={handleUpdateTournamentsStatuses}
            loading={loadingTournamentsStatuses}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Update Tournament Statuses
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminMainPanel;
