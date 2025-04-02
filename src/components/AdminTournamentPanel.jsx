// src/components/AdminTournamentPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';

function AdminTournamentPanel({ tournamentName }) {
  const navigate = useNavigate();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [isDeleteTeamModalVisible, setIsDeleteTeamModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [addTeamForm] = Form.useForm();
  const [deleteTeamForm] = Form.useForm();

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
        alert('Турнир успешно обновлен!');
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        window.location.reload();
      } catch (error) {
        console.error('Ошибка при обновлении турнира:', error);
        alert('Не удалось обновить турнир.');
      }
    } else {
      alert('Хотя бы одно поле должно быть заполнено для обновления.');
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // Delete Tournament
  const handleDeleteTournament = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить турнир ${tournamentName}?`)) {
      try {
        await api.delete(`/tournaments/${tournamentName}/`);
        alert('Турнир успешно удален!');
        navigate('/');
      } catch (error) {
        console.error('Ошибка при удалении турнира:', error);
        alert('Не удалось удалить турнир.');
      }
    }
  };

  // Add Team Modal
  const showAddTeamModal = () => {
    setIsAddTeamModalVisible(true);
  };

  const handleAddTeam = async (values) => {
    try {
      await api.patch(`/tournaments/${tournamentName}/add_team/${values.team_name}/`);
      alert('Команда успешно добавлена в турнир!');
      setIsAddTeamModalVisible(false);
      addTeamForm.resetFields();
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при добавлении команды:', error);
      alert('Не удалось добавить команду в турнир.');
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
      alert('Команда успешно удалена из турнира!');
      setIsDeleteTeamModalVisible(false);
      deleteTeamForm.resetFields();
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении команды:', error);
      alert('Не удалось удалить команду из турнира.');
    }
  };

  const handleDeleteTeamCancel = () => {
    setIsDeleteTeamModalVisible(false);
    deleteTeamForm.resetFields();
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
            onClick={handleDeleteTournament}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
          >
            Удалить турнир
          </button>
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
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full h-10 text-sm"
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
      </div>
    </div>
  );
}

export default AdminTournamentPanel;