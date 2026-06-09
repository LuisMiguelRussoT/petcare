class RegisterDto {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  isValid() {
    return !!(this.name && this.email && this.password);
  }

  static fromBody(body) {
    return new RegisterDto(body);
  }
}

class LoginDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  isValid() {
    return !!(this.email && this.password);
  }

  static fromBody(body) {
    return new LoginDto(body);
  }
}

module.exports = { RegisterDto, LoginDto };
