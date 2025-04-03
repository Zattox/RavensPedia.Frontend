import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from '@/context/NotificationContext';
import api from '@/api';

function AdminTeamPanel({ team_name, refreshTeam }) { // Заменяем setTeam на refreshTeam
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);
  const [isDeletePlayerModalVisible, setIsDeletePlayerModalVisible] = useState(false);
  const [isDeleteTeamConfirmModalVisible, setIsDeleteTeamConfirmModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [addPlayerForm] = Form.useForm();
  const [deletePlayerForm] = Form.useForm();

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

  // Обновить информацию о команде
  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdateTeam = async (values) => {
    const updatedTeam = {};
    if (values.name) updatedTeam.name = values.name;
    if (values.description) updatedTeam.description = values.description;

    if (Object.keys(updatedTeam).length > 0) {
      try {
        await api.patch(`/teams/${team_name}/`, updatedTeam);
        await refreshTeam(); // Перезапрашиваем данные
        showNotification('success', 'Успех!', 'Информация о команде успешно обновлена.');
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
      } catch (error) {
        console.error('Ошибка при обновлении команды:', error);
        showNotification('error', 'Ошибка!', 'Не удалось обновить информацию о команде.');
      }
    } else {
      showNotification('error', 'Ошибка!', 'Хотя бы одно поле должно быть заполнено для обновления.');
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // Добавить игрока
  const showAddPlayerModal = () => {
    setIsAddPlayerModalVisible(true);
  };

  const handleAddPlayer = async (values) => {
    try {
      await api.patch(`/teams/${team_name}/add_player/${values.player_nickname}/`);
      showNotification('success', 'Успех!', `Игрок ${values.player_nickname} успешно добавлен!`);
      await refreshTeam(); // Перезапрашиваем данные
      setIsAddPlayerModalVisible(false);
      addPlayerForm.resetFields();
    } catch (error) {
      console.error('Ошибка при добавлении игрока:', error.response?.data || error);
      showNotification('error', 'Ошибка!', 'Не удалось добавить игрока.');
    }
  };

  const handleAddPlayerCancel = () => {
    setIsAddPlayerModalVisible(false);
    addPlayerForm.resetFields();
  };

  // Удалить игрока
  const showDeletePlayerModal = () => {
    setIsDeletePlayerModalVisible(true);
  };

  const handleDeletePlayer = async (values) => {
    try {
      await api.delete(`/teams/${team_name}/delete_player/${values.player_nickname}/`);
      showNotification('success', 'Успех!', `Игрок ${values.player_nickname} успешно удален!`);
      await refreshTeam(); // Перезапрашиваем данные
      setIsDeletePlayerModalVisible(false);
      deletePlayerForm.resetFields();
    } catch (error) {
      console.error('Ошибка при удалении игрока:', error.response?.data || error);
      showNotification('error', 'Ошибка!', 'Не удалось удалить игрока.');
    }
  };

  const handleDeletePlayerCancel = () => {
    setIsDeletePlayerModalVisible(false);
    deletePlayerForm.resetFields();
  };

  // Удалить команду
  const showDeleteTeamConfirmModal = () => {
    setIsDeleteTeamConfirmModalVisible(true);
  };

  const handleDeleteTeam = async () => {
    try {
      await api.delete(`/teams/${team_name}/`);
      showNotification('success', 'Успех!', 'Команда успешно удалена!');
      setIsDeleteTeamConfirmModalVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении команды:', error);
      showNotification('error', 'Ошибка!', 'Не удалось удалить команду.');
      setIsDeleteTeamConfirmModalVisible(false);
    }
  };

  const handleDeleteTeamCancel = () => {
    setIsDeleteTeamConfirmModalVisible(false);
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Управление командой (Админ)</h2>
      <div className="space-y-4">
        {/* Team Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Действия с командой</h3>
          <button
            onClick={showUpdateModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Обновить информацию
          </button>

          <Modal
            title={<span className="text-white">Обновить информацию о команде</span>}
            open={isUpdateModalVisible}
            onCancel={handleUpdateCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={updateForm}
              onFinish={handleUpdateTeam}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="name"
                label={
                  <span className="text-gray-300">
                    Название команды{' '}
                    <Tooltip title="Введите новое название команды (оставьте пустым, чтобы не изменять)">
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
                    <Tooltip title="Введите новое описание команды (оставьте пустым, чтобы не изменять)">
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
            onClick={showDeleteTeamConfirmModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить команду
          </button>

          <Modal
            title={<span className="text-white">Удалить команду</span>}
            open={isDeleteTeamConfirmModalVisible}
            onCancel={handleDeleteTeamCancel}
            footer={null}
            className="custom-modal"
          >
            <p className="text-white">Вы уверены, что хотите удалить команду {team_name}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleDeleteTeamCancel} className="text-white border-gray-500">
                Отмена
              </Button>
              <Button onClick={handleDeleteTeam} className="bg-red-600 hover:bg-red-700 text-white">
                Удалить
              </Button>
            </div>
          </Modal>
        </div>

        {/* Team Players Manager */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Управление игроками</h3>
          <button
            onClick={showAddPlayerModal}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Добавить игрока
          </button>

          <Modal
            title={<span className="text-white">Добавить игрока</span>}
            open={isAddPlayerModalVisible}
            onCancel={handleAddPlayerCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={addPlayerForm}
              onFinish={handleAddPlayer}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="player_nickname"
                label={
                  <span className="text-gray-300">
                    Никнейм игрока{' '}
                    <Tooltip title="Введите никнейм игрока для добавления в команду">
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
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleAddPlayerCancel} className="text-white border-gray-500">
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
            onClick={showDeletePlayerModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить игрока
          </button>

          <Modal
            title={<span className="text-white">Удалить игрока</span>}
            open={isDeletePlayerModalVisible}
            onCancel={handleDeletePlayerCancel}
            footer={null}
            className="custom-modal"
          >
            <Form
              form={deletePlayerForm}
              onFinish={handleDeletePlayer}
              layout="vertical"
              className="text-white"
            >
              <Form.Item
                name="player_nickname"
                label={
                  <span className="text-gray-300">
                    Никнейм игрока{' '}
                    <Tooltip title="Введите никнейм игрока для удаления из команды">
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
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleDeletePlayerCancel} className="text-white border-gray-500">
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
      </div>
    </div>
  );
}

export default AdminTeamPanel;