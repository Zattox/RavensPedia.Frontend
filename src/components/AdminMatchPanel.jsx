import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, InputNumber, Button, Tooltip, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from '@/context/NotificationContext';
import api from '@/api';

function AdminMatchPanel({ match_id, setMatch, refreshMatch, match }) {
  const { Option } = Select;
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] = useState(false);
  const [isAddFaceitStatsModalVisible, setIsAddFaceitStatsModalVisible] = useState(false);
  const [isAddPickBanModalVisible, setIsAddPickBanModalVisible] = useState(false);
  const [isAddMapResultModalVisible, setIsAddMapResultModalVisible] = useState(false);
  const [isAddStatsManualModalVisible, setIsAddStatsManualModalVisible] = useState(false);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);
  const [isDeleteMatchModalVisible, setIsDeleteMatchModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();
  const [addFaceitStatsForm] = Form.useForm();
  const [addPickBanForm] = Form.useForm();
  const [addMapResultForm] = Form.useForm();
  const [addStatsManualForm] = Form.useForm();
  const [updateStatusForm] = Form.useForm();

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

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
        const response = await api.get(`/matches/${match_id}/`);
        setMatch(response.data);
        refreshMatch();
        showNotification('success', 'Успех!', 'Матч успешно обновлен.');
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
      } catch (error) {
        console.error('Ошибка при обновлении матча:', error.response?.data || error);
        const errorDetail = error.response?.data?.detail || 'Не удалось обновить матч';
        showNotification('error', 'Ошибка!', errorDetail);
      }
    } else {
      showNotification('error', 'Ошибка!', 'Хотя бы одно поле должно быть заполнено для обновления.');
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
      showNotification('success', 'Успех!', `Команда ${values.teamName} успешно добавлена.`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddTeamModalVisible(false);
      addTeamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении команды:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить команду';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', `Команда ${values.teamName} успешно удалена.`);
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsDeleteTeamModalVisible(false);
      deleteTeamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при удалении команды:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить команду';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', 'Статистика Faceit успешно добавлена.');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddFaceitStatsModalVisible(false);
      addFaceitStatsForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении статистики Faceit:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить статистику Faceit';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', 'Pick/Ban успешно добавлен.');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddPickBanModalVisible(false);
      addPickBanForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении Pick/Ban:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить Pick/Ban';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', 'Последний Pick/Ban успешно удален.');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error('Ошибка при удалении Pick/Ban:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить Pick/Ban';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const showAddMapResultModal = () => {
    console.log('match:', match);
    if (!match) {
      showNotification('error', 'Ошибка!', 'Данные матча недоступны. Пожалуйста, обновите страницу.');
      return;
    }
    if (!match.teams || match.teams.length < 2) {
      showNotification('error', 'Ошибка!', 'В матче недостаточно команд. Добавьте команды перед добавлением результата.');
      return;
    }
    setIsAddMapResultModalVisible(true);
    addMapResultForm.setFieldsValue({
      firstTeam: match.teams[0],
      secondTeam: match.teams[1],
    });
  };

  const handleAddMapResultInfo = async (values) => {
    if (!match?.teams || match.teams.length < 2) {
      showNotification('error', 'Ошибка!', 'В матче недостаточно команд для добавления результата.');
      return;
    }
    try {
      await api.patch(`/matches/stats/${match_id}/add_map_result_info_in_match/`, {
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
      });
      showNotification('success', 'Успех!', 'Результат карты успешно добавлен');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddMapResultModalVisible(false);
      addMapResultForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении результата карты:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить результат карты';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', 'Последний результат карты успешно удален');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error('Ошибка при удалении результата карты:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить результат карты';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  // Добавить статистику вручную
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
      showNotification('success', 'Успех!', 'Статистика вручную успешно добавлена');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsAddStatsManualModalVisible(false);
      addStatsManualForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении статистики вручную:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить статистику вручную';
      showNotification('error', 'Ошибка!', errorDetail);
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
      showNotification('success', 'Успех!', 'Последняя статистика успешно удалена');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error('Ошибка при удалении последней статистики:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить последнюю статистику';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  // Удалить статистику матча
  const handleDeleteMatchStats = async () => {
    try {
      await api.delete(`/matches/stats/${match_id}/delete_match_stats/`);
      showNotification('success', 'Успех!', 'Статистика матча успешно удалена');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
    } catch (error) {
      console.error('Ошибка при удалении статистики матча:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить статистику матча';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  // Удалить матч
  const showDeleteMatchModal = () => {
    setIsDeleteMatchModalVisible(true);
  };

  const handleDeleteMatch = async () => {
    try {
      await api.delete(`/matches/${match_id}/`);
      showNotification('success', 'Успех!', 'Матч успешно удален');
      setIsDeleteMatchModalVisible(false);
      navigate('/matches');
    } catch (error) {
      console.error('Ошибка при удалении матча:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить матч';
      showNotification('error', 'Ошибка!', errorDetail);
      setIsDeleteMatchModalVisible(false);
    }
  };

  const handleDeleteMatchCancel = () => {
    setIsDeleteMatchModalVisible(false);
  };

  // Обновить статус матча
  const showUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(true);
    updateStatusForm.setFieldsValue({ match_id });
  };

  const handleUpdateStatus = async (values) => {
    try {
      await api.patch(`/schedules/matches/${values.match_id}/update_status/`, null, {
        params: { new_status: values.new_status },
      });
      showNotification('success', 'Успех!', 'Статус матча успешно обновлен');
      const response = await api.get(`/matches/${match_id}/`);
      setMatch(response.data);
      refreshMatch();
      setIsUpdateStatusModalVisible(false);
      updateStatusForm.resetFields();
    } catch (error) {
      console.error('Ошибка при обновлении статуса матча:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось обновить статус матча';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleUpdateStatusCancel = () => {
    setIsUpdateStatusModalVisible(false);
    updateStatusForm.resetFields();
  };

  return (
    <div className="fixed top-24 right-4 w-80 max-h-[80vh] overflow-y-auto bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
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
                <Input className="custom-input" placeholder="Новое название турнира (необязательно)" />
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
                <Input className="custom-input" placeholder="Новая дата матча (необязательно)" />
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
            onClick={showUpdateStatusModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Обновить статус матча
          </button>

          <Modal
            title={<span className="text-white">Обновить статус матча</span>}
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
                    ID матча{' '}
                    <Tooltip title="ID матча (нельзя изменить)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите ID матча' }]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="new_status"
                label={
                  <span className="text-gray-300">
                    Новый статус{' '}
                    <Tooltip title="Выберите новый статус матча">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, выберите новый статус' }]}
              >
                <Select className="custom-select" placeholder="Выберите статус">
                  <Option value="SCHEDULED">SCHEDULED</Option>
                  <Option value="IN_PROGRESS">IN_PROGRESS</Option>
                  <Option value="COMPLETED">COMPLETED</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleUpdateStatusCancel} className="text-white border-gray-500">
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
            onClick={showDeleteMatchModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить матч
          </button>

          <Modal
            title={<span className="text-white">Удалить матч</span>}
            open={isDeleteMatchModalVisible}
            onCancel={handleDeleteMatchCancel}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">Вы уверены, что хотите удалить этот матч?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleDeleteMatchCancel} className="text-white border-gray-500">
                Отмена
              </Button>
              <Button onClick={handleDeleteMatch} className="bg-red-600 hover:bg-red-700 text-white">
                Удалить
              </Button>
            </div>
          </Modal>
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
                <Input className="custom-input" placeholder="Например, Team Liquid" />
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
                <Input className="custom-input" placeholder="Например, Team Liquid" />
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
                <Input className="custom-input" placeholder="Например, s1mple" />
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
                <Select
                  className="custom-select"
                  placeholder="Выберете раунд матча"
                  options={[
                    { value: 1, label: 'Первая карта' },
                    { value: 2, label: 'Вторая карта' },
                    { value: 3, label: 'Третья карта' },
                    { value: 4, label: 'Четвертая карта' },
                    { value: 5, label: 'Пятая карта' },
                  ]}
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
                <Select
                  className="custom-select"
                  placeholder="Выберите карту"
                  options={[
                    { value: 'Anubis', label: 'Anubis' },
                    { value: 'Dust2', label: 'Dust2' },
                    { value: 'Mirage', label: 'Mirage' },
                    { value: 'Nuke', label: 'Nuke' },
                    { value: 'Vertigo', label: 'Vertigo' },
                    { value: 'Ancient', label: 'Ancient' },
                    { value: 'Inferno', label: 'Inferno' },
                    { value: 'Train', label: 'Train' },
                  ]}
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
                <Select
                  className="custom-select"
                  placeholder="Выберете результат"
                  options={[
                    { value: 0, label: 'Поражение' },
                    { value: 1, label: 'Победа' },
                  ]}
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
                <Select
                  className="custom-select"
                  placeholder="Выберите карту"
                  options={[
                    { value: 'Anubis', label: 'Anubis' },
                    { value: 'Dust2', label: 'Dust2' },
                    { value: 'Mirage', label: 'Mirage' },
                    { value: 'Nuke', label: 'Nuke' },
                    { value: 'Vertigo', label: 'Vertigo' },
                    { value: 'Ancient', label: 'Ancient' },
                    { value: 'Inferno', label: 'Inferno' },
                    { value: 'Train', label: 'Train' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="mapStatus"
                label={
                  <span className="text-gray-300">
                    Статус карты{' '}
                    <Tooltip title="Укажите статус карты (например, Banned или Picked)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите статус карты' }]}
              >
                <Select
                  className="custom-select"
                  placeholder="Выберите статус карты"
                  options={[
                    { value: 'Banned', label: 'Banned' },
                    { value: 'Picked', label: 'Picked' },
                    { value: 'Default', label: 'Default' },
                  ]}
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
                <Select
                  className="custom-select"
                  placeholder="Выберите инициатора"
                  options={[
                    { value: match.teams[0], label: match.teams[0] },
                    { value: match.teams[1], label: match.teams[1] },
                  ]}
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
                    <Tooltip title="Выберите карту из списка">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, выберите карту' }]}
              >
                <Select
                  className="custom-select"
                  placeholder="Выберите карту"
                  options={[
                    { value: 'Anubis', label: 'Anubis' },
                    { value: 'Dust2', label: 'Dust2' },
                    { value: 'Mirage', label: 'Mirage' },
                    { value: 'Nuke', label: 'Nuke' },
                    { value: 'Vertigo', label: 'Vertigo' },
                    { value: 'Ancient', label: 'Ancient' },
                    { value: 'Inferno', label: 'Inferno' },
                    { value: 'Train', label: 'Train' },
                  ]}
                />
              </Form.Item>

              {/* Поле для первой команды (левая, заблокировано) */}
              <Form.Item
                name="firstTeam"
                label={
                  <span className="text-gray-300">
                    Первая команда (левая){' '}
                    <Tooltip title="Первая команда из списка матча (нельзя изменить)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Первая команда отсутствует в данных матча' }]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>

              {/* Поле для второй команды (правая, заблокировано) */}
              <Form.Item
                name="secondTeam"
                label={
                  <span className="text-gray-300">
                    Вторая команда (правая){' '}
                    <Tooltip title="Вторая команда из списка матча (нельзя изменить)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Вторая команда отсутствует в данных матча' }]}
              >
                <Input className="custom-input" disabled />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 4" />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 8" />
              </Form.Item>
              <Form.Item
                name="secondHalfScoreFirstTeam"
                label={
                  <span className="text-gray-300">
                    Счёт первой команды во второй половине{' '}
                    <Tooltip title="Введите счёт первой команды во второй половине">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 3" />
              </Form.Item>
              <Form.Item
                name="secondHalfScoreSecondTeam"
                label={
                  <span className="text-gray-300">
                    Счёт второй команды во второй половине{' '}
                    <Tooltip title="Введите счёт второй команды во второй половине">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите счёт' }]}
              >
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 5" />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 0" />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 0" />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 7" />
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
                <InputNumber min={0} className="custom-input-number w-full" placeholder="Например, 13" />
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
            Удалить последний результат
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchPanel;