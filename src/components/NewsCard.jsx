// src/components/NewsCard.jsx
import { Card } from 'antd';

function NewsCard({ news, onClick, formatDate }) {
  return (
    <Card
      hoverable
      className="text-left"
      style={{
        backgroundColor: '#1a1a1a',
        color: 'rgba(255, 255, 255, 0.87)',
        height: '150px',
          width: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onClick={onClick}
    >
      <div>
        <h3
          className="text-lg font-semibold line-clamp-2"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {news.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1">
          {formatDate(news.created_at)}
        </p>
        <p className="text-sm line-clamp-1">Автор: {news.author}</p>
      </div>
    </Card>
  );
}

export default NewsCard;