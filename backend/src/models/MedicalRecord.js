const pool = require('../config/database');

/**
 * Model for the medical_records table.
 */
const MedicalRecord = {
  /**
   * Inserts a new medical record.
   * @param {number} ownerId - ID of the authenticated owner
   * @param {import('../dtos/medicalRecord.dto').CreateMedicalRecordDto} dto
   * @returns {Promise<import('pg').QueryResult>} Result containing the new record's id
   */
  create: (ownerId, { petName, petType, petSize, ownerName, description }) =>
    pool.query(
      'INSERT INTO medical_records (owner_id, pet_name, pet_type, pet_size, owner_name, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [ownerId, petName, petType, petSize, ownerName, description || '']
    ),

  /**
   * Returns all medical records belonging to an owner, ordered by creation date.
   * @param {number} ownerId
   * @returns {Promise<import('pg').QueryResult>}
   */
  findAllByOwner: (ownerId) =>
    pool.query(
      'SELECT * FROM medical_records WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId]
    ),

  /**
   * Returns a single medical record by id, scoped to the owner.
   * @param {number} id - Medical record ID
   * @param {number} ownerId - ID of the authenticated owner
   * @returns {Promise<import('pg').QueryResult>}
   */
  findById: (id, ownerId) =>
    pool.query(
      'SELECT * FROM medical_records WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    ),

  /**
   * Updates the fields of an existing medical record.
   * @param {number} id - Medical record ID
   * @param {import('../dtos/medicalRecord.dto').UpdateMedicalRecordDto} dto
   * @returns {Promise<import('pg').QueryResult>}
   */
  update: (id, { petName, petType, petSize, ownerName, description }) =>
    pool.query(
      'UPDATE medical_records SET pet_name = $1, pet_type = $2, pet_size = $3, owner_name = $4, description = $5 WHERE id = $6',
      [petName, petType, petSize, ownerName, description || '', id]
    ),

  /**
   * Deletes a medical record by id.
   * @param {number} id - Medical record ID
   * @returns {Promise<import('pg').QueryResult>}
   */
  delete: (id) =>
    pool.query('DELETE FROM medical_records WHERE id = $1', [id]),
};

module.exports = MedicalRecord;
