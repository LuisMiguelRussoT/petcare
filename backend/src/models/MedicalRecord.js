const pool = require('../config/database');

const MedicalRecord = {
  create: (ownerId, { petName, petType, petSize, ownerName, description }) =>
    pool.query(
      'INSERT INTO medical_records (owner_id, pet_name, pet_type, pet_size, owner_name, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [ownerId, petName, petType, petSize, ownerName, description || '']
    ),

  findAllByOwner: (ownerId) =>
    pool.query(
      'SELECT * FROM medical_records WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId]
    ),

  findById: (id, ownerId) =>
    pool.query(
      'SELECT * FROM medical_records WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    ),

  update: (id, { petName, petType, petSize, ownerName, description }) =>
    pool.query(
      'UPDATE medical_records SET pet_name = $1, pet_type = $2, pet_size = $3, owner_name = $4, description = $5 WHERE id = $6',
      [petName, petType, petSize, ownerName, description || '', id]
    ),

  delete: (id) =>
    pool.query('DELETE FROM medical_records WHERE id = $1', [id]),
};

module.exports = MedicalRecord;
