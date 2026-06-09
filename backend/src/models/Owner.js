const pool = require('../config/database');

/**
 * Model for the owners table.
 */
const Owner = {
  /**
   * Finds an owner by email address.
   * @param {string} email
   * @returns {Promise<import('pg').QueryResult>}
   */
  findByEmail: (email) =>
    pool.query('SELECT * FROM owners WHERE email = $1', [email]),

  /**
   * Inserts a new owner into the database.
   * @param {string} name
   * @param {string} email
   * @param {string} hashedPassword - Bcrypt hashed password
   * @returns {Promise<import('pg').QueryResult>}
   */
  create: (name, email, hashedPassword) =>
    pool.query(
      'INSERT INTO owners (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    ),
};

module.exports = Owner;
