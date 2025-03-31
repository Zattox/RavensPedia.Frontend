// src/components/AdminNewsPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '@/api';

function AdminNewsPanel({ newsId, setNews }) {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleUpdateNews = async (values) => {
    // Фильтруем только заполненные поля
    const updatedNews = {};
    if (values.title) updatedNews.title = values.title;
    if (values.content) updatedNews.content = values.content;
    if (values.author) updatedNews.author = values.author;

    // Если есть хотя бы одно заполненное поле, отправляем запрос
    if (Object.keys(updatedNews).length > 0) {
      try {
        const response = await api.patch(`/news/${newsId}/`, updatedNews);
        setNews(response.data);
        alert('Новость успешно обновлена!');
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        alert('Не удалось обновить новость.');
      }
    } else {
      alert('Хотя бы одно поле должно быть заполнено для обновления.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteNews = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await api.delete(`/news/${newsId}/`);
        alert('Новость успешно удалена!');
        navigate('/'); // Перенаправляем на главную страницу после удаления
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        alert('Не удалось удалить новость.');
      }
    }
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
                    <InfoCircleOutlined className="text-gray-500" />
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
                    <InfoCircleOutlined className="text-gray-500" />
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
                    <InfoCircleOutlined className="text-gray-500" />
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
          onClick={handleDeleteNews}
          className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
        >
          Удалить новость
        </button>
      </div>
    </div>
  );
}

export default AdminNewsPanel;