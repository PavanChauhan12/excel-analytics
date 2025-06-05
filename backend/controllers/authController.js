const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    const token = generateToken(user);
    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        role: user.role,
        username: user.username,
        email: user.email,
        excelRecords: user.excelRecords
      });
  } catch (err) {
    res.status(400).json({ error: "User exists." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.json({
    token,
    role: user.role,
    username: user.username,
    email: user.email,
    excelRecords: user.excelRecords
  });
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        username: name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        role: 'user'
      });
      await user.save();
    }

    const jwtToken = generateToken(user);
    res.json({
      token: jwtToken,
      role: user.role,
      username: user.username,
      email: user.email,
      excelRecords: user.excelRecords
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: 'Google login failed' });
  }
};