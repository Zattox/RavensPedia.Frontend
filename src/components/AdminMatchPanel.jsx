// src/components/AdminMatchPanel.jsx
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate для перенаправления
import api from '@/api';

function AdminMatchPanel({ match_id, setMatch }) {
  const navigate = useNavigate(); // Для перенаправления после удаления

  const handleAddTeam = async (teamName) => {
    try {
      await api.patch(`/matches/${match_id}/add_team/${teamName}/`);
      alert(`Team ${teamName} added successfully`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error adding team:', error.response?.data || error);
      alert('Failed to add team');
    }
  };

  const handleDeleteTeam = async (teamName) => {
    try {
      await api.delete(`/matches/${match_id}/delete_team/${teamName}/`);
      alert(`Team ${teamName} deleted successfully`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error deleting team:', error.response?.data || error);
      alert('Failed to delete team');
    }
  };

  const handleAddFaceitStats = async () => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_faceit_stats/`);
      alert('Faceit stats added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error adding Faceit stats:', error.response?.data || error);
      alert('Failed to add Faceit stats');
    }
  };

  const handleDeleteMatchStats = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_match_stats/`);
      alert('Match stats deleted successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error deleting match stats:', error.response?.data || error);
      alert('Failed to delete match stats');
    }
  };

  const handleAddStatsManual = async () => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_stats_manual/`);
      alert('Manual stats added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error adding manual stats:', error.response?.data || error);
      alert('Failed to add manual stats');
    }
  };

  const handleAddPickBanInfo = async () => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_pick_ban_info_in_match/`);
      alert('Pick/ban info added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error adding pick/ban info:', error.response?.data || error);
      alert('Failed to add pick/ban info');
    }
  };

  const handleDeletePickBanInfo = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_last_pick_ban_info_from_match/`);
      alert('Last pick/ban info deleted successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error deleting pick/ban info:', error.response?.data || error);
      alert('Failed to delete pick/ban info');
    }
  };

  const handleAddMapResultInfo = async () => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_map_result_info_in_match/`);
      alert('Map result info added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error adding map result info:', error.response?.data || error);
      alert('Failed to add map result info');
    }
  };

  const handleDeleteMapResultInfo = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_last_map_result_info_from_match/`);
      alert('Last map result info deleted successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error deleting map result info:', error.response?.data || error);
      alert('Failed to delete map result info');
    }
  };

  const handleUpdateMatchInfo = async () => {
    const tournament = prompt('Enter tournament name:', '');
    const date = prompt('Enter date (YYYY-MM-DDTHH:MM:SSZ):', '');
    const description = prompt('Enter description:', '');

    try {
      await api.patch(`/matches/${match_id}/`, {
        tournament,
        date,
        description,
      });
      alert('Match info updated successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error updating match info:', error.response?.data || error);
      alert('Failed to update match info');
    }
  };

  const handleDeleteMatch = async () => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/matches/${match_id}/`);
        alert('Match deleted successfully');
        navigate('/matches'); // Используем navigate вместо window.location.href
      } catch (error) {
        console.error('Error deleting match:', error.response?.data || error);
        alert('Failed to delete match');
      }
    }
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Управление матчем (Админ)</h2>
      <div className="space-y-4">
        {/* Match Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Match Actions</h3>
          <button
            onClick={handleUpdateMatchInfo}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded mb-2 w-full"
          >
            Обновить матч
          </button>
          <button
            onClick={handleDeleteMatch}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
          >
            Удалить матч
          </button>
        </div>

        {/* Matches Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Manager</h3>
          <button
            onClick={() => handleAddTeam(prompt('Enter team name:'))}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded mb-2 w-full"
          >
            Добавить команду
          </button>
          <button
            onClick={() => handleDeleteTeam(prompt('Enter team name to delete:'))}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
          >
            Удалить команду
          </button>
        </div>

        {/* Matches Stats Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Stats Manager</h3>
          <button
            onClick={handleAddFaceitStats}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded mb-2 w-full"
          >
            Добавить Faceit статистику
          </button>
          <button
            onClick={handleDeleteMatchStats}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded mb-2 w-full"
          >
            Удалить статистику матча
          </button>
          <button
            onClick={handleAddStatsManual}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
          >
            Добавить статистику вручную
          </button>
        </div>

        {/* Matches Info Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Info Manager</h3>
          <button
            onClick={handleAddPickBanInfo}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded mb-2 w-full"
          >
            Добавить Pick/Ban
          </button>
          <button
            onClick={handleDeletePickBanInfo}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded mb-2 w-full"
          >
            Удалить последний Pick/Ban
          </button>
          <button
            onClick={handleAddMapResultInfo}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded mb-2 w-full"
          >
            Добавить результат карты
          </button>
          <button
            onClick={handleDeleteMapResultInfo}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
          >
            Удалить последний результат карты
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchPanel;