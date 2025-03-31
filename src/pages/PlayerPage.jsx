// src/pages/PlayerPage.jsx
import { useParams } from 'react-router-dom';

function PlayerPage() {
  const { player_id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Страница игрока</h1>
        <p className="text-gray-300">Это страница игрока с ID: <span className="text-blue-400">{player_id}</span></p>
      </div>
    </div>
  );
}

export default PlayerPage;