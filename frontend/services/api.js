import toast from "react-hot-toast";
import axios from "axios";


const baseurl = "http://localhost:5050";

export const handleSignup = async (signupData,navigate) => {
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
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("role", res.data.role);
    toast.success("Signup Successful!");
    navigate("/dashboard");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Signup failed");
    throw err;
  }
};

export const handleLogin = async (loginData,navigate) => {
  try {
    const res = await axios.post(
      `${baseurl}/api/auth/login`,
      {
        email: loginData.email,
        password: loginData.password,
      }
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("role", res.data.role);
    toast.success("Login Successful!");
    navigate("/dashboard");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Login failed");
    throw err;
  }
};

export const handleSignOut = async (navigate) => {
  try{
  localStorage.clear();
  navigate("/");
  }
  catch(err){
    console.log(err);
  }
}

export const uploadExcelFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("excelFile", file);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post("http://localhost:5050/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
      onUploadProgress,
    });

    toast.success("File uploaded successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || "Upload failed";
    toast.error(`Upload error: ${errorMessage}`);
    throw error;
  }
}