import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import { NotificationContext } from "@/context/NotificationContext";

import api from "@/api";

// AdminNewsPanel component for managing news-related admin functionalities
function AdminNewsPanel({ newsId, setNews, refreshNews }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const notificationApi = useContext(NotificationContext); // Accessing notification system from context

  // State for controlling visibility of modals
  const [isNewsModalVisible, setIsNewsModalVisible] = useState(false); // Update news modal visibility
  const [isDeleteNewsModalVisible, setIsDeleteNewsModalVisible] =
    useState(false); // Delete news modal visibility

  // Form instance for managing form data and validation
  const [newsForm] = Form.useForm();

  // Utility function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handler to show the update news modal
  const showNewsModal = () => setIsNewsModalVisible(true);

  // Handler to update news information
  const handleUpdateNews = async (values) => {
    const updatedNews = {};
    if (values.title) updatedNews.title = values.title; // Add title if provided
    if (values.content) updatedNews.content = values.content; // Add content if provided
    if (values.author) updatedNews.author = values.author; // Add author if provided

    // Check if at least one field is filled for update
    if (Object.keys(updatedNews).length > 0) {
      try {
        const response = await api.patch(`/news/${newsId}/`, updatedNews); // Send PATCH request to update news
        setNews(response.data); // Update parent component state with new data
        refreshNews(); // Trigger refresh of news data
        showNotification("success", "Success!", "News updated successfully!");
        setIsNewsModalVisible(false); // Close the modal
        newsForm.resetFields(); // Clear form fields
      } catch (error) {
        console.error("Error updating news:", error); // Log error details
        const errorDetail =
          error.response?.data?.detail || "Failed to update news"; // Extract error message
        showNotification("error", "Error!", errorDetail); // Show error notification
      }
    } else {
      showNotification(
        "error",
        "Error!",
        "At least one field must be filled to update.",
      ); // Notify if no fields are filled
    }
  };

  // Handler to show the delete news modal
  const showDeleteNewsModal = () => setIsDeleteNewsModalVisible(true);

  // Handler to delete the news item
  const handleDeleteNews = async () => {
    try {
      await api.delete(`/news/${newsId}/`); // Send DELETE request to remove news
      showNotification("success", "Success!", "News deleted successfully!");
      setIsDeleteNewsModalVisible(false); // Close the modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting news:", error); // Log error details
      const errorDetail =
        error.response?.data?.detail || "Failed to delete news"; // Extract error message
      showNotification("error", "Error!", errorDetail); // Show error notification
      setIsDeleteNewsModalVisible(false); // Close the modal even on error
    }
  };

  // Generic handler to close modals and reset forms
  const handleCancel = (setModalVisible, form) => {
    setModalVisible(false);
    form?.resetFields(); // Reset form fields if form exists
  };

  // Render admin news panel UI
  return (
    <div className="fixed top-24 right-4 w-80 bg-gray-800 p-6 rounded-lg shadow-md text-white z-20 admin-panel">
      <h2 className="text-2xl font-bold mb-4 text-center">
        News Management (Admin)
      </h2>
      <div className="space-y-4">
        {/* Update News Button */}
        <Button
          onClick={showNewsModal}
          className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Update News
        </Button>

        {/* Update News Modal */}
        <Modal
          title={<span className="text-white">Update News</span>}
          open={isNewsModalVisible}
          onCancel={() => handleCancel(setIsNewsModalVisible, newsForm)}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={newsForm}
            onFinish={handleUpdateNews}
            layout="vertical"
            className="text-white"
          >
            <Form.Item
              name="title"
              label={
                <span className="text-gray-300">
                  Title{" "}
                  <Tooltip title="Enter new news title (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New title (optional)"
              />
            </Form.Item>
            <Form.Item
              name="content"
              label={
                <span className="text-gray-300">
                  Content{" "}
                  <Tooltip title="Enter new news content (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                className="custom-textarea"
                placeholder="New content (optional)"
              />
            </Form.Item>
            <Form.Item
              name="author"
              label={
                <span className="text-gray-300">
                  Author{" "}
                  <Tooltip title="Enter new news author (leave blank to keep unchanged)">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                className="custom-input"
                placeholder="New author (optional)"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleCancel(setIsNewsModalVisible, newsForm)}
                  className="text-white border-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:!bg-blue-700"
                >
                  Update
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete News Button */}
        <Button
          onClick={showDeleteNewsModal}
          className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 w-full border border-gray-500"
        >
          Delete News
        </Button>

        {/* Delete News Modal */}
        <Modal
          title={<span className="text-white">Delete News</span>}
          open={isDeleteNewsModalVisible}
          onCancel={() => handleCancel(setIsDeleteNewsModalVisible, null)}
          footer={null}
          className="custom-modal"
        >
          <p className="text-white">
            Are you sure you want to delete this news?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => handleCancel(setIsDeleteNewsModalVisible, null)}
              className="text-white border-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNews}
              className="bg-red-600 hover:!bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminNewsPanel;
