const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');
const { RegisterDto, LoginDto } = require('../dtos/auth.dto');

/**
 * Registers a new owner.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.register = async (req, res) => {
  try {
    const dto = RegisterDto.fromBody(req.body);

    if (!dto.isValid()) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await Owner.findByEmail(dto.email);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await Owner.create(dto.name, dto.email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

/**
 * Authenticates an owner and returns a signed JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.login = async (req, res) => {
  try {
    const dto = LoginDto.fromBody(req.body);

    if (!dto.isValid()) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await Owner.findByEmail(dto.email);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(dto.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
