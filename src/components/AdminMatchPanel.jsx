// src/components/AdminMatchPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, InputNumber, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';

function AdminMatchPanel({ match_id, setMatch }) {
  const navigate = useNavigate();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] = useState(false);
  const [isAddFaceitStatsModalVisible, setIsAddFaceitStatsModalVisible] = useState(false);
  const [isAddPickBanModalVisible, setIsAddPickBanModalVisible] = useState(false);
  const [isAddMapResultModalVisible, setIsAddMapResultModalVisible] = useState(false);
  const [isAddStatsManualModalVisible, setIsAddStatsManualModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();
  const [addFaceitStatsForm] = Form.useForm();
  const [addPickBanForm] = Form.useForm();
  const [addMapResultForm] = Form.useForm();
  const [addStatsManualForm] = Form.useForm();

  // Обновить матч
  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdateMatchInfo = async (values) => {
    const updatedMatch = {};
    if (values.tournament) updatedMatch.tournament = values.tournament;
    if (values.date) updatedMatch.date = values.date;
    if (values.description) updatedMatch.description = values.description;

    if (Object.keys(updatedMatch).length > 0) {
      try {
        await api.patch(`/matches/${match_id}/`, updatedMatch);
        alert('Match info updated successfully');
        const response = await api.get(`/matches/${match_id}/`);
        setMatch(response.data);
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
      } catch (error) {
        console.error('Error updating match info:', error.response?.data || error);
        alert('Failed to update match info');
      }
    } else {
      alert('Хотя бы одно поле должно быть заполнено для обновления.');
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // Добавить команду
  const showAddTeamModal = () => {
    setIsAddTeamModalVisible(true);
  };

  const handleAddTeam = async (values) => {
    try {
      await api.patch(`/matches/${match_id}/add_team/${values.teamName}/`);
      alert(`Team ${values.teamName} added successfully`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsAddTeamModalVisible(false);
      addTeamForm.resetFields();
    } catch (error) {
      console.error('Error adding team:', error.response?.data || error);
      alert('Failed to add team');
    }
  };

  const handleAddTeamCancel = () => {
    setIsAddTeamModalVisible(false);
    addTeamForm.resetFields();
  };

  // Удалить команду
  const showDeleteTeamModal = () => {
    setIsDeleteTeamModalVisible(true);
  };

  const handleDeleteTeam = async (values) => {
    try {
      await api.delete(`/matches/${match_id}/delete_team/${values.teamName}/`);
      alert(`Team ${values.teamName} deleted successfully`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsDeleteTeamModalVisible(false);
      deleteTeamForm.resetFields();
    } catch (error) {
      console.error('Error deleting team:', error.response?.data || error);
      alert('Failed to delete team');
    }
  };

  const handleDeleteTeamCancel = () => {
    setIsDeleteTeamModalVisible(false);
    deleteTeamForm.resetFields();
  };

  // Добавить Faceit статистику
  const showAddFaceitStatsModal = () => {
    setIsAddFaceitStatsModalVisible(true);
  };

  const handleAddFaceitStats = async (values) => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_faceit_stats/`, null, {
        params: { faceit_url: values.faceitUrl },
      });
      alert('Faceit stats added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsAddFaceitStatsModalVisible(false);
      addFaceitStatsForm.resetFields();
    } catch (error) {
      console.error('Error adding Faceit stats:', error.response?.data || error);
      alert('Failed to add Faceit stats');
    }
  };

  const handleAddFaceitStatsCancel = () => {
    setIsAddFaceitStatsModalVisible(false);
    addFaceitStatsForm.resetFields();
  };

  // Добавить Pick/Ban
  const showAddPickBanModal = () => {
    setIsAddPickBanModalVisible(true);
  };

  const handleAddPickBanInfo = async (values) => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_pick_ban_info_in_match/`, {
        map: values.map,
        map_status: values.mapStatus,
        initiator: values.initiator,
      });
      alert('Pick/ban info added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsAddPickBanModalVisible(false);
      addPickBanForm.resetFields();
    } catch (error) {
      console.error('Error adding pick/ban info:', error.response?.data || error);
      alert('Failed to add pick/ban info');
    }
  };

  const handleAddPickBanCancel = () => {
    setIsAddPickBanModalVisible(false);
    addPickBanForm.resetFields();
  };

  // Удалить последний Pick/Ban
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

  // Добавить результат карты
  const showAddMapResultModal = () => {
    setIsAddMapResultModalVisible(true);
  };

  const handleAddMapResultInfo = async (values) => {
    try {
      await api.patch(`/matches/stats/${match_id}/add_map_result_info_in_match/`, {
        map: values.map,
        first_team: values.firstTeam,
        second_team: values.secondTeam,
        first_half_score_first_team: values.firstHalfScoreFirstTeam,
        first_half_score_second_team: values.firstHalfScoreSecondTeam,
        overtime_score_first_team: values.overtimeScoreFirstTeam,
        overtime_score_second_team: values.overtimeScoreSecondTeam,
        total_score_first_team: values.totalScoreFirstTeam,
        total_score_second_team: values.totalScoreSecondTeam,
      });
      alert('Map result info added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsAddMapResultModalVisible(false);
      addMapResultForm.resetFields();
    } catch (error) {
      console.error('Error adding map result info:', error.response?.data || error);
      alert('Failed to add map result info');
    }
  };

  const handleAddMapResultCancel = () => {
    setIsAddMapResultModalVisible(false);
    addMapResultForm.resetFields();
  };

  // Удалить последний результат карты
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

  // Добавить статистику вручную (по одному игроку)
  const showAddStatsManualModal = () => {
    setIsAddStatsManualModalVisible(true);
  };

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
      alert('Manual stats added successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      setIsAddStatsManualModalVisible(false);
      addStatsManualForm.resetFields();
    } catch (error) {
      console.error('Error adding manual stats:', error.response?.data || error);
      alert('Failed to add manual stats');
    }
  };

  const handleAddStatsManualCancel = () => {
    setIsAddStatsManualModalVisible(false);
    addStatsManualForm.resetFields();
  };

  // Удалить последнюю статистику
  const handleDeleteLastStat = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_last_stat_from_match/`);
      alert('Last stat deleted successfully');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error deleting last stat:', error.response?.data || error);
      alert('Failed to delete last stat');
    }
  };

  // Удалить статистику матча
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

  const handleDeleteMatch = async () => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/matches/${match_id}/`);
        alert('Match deleted successfully');
        navigate('/matches');
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
            onClick={showUpdateModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Обновить матч
          </button>

          <Modal
            title={<span className="text-white">Обновить матч</span>}
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
                    Турнир{' '}
                    <Tooltip title="Введите новое название турнира (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  className="custom-input"
                  placeholder="Новый турнир (необязательно)"
                />
              </Form.Item>
              <Form.Item
                name="date"
                label={
                  <span className="text-gray-300">
                    Дата (YYYY-MM-DDTHH:MM:SSZ){' '}
                    <Tooltip title="Введите новую дату и время матча в формате ISO (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  className="custom-input"
                  placeholder="Новая дата (необязательно)"
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <span className="text-gray-300">
                    Описание{' '}
                    <Tooltip title="Введите новое описание матча (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input.TextArea
                  rows={4}
                  className="custom-textarea"
                  placeholder="Новое описание (необязательно)"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleUpdateCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Обновить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={handleDeleteMatch}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить матч
          </button>
        </div>

        {/* Matches Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Manager</h3>
          <button
            onClick={showAddTeamModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить команду
          </button>

          <Modal
            title={<span className="text-white">Добавить команду</span>}
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
                    Название команды{' '}
                    <Tooltip title="Введите название команды для добавления в матч">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название команды' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, Team Liquid"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddTeamCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={showDeleteTeamModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить команду
          </button>

          <Modal
            title={<span className="text-white">Удалить команду</span>}
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
                    Название команды{' '}
                    <Tooltip title="Введите название команды для удаления из матча">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название команды' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, Team Liquid"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleDeleteTeamCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Удалить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>

        {/* Matches Stats Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Stats Manager</h3>
          <button
            onClick={showAddFaceitStatsModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить Faceit статистику
          </button>

          <Modal
            title={<span className="text-white">Добавить Faceit статистику</span>}
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
                    Faceit URL{' '}
                    <Tooltip title="Введите URL матча на Faceit для получения статистики">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите Faceit URL' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, https://www.faceit.com/en/match/12345"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddFaceitStatsCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={handleDeleteMatchStats}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Удалить статистику матча
          </button>

          <button
            onClick={showAddStatsManualModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить статистику вручную
          </button>

          <Modal
            title={<span className="text-white">Добавить статистику вручную</span>}
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
                    Никнейм игрока{' '}
                    <Tooltip title="Введите никнейм игрока">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите никнейм игрока' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, s1mple"
                />
              </Form.Item>
              <Form.Item
                name="roundOfMatch"
                label={
                  <span className="text-gray-300">
                    Раунд матча{' '}
                    <Tooltip title="Введите номер раунда матча (например, 1 для первой карты)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите номер раунда' }]}
              >
                <InputNumber
                  min={1}
                  className="custom-input-number w-full"
                  placeholder="Например, 1"
                />
              </Form.Item>
              <Form.Item
                name="map"
                label={
                  <span className="text-gray-300">
                    Карта{' '}
                    <Tooltip title="Введите название карты (например, de_dust2)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название карты' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, de_dust2"
                />
              </Form.Item>
              <Form.Item
                name="result"
                label={
                  <span className="text-gray-300">
                    Результат{' '}
                    <Tooltip title="Укажите результат (1 - победа, 0 - поражение)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите результат' }]}
              >
                <InputNumber
                  min={0}
                  max={1}
                  className="custom-input-number w-full"
                  placeholder="Например, 1"
                />
              </Form.Item>
              <Form.Item
                name="kills"
                label={
                  <span className="text-gray-300">
                    Убийства{' '}
                    <Tooltip title="Введите количество убийств">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите количество убийств' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 20"
                />
              </Form.Item>
              <Form.Item
                name="assists"
                label={
                  <span className="text-gray-300">
                    Ассисты{' '}
                    <Tooltip title="Введите количество ассистов">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите количество ассистов' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 5"
                />
              </Form.Item>
              <Form.Item
                name="deaths"
                label={
                  <span className="text-gray-300">
                    Смерти{' '}
                    <Tooltip title="Введите количество смертей">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите количество смертей' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 15"
                />
              </Form.Item>
              <Form.Item
                name="adr"
                label={
                  <span className="text-gray-300">
                    ADR{' '}
                    <Tooltip title="Введите средний урон за раунд">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите ADR' }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  className="custom-input-number w-full"
                  placeholder="Например, 85.5"
                />
              </Form.Item>
              <Form.Item
                name="headshotsPercentage"
                label={
                  <span className="text-gray-300">
                    Процент хедшотов{' '}
                    <Tooltip title="Введите процент хедшотов (0-100)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите процент хедшотов' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  className="custom-input-number w-full"
                  placeholder="Например, 40"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddStatsManualCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={handleDeleteLastStat}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить последнюю статистику
          </button>
        </div>

        {/* Matches Info Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Matches Info Manager</h3>
          <button
            onClick={showAddPickBanModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить Pick/Ban
          </button>

          <Modal
            title={<span className="text-white">Добавить Pick/Ban</span>}
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
                    Карта{' '}
                    <Tooltip title="Введите название карты (например, Anubis)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название карты' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, Anubis"
                />
              </Form.Item>
              <Form.Item
                name="mapStatus"
                label={
                  <span className="text-gray-300">
                    Статус карты{' '}
                    <Tooltip title="Укажите статус карты (например, BANNED или PICKED)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите статус карты' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, BANNED"
                />
              </Form.Item>
              <Form.Item
                name="initiator"
                label={
                  <span className="text-gray-300">
                    Инициатор{' '}
                    <Tooltip title="Укажите, какая команда инициировала действие (например, first_team)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите инициатора' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, first_team"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddPickBanCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={handleDeletePickBanInfo}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Удалить последний Pick/Ban
          </button>

          <button
            onClick={showAddMapResultModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить результат карты
          </button>

          <Modal
            title={<span className="text-white">Добавить результат карты</span>}
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
                    Карта{' '}
                    <Tooltip title="Введите название карты (например, Anubis)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название карты' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, Anubis"
                />
              </Form.Item>
              <Form.Item
                name="firstTeam"
                label={
                  <span className="text-gray-300">
                    Первая команда{' '}
                    <Tooltip title="Введите название первой команды">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите первую команду' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, Team Liquid"
                />
              </Form.Item>
              <Form.Item
                name="secondTeam"
                label={
                  <span className="text-gray-300">
                    Вторая команда{' '}
                    <Tooltip title="Введите название второй команды">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите вторую команду' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Например, G2 Esports"
                />
              </Form.Item>
              <Form.Item
                name="firstHalfScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    Счёт первой команды в первой половине{' '}
                    <Tooltip title="Введите счёт первой команды в первой половине">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 8"
                />
              </Form.Item>
              <Form.Item
                name="firstHalfScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Счёт второй команды в первой половине{' '}
                    <Tooltip title="Введите счёт второй команды в первой половине">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 7"
                />
              </Form.Item>
              <Form.Item
                name="overtimeScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    Счёт первой команды в овертайме{' '}
                    <Tooltip title="Введите счёт первой команды в овертайме (0, если овертайма не было)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 0"
                />
              </Form.Item>
              <Form.Item
                name="overtimeScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Счёт второй команды в овертайме{' '}
                    <Tooltip title="Введите счёт второй команды в овертайме (0, если овертайма не было)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 0"
                />
              </Form.Item>
              <Form.Item
                name="totalScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    Общий счёт первой команды{' '}
                    <Tooltip title="Введите общий счёт первой команды">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите общий счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 16"
                />
              </Form.Item>
              <Form.Item
                name="totalScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Общий счёт второй команды{' '}
                    <Tooltip title="Введите общий счёт второй команды">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите общий счёт' }]}
              >
                <InputNumber
                  min={0}
                  className="custom-input-number w-full"
                  placeholder="Например, 13"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddMapResultCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={handleDeleteMapResultInfo}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить последний результат карты
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchPanel;