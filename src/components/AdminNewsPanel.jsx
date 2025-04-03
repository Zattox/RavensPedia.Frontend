// src/components/AdminNewsPanel.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from '@/context/NotificationContext';
import api from '@/api';

function AdminNewsPanel({ newsId, setNews }) {
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteNewsModalVisible, setIsDeleteNewsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: 'bottomRight',
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleUpdateNews = async (values) => {
    const updatedNews = {};
    if (values.title) updatedNews.title = values.title;
    if (values.content) updatedNews.content = values.content;
    if (values.author) updatedNews.author = values.author;

    if (Object.keys(updatedNews).length > 0) {
      try {
        const response = await api.patch(`/news/${newsId}/`, updatedNews);
        setNews(response.data);
        showNotification('success', 'Успех!', 'Новость успешно обновлена!'); // Заменяем alert
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        showNotification('error', 'Ошибка!', 'Не удалось обновить новость.'); // Заменяем alert
      }
    } else {
      showNotification('error', 'Ошибка!', 'Хотя бы одно поле должно быть заполнено для обновления.'); // Заменяем alert
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showDeleteNewsModal = () => {
    setIsDeleteNewsModalVisible(true);
  };

  const handleDeleteNews = async () => {
    try {
      await api.delete(`/news/${newsId}/`);
      showNotification('success', 'Успех!', 'Новость успешно удалена!'); // Заменяем alert
      setIsDeleteNewsModalVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
      showNotification('error', 'Ошибка!', 'Не удалось удалить новость.'); // Заменяем alert
      setIsDeleteNewsModalVisible(false);
    }
  };

  const handleDeleteNewsCancel = () => {
    setIsDeleteNewsModalVisible(false);
  };

  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Управление новостью (Админ)</h2>
      <div className="space-y-4">
        <button
            onClick={showModal}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full"
        >
          Обновить новость
        </button>

        {/* Модальное окно с формой */}
        <Modal
            title={<span className="text-white">Обновить новость</span>}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            className="custom-modal"
        >
          <Form
              form={form}
              onFinish={handleUpdateNews}
              layout="vertical"
              className="text-white"
          >
            <Form.Item
                name="title"
                label={
                  <span className="text-gray-300">
                  Заголовок{' '}
                    <Tooltip title="Введите новый заголовок новости (оставьте пустым, чтобы не изменять)">
                    <InfoCircleOutlined className="text-gray-500"/>
                  </Tooltip>
                </span>
                }
            >
              <Input
                  className="custom-input"
                  placeholder="Новый заголовок (необязательно)"
              />
            </Form.Item>
            <Form.Item
                name="content"
                label={
                  <span className="text-gray-300">
                  Содержание{' '}
                    <Tooltip title="Введите новое содержание новости (оставьте пустым, чтобы не изменять)">
                    <InfoCircleOutlined className="text-gray-500"/>
                  </Tooltip>
                </span>
                }
            >
              <Input.TextArea
                  rows={4}
                  className="custom-textarea"
                  placeholder="Новое содержание (необязательно)"
              />
            </Form.Item>
            <Form.Item
                name="author"
                label={
                  <span className="text-gray-300">
                  Автор{' '}
                    <Tooltip title="Введите нового автора новости (оставьте пустым, чтобы не изменять)">
                    <InfoCircleOutlined className="text-gray-500"/>
                  </Tooltip>
                </span>
                }
            >
              <Input
                  className="custom-input"
                  placeholder="Новый автор (необязательно)"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCancel} className="text-white border-gray-500">
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
            onClick={showDeleteNewsModal}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
        >
          Удалить новость
        </button>

        <Modal
            title={<span className="text-white">Удалить новость</span>}
            open={isDeleteNewsModalVisible}
            onCancel={handleDeleteNewsCancel}
            footer={null}
            className="custom-modal"
        >
          <p className="text-white">Вы уверены, что хотите удалить эту новость?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleDeleteNewsCancel} className="text-white border-gray-500">
              Отмена
            </Button>
            <Button onClick={handleDeleteNews} className="bg-red-600 hover:bg-red-700 text-white">
              Удалить
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminNewsPanel;