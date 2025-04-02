// src/components/AdminMainPanel.jsx
import { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';

function AdminMainPanel() {
  const { isAdmin } = useAuth();
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

  if (!isAdmin) return null;

  // News handlers
  const showNewsModal = () => setIsNewsModalVisible(true);
  const handleCreateNews = async (values) => {
    try {
      await api.post('/news/', {
        title: values.title,
        content: values.content,
        author: values.author,
      });
      alert('Новость успешно создана!');
      setIsNewsModalVisible(false);
      newsForm.resetFields();
      window.location.reload(); // Refresh to show new news
    } catch (error) {
      console.error('Ошибка при создании новости:', error);
      alert('Не удалось создать новость.');
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
      alert('Матч успешно создан!');
      setIsMatchModalVisible(false);
      matchForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании матча:', error);
      alert('Не удалось создать матч.');
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
      alert('Игрок успешно создан!');
      setIsPlayerModalVisible(false);
      playerForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании игрока:', error);
      alert('Не удалось создать игрока.');
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
      alert('Команда успешно создана!');
      setIsTeamModalVisible(false);
      teamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании команды:', error);
      alert('Не удалось создать команду.');
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
      alert('Турнир успешно создан!');
      setIsTournamentModalVisible(false);
      tournamentForm.resetFields();
    } catch (error) {
      console.error('Ошибка при создании турнира:', error);
      alert('Не удалось создать турнир.');
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
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
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
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
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
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
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
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
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
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full"
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
      </div>
    </div>
  );
}

export default AdminMainPanel;