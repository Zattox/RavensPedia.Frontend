import { useState, useContext } from 'react';

import { Modal, Form, Input, InputNumber, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';

function AdminMainPanel() {
  const { isAdmin } = useAuth();
  const notificationApi = useContext(NotificationContext);
  const [isNewsModalVisible, setIsNewsModalVisible] = useState(false);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);
  const [isTournamentModalVisible, setIsTournamentModalVisible] = useState(false);
  const [newsForm] = Form.useForm();
  const [matchForm] = Form.useForm();
  const [playerForm] = Form.useForm();
  const [teamForm] = Form.useForm();
  const [tournamentForm] = Form.useForm();

  // Состояния для индикации загрузки
  const [loadingPlayersElo, setLoadingPlayersElo] = useState(false);
  const [loadingTeamsElo, setLoadingTeamsElo] = useState(false);
  const [loadingMatchesStatuses, setLoadingMatchesStatuses] = useState(false);
  const [loadingTournamentsStatuses, setLoadingTournamentsStatuses] = useState(false);

  if (!isAdmin) return null;

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

  // News handlers
  const showNewsModal = () => setIsNewsModalVisible(true);
  const handleCreateNews = async (values) => {
    try {
      await api.post('/news/', {
        title: values.title,
        content: values.content,
        author: values.author,
      });
      newsForm.resetFields();
      window.location.reload(); // Refresh to show new news
      showNotification('success', 'Успех!', 'Новость успешно создана!');
      setIsNewsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при создании новости:', error);
      showNotification('error', 'Ошибка!', 'Не удалось создать новость.');
    }
  };

  // Match handlers
  const showMatchModal = () => setIsMatchModalVisible(true);
  const handleAddMatch = async (values) => {
    try {
      await api.post('/matches/', {
        best_of: values.best_of,
        max_number_of_teams: values.max_number_of_teams,
        max_number_of_players: values.max_number_of_players,
        tournament: values.tournament,
        date: values.date,
        description: values.description,
      });
      showNotification('success', 'Успех!', 'Матч успешно создан!');
      setIsMatchModalVisible(false);
      matchForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании матча:', error);
      showNotification('error', 'Ошибка!', 'Не удалось создать матч.');
    }
  };

  // Player handlers
  const showPlayerModal = () => setIsPlayerModalVisible(true);
  const handleCreatePlayer = async (values) => {
    try {
      await api.post('/players/', {
        steam_id: values.steam_id,
        nickname: values.nickname,
        name: values.name || undefined,
        surname: values.surname || undefined,
      });
      showNotification('success', 'Успех!', 'Игрок успешно создан!');
      setIsPlayerModalVisible(false);
      playerForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании игрока:', error);
      showNotification('error', 'Ошибка!', 'Не удалось создать игрока.');
    }
  };

  // Team handlers
  const showTeamModal = () => setIsTeamModalVisible(true);
  const handleCreateTeam = async (values) => {
    try {
      await api.post('/teams/', {
        max_number_of_players: values.max_number_of_players,
        name: values.name,
        description: values.description || undefined,
      });
      showNotification('success', 'Успех!', 'Команда успешно создана!');
      setIsTeamModalVisible(false);
      teamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании команды:', error);
      showNotification('error', 'Ошибка!', 'Не удалось создать команду.');
    }
  };

  // Tournament handlers
  const showTournamentModal = () => setIsTournamentModalVisible(true);
  const handleCreateTournament = async (values) => {
    try {
      await api.post('/tournaments/', {
        max_count_of_teams: values.max_count_of_teams,
        name: values.name,
        prize: values.prize || undefined,
        description: values.description || undefined,
        start_date: values.start_date,
        end_date: values.end_date,
      });
      showNotification('success', 'Успех!', 'Турнир успешно создан!');
      setIsTournamentModalVisible(false);
      tournamentForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании турнира:', error);
      showNotification('error', 'Ошибка!', 'Не удалось создать турнир');
    }
  };

  // Обновить Faceit ELO игроков
  const handleUpdatePlayersFaceitElo = async () => {
    setLoadingPlayersElo(true);
    try {
      await api.patch('/players/update_faceit_elo/');
      showNotification('success', 'Успех!', 'Faceit ELO игроков обновлено.')
    } catch (error) {
      console.error('Ошибка при обновлении Faceit ELO игроков:', error.response?.data || error);
      showNotification('error', 'Ошибка!', 'Не удалось обновить Faceit ELO игроков.')
    } finally {
      setLoadingPlayersElo(false);
    }
  };

  // Обновить Faceit ELO команд
  const handleUpdateTeamsFaceitElo = async () => {
    setLoadingTeamsElo(true);
    try {
      await api.patch('/teams/update_team_faceit_elo/');
      showNotification('success', 'Успех!', 'Среднее Faceit ELO команд обновлено.')
    } catch (error) {
      console.error('Ошибка при обновлении Faceit ELO команд:', error.response?.data || error);
      showNotification('error', 'Ошибка!', 'Среднее Faceit ELO команд не удалось обновить.')
    } finally {
      setLoadingTeamsElo(false);
    }
  };

  // Обновить статусы матчей
  const handleUpdateMatchesStatuses = async () => {
    setLoadingMatchesStatuses(true);
    try {
      await api.patch('/schedules/matches/update_statuses/');
      showNotification('success', 'Успех!', 'Статусы всех матчей обновлены.')
    } catch (error) {
      console.error('Ошибка при обновлении статусов матчей:', error.response?.data || error);
      showNotification('success', 'Успех!', 'Ошибка при обновлении статусов матчей.')
    } finally {
      setLoadingMatchesStatuses(false);
    }
  };

  // Обновить статусы турниров
  const handleUpdateTournamentsStatuses = async () => {
    setLoadingTournamentsStatuses(true);
    try {
      await api.patch('/schedules/tournaments/update_statuses/');
      showNotification('success', 'Успех!', 'Статусы всех турниров обновлены.')
    } catch (error) {
      console.error('Ошибка при обновлении статусов турниров:', error.response?.data || error);
      showNotification('success', 'Успех!', 'Ошибка при обновлении статусов турниров.')
    } finally {
      setLoadingTournamentsStatuses(false);
    }
  };

  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Панель администратора</h2>
      <div className="space-y-4">
        {/* Create News */}
        <button
          onClick={showNewsModal}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full border border-gray-500"
        >
          Добавить новость
        </button>
        <Modal
          title={<span className="text-white">Создать новую новость</span>}
          open={isNewsModalVisible}
          onCancel={() => handleCancel(setIsNewsModalVisible, newsForm)}
          footer={null}
          className="custom-modal"
        >
          <Form form={newsForm} onFinish={handleCreateNews} layout="vertical" className="text-white">
            <Form.Item name="title" label={<span className="text-gray-300">Заголовок</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, TORSZ: THIS COULD BE MY YEAR" />
            </Form.Item>
            <Form.Item name="content" label={<span className="text-gray-300">Содержание</span>} rules={[{ required: true }]}>
              <Input.TextArea rows={4} className="custom-textarea" placeholder="Например, It feels amazing..." />
            </Form.Item>
            <Form.Item name="author" label={<span className="text-gray-300">Автор</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, Vladislav" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => handleCancel(setIsNewsModalVisible, newsForm)} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Match */}
        <button
          onClick={showMatchModal}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full border border-gray-500"
        >
          Добавить матч
        </button>
        <Modal
          title={<span className="text-white">Создать новый матч</span>}
          open={isMatchModalVisible}
          onCancel={() => handleCancel(setIsMatchModalVisible, matchForm)}
          footer={null}
          className="custom-modal"
        >
          <Form form={matchForm} onFinish={handleAddMatch} layout="vertical" className="text-white">
            <Form.Item name="best_of" label={<span className="text-gray-300">Best of</span>} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full custom-input-number" placeholder="Например, 3" />
            </Form.Item>
            <Form.Item name="max_number_of_teams" label={<span className="text-gray-300">Макс. команд</span>} rules={[{ required: true }]}>
              <InputNumber min={2} className="w-full custom-input-number" placeholder="Например, 2" />
            </Form.Item>
            <Form.Item name="max_number_of_players" label={<span className="text-gray-300">Макс. игроков</span>} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full custom-input-number" placeholder="Например, 10" />
            </Form.Item>
            <Form.Item name="tournament" label={<span className="text-gray-300">Турнир</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, ESL Pro League" />
            </Form.Item>
            <Form.Item name="date" label={<span className="text-gray-300">Дата (ISO)</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="2025-03-31T16:04:39.534Z" />
            </Form.Item>
            <Form.Item name="description" label={<span className="text-gray-300">Описание</span>} rules={[{ required: true }]}>
              <Input.TextArea rows={4} className="custom-textarea" placeholder="Например, Финал турнира..." />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => handleCancel(setIsMatchModalVisible, matchForm)} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Player */}
        <button
          onClick={showPlayerModal}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full border border-gray-500"
        >
          Добавить игрока
        </button>
        <Modal
          title={<span className="text-white">Создать нового игрока</span>}
          open={isPlayerModalVisible}
          onCancel={() => handleCancel(setIsPlayerModalVisible, playerForm)}
          footer={null}
          className="custom-modal"
        >
          <Form form={playerForm} onFinish={handleCreatePlayer} layout="vertical" className="text-white">
            <Form.Item name="steam_id" label={<span className="text-gray-300">Steam ID</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, 76561199043678160" />
            </Form.Item>
            <Form.Item name="nickname" label={<span className="text-gray-300">Никнейм</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, s1mple" />
            </Form.Item>
            <Form.Item name="name" label={<span className="text-gray-300">Имя (необязательно)</span>}>
              <Input className="custom-input" placeholder="Например, Александр" />
            </Form.Item>
            <Form.Item name="surname" label={<span className="text-gray-300">Фамилия (необязательно)</span>}>
              <Input className="custom-input" placeholder="Например, Костылев" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => handleCancel(setIsPlayerModalVisible, playerForm)} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Team */}
        <button
          onClick={showTeamModal}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full border border-gray-500"
        >
          Добавить команду
        </button>
        <Modal
          title={<span className="text-white">Создать новую команду</span>}
          open={isTeamModalVisible}
          onCancel={() => handleCancel(setIsTeamModalVisible, teamForm)}
          footer={null}
          className="custom-modal"
        >
          <Form form={teamForm} onFinish={handleCreateTeam} layout="vertical" className="text-white">
            <Form.Item name="max_number_of_players" label={<span className="text-gray-300">Макс. игроков</span>} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full custom-input-number" placeholder="Например, 5" />
            </Form.Item>
            <Form.Item name="name" label={<span className="text-gray-300">Название</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, Natus Vincere" />
            </Form.Item>
            <Form.Item name="description" label={<span className="text-gray-300">Описание (необязательно)</span>}>
              <Input.TextArea rows={4} className="custom-textarea" placeholder="Например, Украинская киберспортивная команда..." />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => handleCancel(setIsTeamModalVisible, teamForm)} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Tournament */}
        <button
          onClick={showTournamentModal}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full border border-gray-500"
        >
          Добавить турнир
        </button>
        <Modal
          title={<span className="text-white">Создать новый турнир</span>}
          open={isTournamentModalVisible}
          onCancel={() => handleCancel(setIsTournamentModalVisible, tournamentForm)}
          footer={null}
          className="custom-modal"
        >
          <Form form={tournamentForm} onFinish={handleCreateTournament} layout="vertical" className="text-white">
            <Form.Item name="max_count_of_teams" label={<span className="text-gray-300">Макс. команд</span>} rules={[{ required: true }]}>
              <InputNumber min={2} className="w-full custom-input-number" placeholder="Например, 16" />
            </Form.Item>
            <Form.Item name="name" label={<span className="text-gray-300">Название</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="Например, ESL Pro League" />
            </Form.Item>
            <Form.Item name="prize" label={<span className="text-gray-300">Призовой фонд (необязательно)</span>}>
              <Input className="custom-input" placeholder="Например, $100,000" />
            </Form.Item>
            <Form.Item name="description" label={<span className="text-gray-300">Описание (необязательно)</span>}>
              <Input.TextArea rows={4} className="custom-textarea" placeholder="Например, Международный турнир..." />
            </Form.Item>
            <Form.Item name="start_date" label={<span className="text-gray-300">Дата начала (ISO)</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="2025-04-02T20:22:25.321Z" />
            </Form.Item>
            <Form.Item name="end_date" label={<span className="text-gray-300">Дата окончания (ISO)</span>} rules={[{ required: true }]}>
              <Input className="custom-input" placeholder="2025-04-02T20:22:25.321Z" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => handleCancel(setIsTournamentModalVisible, tournamentForm)} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Секция: Обновление данных Faceit ELO и статусов */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Обновление данных</h3>
          <Button
            onClick={handleUpdatePlayersFaceitElo}
            loading={loadingPlayersElo}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Обновить Faceit ELO игроков
          </Button>
          <Button
            onClick={handleUpdateTeamsFaceitElo}
            loading={loadingTeamsElo}

            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Обновить Faceit ELO команд
          </Button>
          <Button
            onClick={handleUpdateMatchesStatuses}
            loading={loadingMatchesStatuses}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500"
          >
            Обновить статусы матчей
          </Button>
          <Button
            onClick={handleUpdateTournamentsStatuses}
            loading={loadingTournamentsStatuses}
            className="text-white font-bold bg-blue-600 hover:!bg-blue-700 hover:!text-white px-3 py-5 mb-4 rounded w-full border-gray-500 "
          >
            Обновить статусы турниров
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminMainPanel;