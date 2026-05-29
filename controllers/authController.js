const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

   res.cookie('accessToken', token, {
    httpOnly: true,
    secure: false, // true in production HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

res.status(200).json({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user).select('-password');

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  signup,
  login,
  getMe
};