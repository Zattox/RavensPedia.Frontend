// src/pages/ProfilePage.jsx
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { useState } from 'react';
import api from '@/api';

function ProfilePage() {
  const { user, loading, isSuperAdmin, checkAuth } = useAuth();
  const [changeRoleData, setChangeRoleData] = useState({ user_email: '', new_role: '' });
  const [changeRoleMessage, setChangeRoleMessage] = useState(null);
  const [changeRoleError, setChangeRoleError] = useState(null);

  const handleChangeRoleInput = (e) => {
    const { name, value } = e.target;
    setChangeRoleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeRole = async (e) => {
    e.preventDefault();
    setChangeRoleMessage(null);
    setChangeRoleError(null);

    if (!changeRoleData.user_email || !changeRoleData.new_role) {
      setChangeRoleError('Пожалуйста, заполните все поля.');
      return;
    }

    if (!['user', 'admin'].includes(changeRoleData.new_role)) {
      setChangeRoleError('Недопустимая роль. Выберите "user" или "admin".');
      return;
    }

    try {
      const response = await api.patch('/auth/change_user_role/', {
        user_email: changeRoleData.user_email,
        new_role: changeRoleData.new_role,
      });
      setChangeRoleMessage('Роль успешно изменена!');
      setChangeRoleData({ user_email: '', new_role: '' }); // Очистка формы
      await checkAuth(); // Обновляем данные пользователя
    } catch (error) {
      console.error('Ошибка при изменении роли:', error.response?.data || error.message);
      if (error.response?.data?.detail) {
        console.error('Детали ошибок:', error.response.data.detail);
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map((err) => {
            if (typeof err === 'object') {
              const field = err.loc ? err.loc.join('.') : 'unknown field';
              const message = err.msg || err.toString();
              return `${field}: ${message}`;
            }
            return err.toString();
          }).join(', ');
          setChangeRoleError(errorMessages);
        } else if (error.response.data.detail === 'User not found') {
          setChangeRoleError('Пользователь с таким email не найден. Пожалуйста, зарегистрируйте пользователя сначала.');
        } else {
          setChangeRoleError(error.response.data.detail);
        }
      } else {
        setChangeRoleError('Ошибка при изменении роли. Проверьте данные и попробуйте снова.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-7xl bg-gray-800 p-10 rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold mb-10 text-white text-center">Личный профиль</h2>
        {loading ? (
          <p className="text-white text-center text-xl">Загрузка...</p>
        ) : user ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-700 p-6 rounded-lg">
              <span className="text-gray-300 font-semibold text-xl">Email:</span>
              <span className="text-white text-xl">{user.email}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-6 rounded-lg">
              <span className="text-gray-300 font-semibold text-xl">Роль:</span>
              <span className="text-white text-xl">{user.role || 'Не указана'}</span>
            </div>

            {/* Форма для изменения роли (только для super_admin) */}
            {isSuperAdmin() && (
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-white mb-4">Изменить роль пользователя</h3>
                <form onSubmit={handleChangeRole} className="space-y-4">
                  <div>
                    <label htmlFor="user_email" className="block text-gray-300 font-semibold mb-2">
                      Email пользователя:
                    </label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      value={changeRoleData.user_email}
                      onChange={handleChangeRoleInput}
                      className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="Введите email пользователя"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new_role" className="block text-gray-300 font-semibold mb-2">
                      Новая роль:
                    </label>
                    <select
                      id="new_role"
                      name="new_role"
                      value={changeRoleData.new_role}
                      onChange={handleChangeRoleInput}
                      className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Выберите роль</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
                  >
                    Изменить роль
                  </button>
                </form>
                {changeRoleMessage && (
                  <p className="text-green-500 text-center mt-4">{changeRoleMessage}</p>
                )}
                {changeRoleError && (
                  <p className="text-red-500 text-center mt-4">{changeRoleError}</p>
                )}
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center text-xl">
            Не удалось загрузить данные профиля. Пожалуйста, войдите снова.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;