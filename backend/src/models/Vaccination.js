const pool = require('../config/database');

/**
 * Model for the vaccinations table.
 */
const Vaccination = {
  /**
   * Inserts a new vaccination linked to a medical record.
   * @param {number} recordId - ID of the parent medical record
   * @param {object} vac
   * @param {number|null} vac.number - Vaccination number/dose
   * @param {string} vac.type - Vaccine name or type
   * @param {string|null} vac.date - Date of vaccination (ISO format)
   * @returns {Promise<object>}
   */
  create: (recordId, { number, type, date }) =>
    pool.query(
      'INSERT INTO vaccinations (medical_record_id, vaccination_number, vaccination_type, vaccination_date) VALUES ($1, $2, $3, $4)',
      [recordId, number || null, type || '', date || null]
    ),

  /**
   * Returns all vaccinations for a given medical record.
   * @param {number} recordId - ID of the parent medical record
   * @returns {Promise<object>}
   */
  findByRecordId: (recordId) =>
    pool.query(
      'SELECT * FROM vaccinations WHERE medical_record_id = $1',
      [recordId]
    ),

  /**
   * Deletes all vaccinations for a given medical record.
   * Used before re-inserting updated vaccinations.
   * @param {number} recordId - ID of the parent medical record
   * @returns {Promise<object>}
   */
  deleteByRecordId: (recordId) =>
    pool.query('DELETE FROM vaccinations WHERE medical_record_id = $1', [recordId]),
};

module.exports = Vaccination;
