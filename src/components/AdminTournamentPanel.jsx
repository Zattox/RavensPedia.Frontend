import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from '@/context/NotificationContext';
import api from '@/api';

const { Option } = Select;

function AdminTournamentPanel({ tournamentName, refreshTournament }) { // Добавляем refreshTournament
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] = useState(false);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);
  const [isAddResultModalVisible, setIsAddResultModalVisible] = useState(false);
  const [isDeleteResultModalVisible, setIsDeleteResultModalVisible] = useState(false);
  const [isAssignTeamToResultModalVisible, setIsAssignTeamToResultModalVisible] = useState(false);
  const [isRemoveTeamFromResultModalVisible, setIsRemoveTeamFromResultModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();
  const [updateStatusForm] = Form.useForm();
  const [addResultForm] = Form.useForm();
  const [assignTeamToResultForm] = Form.useForm();
  const [removeTeamFromResultForm] = Form.useForm();

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

  // Update Tournament Modal
  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdateTournament = async (values) => {
    const updatedTournament = {};
    if (values.name) updatedTournament.name = values.name;
    if (values.description) updatedTournament.description = values.description;
    if (values.prize) updatedTournament.prize = values.prize;
    if (values.start_date) updatedTournament.start_date = values.start_date;
    if (values.end_date) updatedTournament.end_date = values.end_date;

    if (Object.keys(updatedTournament).length > 0) {
      try {
        await api.patch(`/tournaments/${tournamentName}/`, updatedTournament);
        showNotification('success', 'Успех!', 'Турнир успешно обновлен!');
        await refreshTournament(); // Перезапрашиваем данные
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
      } catch (error) {
        console.error('Ошибка при обновлении турнира:', error);
        const errorDetail = error.response?.data?.detail || 'Не удалось обновить турнир';
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

  // Update Tournament Status
  const showUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(true);
    updateStatusForm.setFieldsValue({ tournament_name: tournamentName });
  };

  const handleUpdateStatus = async (values) => {
    try {
      await api.patch(`/schedules/tournaments/${values.tournament_name}/update_status/`, null, {
        params: { new_status: values.new_status },
      });
      showNotification('success', 'Успех!', 'Статус турнира успешно обновлен!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsUpdateStatusModalVisible(false);
      updateStatusForm.resetFields();
    } catch (error) {
      console.error('Ошибка при обновлении статуса турнира:', error.response?.data || error);
      const errorDetail = error.response?.data?.detail || 'Не удалось обновить статус турнира';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleUpdateStatusCancel = () => {
    setIsUpdateStatusModalVisible(false);
    updateStatusForm.resetFields();
  };

  // Delete Tournament
  const [isDeleteTournamentModalVisible, setIsDeleteTournamentModalVisible] = useState(false);

  const showDeleteTournamentModal = () => {
    setIsDeleteTournamentModalVisible(true);
  };

  const handleDeleteTournament = async () => {
    try {
      await api.delete(`/tournaments/${tournamentName}/`);
      showNotification('success', 'Успех!', 'Турнир успешно удален!');
      setIsDeleteTournamentModalVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении турнира:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить турнир';
      showNotification('error', 'Ошибка!', errorDetail);
      setIsDeleteTournamentModalVisible(false);
    }
  };

  const handleDeleteTournamentCancel = () => {
    setIsDeleteTournamentModalVisible(false);
  };

  // Add Team Modal
  const showAddTeamModal = () => {
    setIsAddTeamModalVisible(true);
  };

  const handleAddTeam = async (values) => {
    try {
      await api.patch(`/tournaments/${tournamentName}/add_team/${values.team_name}/`);
      showNotification('success', 'Успех!', 'Команда успешно добавлена в турнир!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsAddTeamModalVisible(false);
      addTeamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении команды:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить команду в турнир';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleAddTeamCancel = () => {
    setIsAddTeamModalVisible(false);
    addTeamForm.resetFields();
  };

  // Delete Team Modal
  const showDeleteTeamModal = () => {
    setIsDeleteTeamModalVisible(true);
  };

  const handleDeleteTeam = async (values) => {
    try {
      await api.delete(`/tournaments/${tournamentName}/delete_team/${values.team_name}/`);
      showNotification('success', 'Успех!', 'Команда успешно удалена из турнира!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsDeleteTeamModalVisible(false);
      deleteTeamForm.resetFields();
    } catch (error) {
      console.error('Ошибка при удалении команды:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить команду из турнира';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleDeleteTeamCancel = () => {
    setIsDeleteTeamModalVisible(false);
    deleteTeamForm.resetFields();
  };

  // Add Result Modal
  const showAddResultModal = () => {
    setIsAddResultModalVisible(true);
  };

  const handleAddResult = async (values) => {
    try {
      await api.patch(`/tournaments/${tournamentName}/add_result/`, {
        place: values.place,
        prize: values.prize,
      });
      showNotification('success', 'Успех!', 'Результат успешно добавлен!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsAddResultModalVisible(false);
      addResultForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении результата:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось добавить результат';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleAddResultCancel = () => {
    setIsAddResultModalVisible(false);
    addResultForm.resetFields();
  };

  // Delete Last Result Modal
  const showDeleteResultModal = () => {
    setIsDeleteResultModalVisible(true);
  };

  const handleDeleteResult = async () => {
    try {
      await api.delete(`/tournaments/${tournamentName}/delete_last_result/`);
      showNotification('success', 'Успех!', 'Последний результат успешно удален!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsDeleteResultModalVisible(false);
    } catch (error) {
      console.error('Ошибка при удалении результата:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось удалить результат';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleDeleteResultCancel = () => {
    setIsDeleteResultModalVisible(false);
  };

  // Assign Team to Result Modal
  const showAssignTeamToResultModal = () => {
    setIsAssignTeamToResultModalVisible(true);
  };

  const handleAssignTeamToResult = async (values) => {
    try {
      await api.patch(`/tournaments/${tournamentName}/assign_team_to_result/`, null, {
        params: { place: values.place, team_name: values.team_name },
      });
      showNotification('success', 'Успех!', 'Команда успешно привязана к результату!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsAssignTeamToResultModalVisible(false);
      assignTeamToResultForm.resetFields();
    } catch (error) {
      console.error('Ошибка при привязке команды к результату:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось привязать команду к результату';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleAssignTeamToResultCancel = () => {
    setIsAssignTeamToResultModalVisible(false);
    assignTeamToResultForm.resetFields();
  };

  // Remove Team from Result Modal
  const showRemoveTeamFromResultModal = () => {
    setIsRemoveTeamFromResultModalVisible(true);
  };

  const handleRemoveTeamFromResult = async (values) => {
    try {
      await api.delete(`/tournaments/${tournamentName}/remove_team_from_result/`, {
        params: { place: values.place },
      });
      showNotification('success', 'Успех!', 'Команда успешно отвязана от результата!');
      await refreshTournament(); // Перезапрашиваем данные
      setIsRemoveTeamFromResultModalVisible(false);
      removeTeamFromResultForm.resetFields();
    } catch (error) {
      console.error('Ошибка при отвязке команды от результата:', error);
      const errorDetail = error.response?.data?.detail || 'Не удалось отвязать команду от результата';
      showNotification('error', 'Ошибка!', errorDetail);
    }
  };

  const handleRemoveTeamFromResultCancel = () => {
    setIsRemoveTeamFromResultModalVisible(false);
    removeTeamFromResultForm.resetFields();
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Управление турниром (Админ)</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Действия с турниром</h3>
          <button
            onClick={showUpdateModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Обновить информацию
          </button>

          <Modal
            title={<span className="text-white">Обновить информацию о турнире</span>}
            open={isUpdateModalVisible}
            onCancel={handleUpdateCancel}
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
                    Название{' '}
                    <Tooltip title="Введите новое название турнира (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  className="custom-input"
                  placeholder="Новое название (необязательно)"
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <span className="text-gray-300">
                    Описание{' '}
                    <Tooltip title="Введите новое описание (оставьте пустым, чтобы не изменять)">
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
              <Form.Item
                name="prize"
                label={
                  <span className="text-gray-300">
                    Призовой фонд{' '}
                    <Tooltip title="Введите новый призовой фонд (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  className="custom-input"
                  placeholder="Новый призовой фонд (необязательно)"
                />
              </Form.Item>
              <Form.Item
                name="start_date"
                label={
                  <span className="text-gray-300">
                    Дата начала{' '}
                    <Tooltip title="Введите новую дату начала (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  type="date"
                  className="custom-input"
                  placeholder="Новая дата начала (необязательно)"
                />
              </Form.Item>
              <Form.Item
                name="end_date"
                label={
                  <span className="text-gray-300">
                    Дата окончания{' '}
                    <Tooltip title="Введите новую дату окончания (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  type="date"
                  className="custom-input"
                  placeholder="Новая дата окончания (необязательно)"
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
            Обновить статус турнира
          </button>

          <Modal
            title={<span className="text-white">Обновить статус турнира</span>}
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
                name="tournament_name"
                label={
                  <span className="text-gray-300">
                    Название турнира{' '}
                    <Tooltip title="Название турнира (нельзя изменить)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название турнира' }]}
              >
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="new_status"
                label={
                  <span className="text-gray-300">
                    Новый статус{' '}
                    <Tooltip title="Выберите новый статус турнира">
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
            onClick={showDeleteTournamentModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить турнир
          </button>

          <Modal
            title={<span className="text-white">Удалить турнир</span>}
            open={isDeleteTournamentModalVisible}
            onCancel={handleDeleteTournamentCancel}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">Вы уверены, что хотите удалить турнир {tournamentName}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleDeleteTournamentCancel} className="text-white border-gray-500">
                Отмена
              </Button>
              <Button onClick={handleDeleteTournament} className="bg-red-600 hover:bg-red-700 text-white">
                Удалить
              </Button>
            </div>
          </Modal>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Управление командами</h3>
          <button
            onClick={showAddTeamModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить команду
          </button>

          <Modal
            title={<span className="text-white">Добавить команду в турнир</span>}
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
                name="team_name"
                label={
                  <span className="text-gray-300">
                    Название команды{' '}
                    <Tooltip title="Введите название команды для добавления">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название команды' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Название команды"
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
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Удалить команду
          </button>

          <Modal
            title={<span className="text-white">Удалить команду из турнира</span>}
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
                name="team_name"
                label={
                  <span className="text-gray-300">
                    Название команды{' '}
                    <Tooltip title="Введите название команды для удаления">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название команды' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Название команды"
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

        <div>
          <h3 className="text-lg font-semibold mb-2">Управление результатами</h3>
          <button
            onClick={showAddResultModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить результат
          </button>

          <Modal
            title={<span className="text-white">Добавить результат</span>}
            open={isAddResultModalVisible}
            onCancel={handleAddResultCancel}
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
                    Место{' '}
                    <Tooltip title="Введите место (например, 1, 2, 3)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите место' }]}
              >
                <Input
                  type="number"
                  className="custom-input"
                  placeholder="Место"
                />
              </Form.Item>
              <Form.Item
                name="prize"
                label={
                  <span className="text-gray-300">
                    Приз{' '}
                    <Tooltip title="Введите приз (например, $1000 + Club share: $500)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите приз' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Приз"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddResultCancel} className="text-white border-gray-500">
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
            onClick={showDeleteResultModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Удалить последний результат
          </button>

          <Modal
            title={<span className="text-white">Удалить последний результат</span>}
            open={isDeleteResultModalVisible}
            onCancel={handleDeleteResultCancel}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">Вы уверены, что хотите удалить последний результат?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleDeleteResultCancel} className="text-white border-gray-500">
                Отмена
              </Button>
              <Button onClick={handleDeleteResult} className="bg-red-600 hover:bg-red-700 text-white">
                Удалить
              </Button>
            </div>
          </Modal>

          <button
            onClick={showAssignTeamToResultModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Привязать команду к результату
          </button>

          <Modal
            title={<span className="text-white">Привязать команду к результату</span>}
            open={isAssignTeamToResultModalVisible}
            onCancel={handleAssignTeamToResultCancel}
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
                    Место{' '}
                    <Tooltip title="Введите место, к которому привязать команду">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите место' }]}
              >
                <Input
                  type="number"
                  className="custom-input"
                  placeholder="Место"
                />
              </Form.Item>
              <Form.Item
                name="team_name"
                label={
                  <span className="text-gray-300">
                    Название команды{' '}
                    <Tooltip title="Введите название команды">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите название команды' }]}
              >
                <Input
                  className="custom-input"
                  placeholder="Название команды"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAssignTeamToResultCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Привязать
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <button
            onClick={showRemoveTeamFromResultModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Отвязать команду от результата
          </button>

          <Modal
            title={<span className="text-white">Отвязать команду от результата</span>}
            open={isRemoveTeamFromResultModalVisible}
            onCancel={handleRemoveTeamFromResultCancel}
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
                    Место{' '}
                    <Tooltip title="Введите место, от которого отвязать команду">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Пожалуйста, укажите место' }]}
              >
                <Input
                  type="number"
                  className="custom-input"
                  placeholder="Место"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleRemoveTeamFromResultCancel} className="text-white border-gray-500">
                    Отмена
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                    Отвязать
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminTournamentPanel;