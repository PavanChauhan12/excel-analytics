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
        status: user.status,
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
    excelRecords: user.excelRecords,
    status: user.status
  });
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'No credential provided' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = new User({
        username: name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'user',
        googleId,
        profilePicture: picture
      });
      await user.save();
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      }
    }

    const jwtToken = generateToken(user);
    res.json({
      token: jwtToken,
      role: user.role,
      username: user.username,
      email: user.email,
      excelRecords: user.excelRecords || []
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: 'Google login failed: ' + error.message });
  }
};