# 📊 Excel Analytics – AI-Powered Excel Visualization Platform

**Excel Analytics** is a powerful web platform that enables users to upload, analyze, and visualize Excel data through interactive 2D and 3D charts. With integrated AI insights and a structured admin/user panel system, it simplifies complex data storytelling for all levels of users.

🔗 **Live Demo**: [excel-analytics-gray.vercel.app](https://excel-analytics-gray.vercel.app/)

---

## ✨ Features

### 🧑‍💼 User Panel
- 📤 Upload `.xlsx` Excel files
- 📊 Generate interactive **2D** and **3D** charts
- 🤖 **AI Insights**: Auto-suggest suitable chart types based on your data
- 📨 Request admin access
- 📁 View uploaded files & charts history

### 🛡️ Admin Panel
- 👥 View and manage all users
- 📂 Track uploaded files and generated charts per user
- ✅ Approve or reject admin requests from users
- 🧾 Secure admin-only dashboard and access controls

---

## 🖼️ Preview

![Dashboard Preview](assets/dashboard.jpeg)
![Chart Preview](assets/chart-preview.png)

---

## 🧱 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React (Vite), CSS, Chart.js, Three.js |
| Backend     | Node.js, Express.js           |
| Database    | MongoDB (Mongoose)            |
| Auth        | JWT, Role-based access (Admin/User) |
| Deployment  | Vercel (Frontend), Render/Cyclic (Backend) |
| AI Insights | OpenAI API / Custom Logic     |
| File Parsing | `xlsx` (Excel Parser Library) |

---

## 🚀 Getting Started (Local Setup)

### ⚙️ Backend

1. Clone the repo & install dependencies:
   ```bash
   cd backend
   npm install
2. Create a .env file
   ```bash
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_key

4. Run the server:
   ```bash
   npm run start

**The backend will run at *http://localhost:5000*.**

### 🎨 Frontend
1. Navigate to frontend and install dependencies:
   ```bash
   cd frontend
   npm install

2. Create .env in the frontend
   ```bash
   VITE_API_URL=http://localhost:5000

3. Start the frontend:
   ```bash
   npm run dev

**The app will be running at *http://localhost:5173*.**

---

## 🌐 Deployment
- Frontend: Vercel
- Backend: Render or Cyclic
- Ensure CORS is enabled and frontend *.env* uses the deployed API URL

---

## 🤝 Contributing
Have ideas to improve Postify?
Feel free to fork, open an issue, or submit a PR.

---

## 👤 Author
Pavan Chauhan
