const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const uploadRoute = require('./routes/upload');
const chartRoute = require('./routes/chartRoute');
const adminRoutes = require("./routes/adminRoute")
const userRoutes = require("./routes/user")
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', uploadRoute);
app.use('/api/chart', chartRoute);
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
