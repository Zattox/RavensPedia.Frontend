// src/components/AdminNewsPanel.jsx
import { useNavigate } from 'react-router-dom';
import api from '@/api';

function AdminNewsPanel({ newsId, setNews }) {
  const navigate = useNavigate();

  const handleUpdateNews = async () => {
    const updatedNews = {
      title: prompt('Введите новый заголовок новости:', ''),
      content: prompt('Введите новое содержание новости:', ''),
      author: prompt('Введите нового автора новости:', ''),
    };

    if (updatedNews.title && updatedNews.content && updatedNews.author) {
      try {
        const response = await api.patch(`/news/${newsId}/`, updatedNews);
        setNews(response.data);
        alert('Новость успешно обновлена!');
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        alert('Не удалось обновить новость.');
      }
    } else {
      alert('Все поля должны быть заполнены.');
    }
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
          onClick={handleUpdateNews}
          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full"
        >
          Обновить новость
        </button>
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