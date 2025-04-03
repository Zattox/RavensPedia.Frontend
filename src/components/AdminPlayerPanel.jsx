// src/components/AdminPlayerPanel.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from '@/context/NotificationContext';
import api from '@/api';

function AdminPlayerPanel({ player_nickname }) {
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeletePlayerModalVisible, setIsDeletePlayerModalVisible] = useState(false);
  const [updateForm] = Form.useForm();

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

  // Update Player Modal
  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

 const handleUpdatePlayer = async (values) => {
    const updatedPlayer = {};
    if (values.steam_id) updatedPlayer.steam_id = values.steam_id;
    if (values.nickname) updatedPlayer.nickname = values.nickname;
    if (values.name) updatedPlayer.name = values.name;
    if (values.surname) updatedPlayer.surname = values.surname;

    if (Object.keys(updatedPlayer).length > 0) {
      try {
        await api.patch(`/players/${player_nickname}/`, updatedPlayer);
        showNotification('success', 'Успех!', 'Информация об игроке успешно обновлена.'); // Заменяем alert
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        window.location.reload();
      } catch (error) {
        console.error('Ошибка при обновлении игрока:', error);
        showNotification('error', 'Ошибка!', 'Не удалось обновить информацию об игроке.'); // Заменяем alert
      }
    } else {
      showNotification('error', 'Ошибка!', 'Хотя бы одно поле должно быть заполнено для обновления.'); // Заменяем alert
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // Delete Player
  const showDeletePlayerModal = () => {
    setIsDeletePlayerModalVisible(true);
  };

  const handleDeletePlayer = async () => {
    try {
      await api.delete(`/players/${player_nickname}/`);
      showNotification('success', 'Успех!', 'Игрок успешно удален!'); // Заменяем alert
      setIsDeletePlayerModalVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении игрока:', error);
      showNotification('error', 'Ошибка!', 'Не удалось удалить игрока.'); // Заменяем alert
      setIsDeletePlayerModalVisible(false);
    }
  };

  const handleDeletePlayerCancel = () => {
    setIsDeletePlayerModalVisible(false);
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Управление игроком (Админ)</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Действия с игроком</h3>
          <button
              onClick={showUpdateModal}
              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full h-10 text-sm mb-2"
          >
            Обновить информацию
          </button>

          <Modal
              title={<span className="text-white">Обновить информацию об игроке</span>}
              open={isUpdateModalVisible}
              onCancel={handleUpdateCancel}
              footer={null}
              className="custom-modal"
          >
            <Form
                form={updateForm}
                onFinish={handleUpdatePlayer}
                layout="vertical"
                className="text-white"
            >
              <Form.Item
                  name="steam_id"
                  label={
                    <span className="text-gray-300">
                    Steam ID{' '}
                      <Tooltip title="Введите новый Steam ID (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500"/>
                    </Tooltip>
                  </span>
                  }
              >
                <Input
                    className="custom-input"
                    placeholder="Новый Steam ID (необязательно)"
                />
              </Form.Item>
              <Form.Item
                  name="nickname"
                  label={
                    <span className="text-gray-300">
                    Никнейм{' '}
                      <Tooltip title="Введите новый никнейм (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500"/>
                    </Tooltip>
                  </span>
                  }
              >
                <Input
                    className="custom-input"
                    placeholder="Новый никнейм (необязательно)"
                />
              </Form.Item>
              <Form.Item
                  name="name"
                  label={
                    <span className="text-gray-300">
                    Имя{' '}
                      <Tooltip title="Введите новое имя (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500"/>
                    </Tooltip>
                  </span>
                  }
              >
                <Input
                    className="custom-input"
                    placeholder="Новое имя (необязательно)"
                />
              </Form.Item>
              <Form.Item
                  name="surname"
                  label={
                    <span className="text-gray-300">
                    Фамилия{' '}
                      <Tooltip title="Введите новую фамилию (оставьте пустым, чтобы не изменять)">
                      <InfoCircleOutlined className="text-gray-500"/>
                    </Tooltip>
                  </span>
                  }
              >
                <Input
                    className="custom-input"
                    placeholder="Новая фамилия (необязательно)"
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
            <p className="text-white">Вы уверены, что хотите удалить игрока {player_nickname}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleDeletePlayerCancel} className="text-white border-gray-500">
                Отмена
              </Button>
              <Button onClick={handleDeletePlayer} className="bg-red-600 hover:bg-red-700 text-white">
                Удалить
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminPlayerPanel;