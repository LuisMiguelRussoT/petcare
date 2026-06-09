/**
 * DTO for user registration request.
 */
class RegisterDto {
  /**
   * @param {object} body
   * @param {string} body.name - Full name of the user
   * @param {string} body.email - Email address
   * @param {string} body.password - Plain text password
   */
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  /**
   * Returns true if all required fields are present.
   * @returns {boolean}
   */
  isValid() {
    return !!(this.name && this.email && this.password);
  }

  /**
   * Creates a RegisterDto from an Express request body.
   * @param {object} body - req.body
   * @returns {RegisterDto}
   */
  static fromBody(body) {
    return new RegisterDto(body);
  }
}

/**
 * DTO for user login request.
 */
class LoginDto {
  /**
   * @param {object} body
   * @param {string} body.email - Email address
   * @param {string} body.password - Plain text password
   */
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  /**
   * Returns true if all required fields are present.
   * @returns {boolean}
   */
  isValid() {
    return !!(this.email && this.password);
  }

  /**
   * Creates a LoginDto from an Express request body.
   * @param {object} body - req.body
   * @returns {LoginDto}
   */
  static fromBody(body) {
    return new LoginDto(body);
  }
}

module.exports = { RegisterDto, LoginDto };
