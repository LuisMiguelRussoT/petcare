const pool = require('../config/database');

const Vaccination = {
  create: (recordId, { number, type, date }) =>
    pool.query(
      'INSERT INTO vaccinations (medical_record_id, vaccination_number, vaccination_type, vaccination_date) VALUES ($1, $2, $3, $4)',
      [recordId, number || null, type || '', date || null]
    ),

  findByRecordId: (recordId) =>
    pool.query(
      'SELECT * FROM vaccinations WHERE medical_record_id = $1',
      [recordId]
    ),

  deleteByRecordId: (recordId) =>
    pool.query('DELETE FROM vaccinations WHERE medical_record_id = $1', [recordId]),
};

module.exports = Vaccination;
