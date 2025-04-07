import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { NotificationContext } from "@/context/NotificationContext";
import AdminNewsPanel from "@/components/AdminNewsPanel";

function NewsDetailPage() {
  const { news_id } = useParams();
  // State for managing news data, loading status, errors, and refresh
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);

  // Display notification based on type
  const showNotification = (type, message, description) => {
    notificationApi[type]({ message, description, placement: "bottomRight" });
  };

  // Fetch news details when component mounts or news_id/refreshTrigger changes
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news/${news_id}/`);
        setNews(response.data);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to load news.");
        showNotification("error", "Error!", "Failed to load news.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [news_id, refreshTrigger]);

  // Trigger news refresh
  const refreshNews = () => setRefreshTrigger((prev) => prev + 1);

  // Format date string to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Loading...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  // Render placeholder if news is not yet loaded
  if (!news) {
    return <p className="text-white text-center">Loading news...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate("/")}
          className="mb-6 text-white font-semibold bg-blue-600 hover:!bg-blue-700 px-4 py-2 rounded transition duration-200"
        >
          Back to News
        </Button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <h1
            className="text-4xl md:text-5xl font-bold text-red-500 uppercase mb-6 text-center leading-tight"
            style={{ wordBreak: "break-all" }}
          >
            {news.title}
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <p className="text-lg text-gray-400 italic mb-2 md:mb-0">
              Author: {news.author}
            </p>
            <p className="text-sm text-gray-500 uppercase">
              {formatDate(news.created_at)}
            </p>
          </div>
          <div className="prose max-w-none">
            <p
              className="text-xl text-white font-semibold mb-6 leading-relaxed"
              style={{ wordBreak: "break-all" }}
            >
              {news.content.split(".")[0] + "."}
            </p>
            {news.content
              .split(".")
              .slice(1)
              .map((sentence, index) => (
                <p
                  key={index}
                  className="text-gray-300 mb-4 leading-relaxed"
                  style={{ wordBreak: "break-all" }}
                >
                  {sentence.trim() + (sentence ? "." : "")}
                </p>
              ))}
          </div>
        </div>
      </div>
      {isAdmin() && (
        <AdminNewsPanel
          newsId={news_id}
          setNews={setNews}
          refreshNews={refreshNews}
        />
      )}
    </div>
  );
}

export default NewsDetailPage;
