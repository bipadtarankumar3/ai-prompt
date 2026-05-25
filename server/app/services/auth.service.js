const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const config = require('../config/env');

class AuthService {
  async login(email, password) {
    let lookupEmail = email;
    if (email === 'admin') {
      lookupEmail = 'admin@example.com';
    }
    const user = await userRepository.findByEmail(lookupEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '1d' } // token expires in 24 hours
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();
