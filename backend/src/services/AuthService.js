/**
 * Authentication Service - Handle user authentication logic
 */

const { generateJWT, hashPassword, comparePasswords } = require('../utils/jwt');
const { validateEmail, validatePassword, mergeValidationResults } = require('../../shared/validators');
const { v4: uuidv4 } = require('uuid');

class AuthService {
  constructor(userRepository, kvService) {
    this.userRepository = userRepository;
    this.kvService = kvService;
  }

  async signup(email, password, name) {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const result = mergeValidationResults(emailValidation, passwordValidation);

    if (!result.isValid()) {
      const errors = result.getErrors();
      throw new Error(`Validation failed: ${errors.map((e) => e.message).join(', ')}`);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const userId = `user_${uuidv4()}`;
    const passwordHash = await hashPassword(password);

    const user = await this.userRepository.create({
      id: userId,
      email,
      name,
    });

    await this.userRepository.updatePasswordHash(userId, passwordHash);

    const token = await generateJWT({ userId, email }, process.env.JWT_SECRET || 'dev-secret', 86400);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expiresIn: 86400,
    };
  }

  async login(email, password) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid()) {
      throw new Error('Invalid email format');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordHash = await this.userRepository.getPasswordHash(user.id);
    const isPasswordValid = await comparePasswords(password, passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = await generateJWT({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', 86400);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expiresIn: 86400,
    };
  }

  async verifyToken(token) {
    const { verifyJWT } = require('../utils/jwt');
    const payload = await verifyJWT(token, process.env.JWT_SECRET || 'dev-secret');

    if (!payload) {
      return null;
    }

    const user = await this.userRepository.findById(payload.userId);
    return user;
  }

  async logout(userId) {
    await this.kvService.deleteToken(userId);
  }
}

module.exports = AuthService;
