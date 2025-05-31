import toast from "react-hot-toast";
import axios from "axios";

const baseurl = "http://localhost:5050";

export const handleSignup = async (signupData) => {
  if (signupData.password !== signupData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post(
      `${baseurl}/api/auth/register`,
      {
        username: `${signupData.firstName} ${signupData.lastName}`,
        email: signupData.email,
        password: signupData.password,
        role: "user",
      }
    );

    localStorage.setItem("token", res.data.token);
    toast.success("Signup Successful!");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Signup failed");
    throw err;
  }
};

export const handleLogin = async (loginData) => {
  try {
    const res = await axios.post(
      `${baseurl}/api/auth/login`,
      {
        email: loginData.email,
        password: loginData.password,
      }
    );

    localStorage.setItem("token", res.data.token);
    toast.success("Login Successful!");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Login failed");
    throw err;
  }
};