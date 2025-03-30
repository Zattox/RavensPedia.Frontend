// src/pages/ProfilePage.jsx
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';

function ProfilePage() {
  const { user, loading } = useAuth();

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
            <div className="mt-10 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center text-xl">Не удалось загрузить данные профиля. Пожалуйста, войдите снова.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;