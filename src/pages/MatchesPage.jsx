// src/pages/MatchesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Modal, Form, Input, InputNumber, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';

function MatchesPage() {
  const { isAdmin } = useAuth();
  const [inProgressMatches, setInProgressMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const matchesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const inProgressResponse = await api.get('/schedules/matches/get_in_progress/');
        const inProgressData = inProgressResponse.data?.data || inProgressResponse.data || [];
        setInProgressMatches(Array.isArray(inProgressData) ? inProgressData : []);

        const scheduledResponse = await api.get('/schedules/matches/get_upcoming_scheduled/', {
          params: { num_matches: 50 },
        });
        const scheduledData = scheduledResponse.data?.data || scheduledResponse.data || [];
        // Сортировка запланированных матчей по времени (ближайшие первыми)
        const sortedScheduledData = Array.isArray(scheduledData)
          ? scheduledData.sort((a, b) => new Date(a.date) - new Date(b.date))
          : [];
        setScheduledMatches(sortedScheduledData);

        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке матчей:', error.response?.data || error.message);
        setError('Не удалось загрузить матчи. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const indexOfLastInProgress = inProgressPage * matchesPerPage;
  const indexOfFirstInProgress = indexOfLastInProgress - matchesPerPage;
  const currentInProgressMatches = inProgressMatches.slice(indexOfFirstInProgress, indexOfLastInProgress);

  const indexOfLastScheduled = scheduledPage * matchesPerPage;
  const indexOfFirstScheduled = indexOfLastScheduled - matchesPerPage;
  const currentScheduledMatches = scheduledMatches.slice(indexOfFirstScheduled, indexOfLastScheduled);

  const handleInProgressPageChange = (page) => {
    setInProgressPage(page);
    window.scrollTo(0, 0);
  };

  const handleScheduledPageChange = (page) => {
    setScheduledPage(page);
    window.scrollTo(0, 0);
  };

  const handleMatchClick = (matchId) => {
    navigate(`/matches/${matchId}`);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAddMatch = async (values) => {
    try {
      const response = await api.post('/matches/', {
        best_of: values.best_of,
        max_number_of_teams: values.max_number_of_teams,
        max_number_of_players: values.max_number_of_players,
        tournament: values.tournament,
        date: values.date,
        description: values.description,
      });
      const newMatch = response.data;

      // Определяем, к какому списку добавить матч (текущие или запланированные)
      const now = new Date();
      const matchDate = new Date(newMatch.date);
      if (matchDate <= now) {
        // Добавляем в текущие матчи
        setInProgressMatches((prev) => [...prev, newMatch]);
      } else {
        // Добавляем в запланированные матчи и пересортировываем
        setScheduledMatches((prev) => {
          const updated = [...prev, newMatch];
          return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
        });
      }

      alert('Match created successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating match:', error.response?.data || error);
      alert('Failed to create match');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full">
        {isAdmin && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={showModal}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Добавить новый матч
            </button>
          </div>
        )}

        <Modal
          title={<span className="text-white">Создать новый матч</span>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={form}
            onFinish={handleAddMatch}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="best_of"
              label={
                <span className="text-gray-300">
                  Best of{' '}
                  <Tooltip title="Укажите формат матча (например, Best of 1, 3, 5 и т.д.)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите Best of' }]}
            >
              <InputNumber
                min={1}
                className="w-full custom-input-number"
                placeholder="Например, 3"
              />
            </Form.Item>
            <Form.Item
              name="max_number_of_teams"
              label={
                <span className="text-gray-300">
                  Максимальное количество команд{' '}
                  <Tooltip title="Укажите максимальное количество команд, участвующих в матче (обычно 2)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите максимальное количество команд' }]}
            >
              <InputNumber
                min={2}
                className="w-full custom-input-number"
                placeholder="Например, 2"
              />
            </Form.Item>
            <Form.Item
              name="max_number_of_players"
              label={
                <span className="text-gray-300">
                  Максимальное количество игроков{' '}
                  <Tooltip title="Укажите общее количество игроков в матче (например, 10 для формата 5v5)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите максимальное количество игроков' }]}
            >
              <InputNumber
                min={1}
                className="w-full custom-input-number"
                placeholder="Например, 10"
              />
            </Form.Item>
            <Form.Item
              name="tournament"
              label={
                <span className="text-gray-300">
                  Турнир{' '}
                  <Tooltip title="Укажите название турнира, в рамках которого проводится матч">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите название турнира' }]}
            >
              <Input
                className="custom-input"
                placeholder="Например, ESL Pro League"
              />
            </Form.Item>
            <Form.Item
              name="date"
              label={
                <span className="text-gray-300">
                  Дата (YYYY-MM-DDTHH:MM:SSZ){' '}
                  <Tooltip title="Укажите дату и время матча в формате ISO (например, 2025-03-31T16:04:39.534Z)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите дату' }]}
            >
              <Input
                className="custom-input"
                placeholder="2025-03-31T16:04:39.534Z"
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={
                <span className="text-gray-300">
                  Описание{' '}
                  <Tooltip title="Добавьте краткое описание матча (например, 'Финал турнира ESL Pro League')">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите описание' }]}
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="Например, Финал турнира ESL Pro League"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCancel} className="text-white border-gray-500">
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Текущие матчи</h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : inProgressMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentInProgressMatches.map((match) => (
                  <div
                    key={match.id || Math.random()}
                    className="bg-gray-800 p-4 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => handleMatchClick(match.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Формат: Best of {match.best_of || 'N/A'}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Турнир:</span> {match.tournament || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Дата:</span>{' '}
                      {match.date ? formatDate(match.date) : 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Матч:</span>{' '}
                      {Array.isArray(match.teams) && match.teams.length === 2 ? (
                        <span>
                          <span className="text-blue-400">{match.teams[0]}</span> vs{' '}
                          <span className="text-red-400">{match.teams[1]}</span>
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>
                ))}
              </div>
              {inProgressMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={inProgressPage}
                    pageSize={matchesPerPage}
                    total={inProgressMatches.length}
                    onChange={handleInProgressPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">Нет текущих матчей.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Запланированные матчи</h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : scheduledMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentScheduledMatches.map((match) => (
                  <div
                    key={match.id || Math.random()}
                    className="bg-gray-800 p-4 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => handleMatchClick(match.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Формат: Best of {match.best_of || 'N/A'}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Турнир:</span> {match.tournament || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Дата:</span>{' '}
                      {match.date ? formatDate(match.date) : 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Матч:</span>{' '}
                      {Array.isArray(match.teams) && match.teams.length === 2 ? (
                        <span>
                          <span className="text-blue-400">{match.teams[0]}</span> vs{' '}
                          <span className="text-red-400">{match.teams[1]}</span>
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>
                ))}
              </div>
              {scheduledMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={scheduledPage}
                    pageSize={matchesPerPage}
                    total={scheduledMatches.length}
                    onChange={handleScheduledPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">Нет запланированных матчей.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;