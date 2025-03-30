// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import api from '@/api';
import LogoutButton from '@/components/LogoutButton';

function ProfilePage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me/');
        setEmail(response.data.email);
      } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        setError('Не удалось загрузить профиль. Пожалуйста, войдите снова.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Личный профиль</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-white">Email: {email || 'Загрузка...'}</p>
        )}
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;