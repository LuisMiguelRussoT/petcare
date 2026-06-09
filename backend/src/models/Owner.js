const pool = require('../config/database');

const Owner = {
  findByEmail: (email) =>
    pool.query('SELECT * FROM owners WHERE email = $1', [email]),

  create: (name, email, hashedPassword) =>
    pool.query(
      'INSERT INTO owners (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    ),
};

module.exports = Owner;
