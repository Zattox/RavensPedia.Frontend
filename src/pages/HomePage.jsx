// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Pagination, Modal, Form, Input, Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';

function HomePage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false); // Для управления видимостью модального окна
  const [form] = Form.useForm(); // Хук для управления формой
  const newsPerPage = 12;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news/');
        setNewsData(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        setError('Не удалось загрузить новости. Проверьте подключение к серверу.');
      }
    };

    fetchNews();
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

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateNews = async (values) => {
    try {
      const response = await api.post('/news/', {
        title: values.title,
        content: values.content,
        author: values.author,
      });
      setNewsData([response.data, ...newsData]); // Добавляем новую новость в начало списка
      alert('Новость успешно создана!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при создании новости:', error);
      alert('Не удалось создать новость.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Последние новости</h2>
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={showModal}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Добавить новость
            </button>
          </div>
        )}

        {/* Модальное окно с формой */}
        <Modal
          title={<span className="text-white">Создать новую новость</span>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={form}
            onFinish={handleCreateNews}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="title"
              label={
                <span className="text-gray-300">
                  Заголовок{' '}
                  <Tooltip title="Укажите заголовок новости (например, 'TORSZ: THIS COULD BE MY YEAR')">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите заголовок новости' }]}
            >
              <Input
                className="custom-input"
                placeholder="Например, TORSZ: THIS COULD BE MY YEAR"
              />
            </Form.Item>
            <Form.Item
              name="content"
              label={
                <span className="text-gray-300">
                  Содержание{' '}
                  <Tooltip title="Введите текст новости (например, краткое описание события)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите содержание новости' }]}
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="Например, It feels amazing to play three finals in a row..."
              />
            </Form.Item>
            <Form.Item
              name="author"
              label={
                <span className="text-gray-300">
                  Автор{' '}
                  <Tooltip title="Укажите автора новости (например, имя журналиста)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Пожалуйста, укажите автора новости' }]}
            >
              <Input
                className="custom-input"
                placeholder="Например, Vladislav"
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

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : newsData.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-4">
              {currentNews.map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onClick={() => navigate(`/news/${news.id}`)}
                  formatDate={formatDate}
                />
              ))}
            </div>
            {newsData.length > newsPerPage && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={newsPerPage}
                  total={newsData.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-white text-center">Загрузка новостей...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;