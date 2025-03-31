// src/pages/TeamPage.jsx
import { useParams } from 'react-router-dom';

function TeamPage() {
  const { team_name } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Страница команды</h1>
        <p className="text-gray-300">Это страница команды: <span className="text-blue-400">{team_name}</span></p>
      </div>
    </div>
  );
}

export default TeamPage;