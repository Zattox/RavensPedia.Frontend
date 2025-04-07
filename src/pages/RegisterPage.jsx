import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { Form, Input, Button, Alert } from "antd";
import api from "@/api";

function RegisterPage() {
  // State for managing error messages and loading status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Determine redirect path after registration
  const from = location.state?.from?.pathname || "/";
  const redirectTo = ["/login", "/register"].includes(from) ? "/" : from;

  // Handle form submission for registration
  const onFinish = async (values) => {
    try {
      setError("");
      setLoading(true);
      // Register user
      await api.post(
        "/auth/register/",
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true },
      );
      // Auto-login after successful registration
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.email ||
        error.response?.data?.detail ||
        "Registration error.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input placeholder="Email" size="large" className="custom-input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              size="large"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="bg-blue-600 hover:!bg-blue-700"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
