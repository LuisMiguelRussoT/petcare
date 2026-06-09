const pool = require('../config/database');

// Create Medical Record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { petName, petType, petSize, ownerName, description, vaccinations } = req.body;
    const ownerId = req.user.id;

    if (!petName || !petType || !petSize || !ownerName) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create medical record
    const result = await pool.query(
      'INSERT INTO medical_records (owner_id, pet_name, pet_type, pet_size, owner_name, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [ownerId, petName, petType, petSize, ownerName, description || '']
    );

    const recordId = result.rows[0].id;

    // Insert vaccinations if provided
    if (vaccinations && Array.isArray(vaccinations)) {
      for (const vac of vaccinations) {
        await pool.query(
          'INSERT INTO vaccinations (medical_record_id, vaccination_number, vaccination_type, vaccination_date) VALUES ($1, $2, $3, $4)',
          [recordId, vac.number || null, vac.type || '', vac.date || null]
        );
      }
    }

    res.status(201).json({ id: recordId, message: 'Medical record created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating medical record', error: error.message });
  }
};

// Get all Medical Records for owner
exports.getMedicalRecords = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM medical_records WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId]
    );

    const records = result.rows;

    // Get vaccinations for each record
    for (let record of records) {
      const vacResult = await pool.query(
        'SELECT * FROM vaccinations WHERE medical_record_id = $1',
        [record.id]
      );
      record.vaccinations = vacResult.rows;
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records', error: error.message });
  }
};

// Get Single Medical Record
exports.getMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM medical_records WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    const record = result.rows[0];

    const vacResult = await pool.query(
      'SELECT * FROM vaccinations WHERE medical_record_id = $1',
      [id]
    );

    record.vaccinations = vacResult.rows;
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical record', error: error.message });
  }
};

// Update Medical Record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { petName, petType, petSize, ownerName, description, vaccinations } = req.body;
    const ownerId = req.user.id;

    // Verify ownership
    const result = await pool.query(
      'SELECT * FROM medical_records WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Update record
    await pool.query(
      'UPDATE medical_records SET pet_name = $1, pet_type = $2, pet_size = $3, owner_name = $4, description = $5 WHERE id = $6',
      [petName, petType, petSize, ownerName, description || '', id]
    );

    // Update vaccinations if provided
    if (vaccinations && Array.isArray(vaccinations)) {
      // Delete existing vaccinations
      await pool.query('DELETE FROM vaccinations WHERE medical_record_id = $1', [id]);

      // Insert new vaccinations
      for (const vac of vaccinations) {
        await pool.query(
          'INSERT INTO vaccinations (medical_record_id, vaccination_number, vaccination_type, vaccination_date) VALUES ($1, $2, $3, $4)',
          [id, vac.number || null, vac.type || '', vac.date || null]
        );
      }
    }

    res.json({ message: 'Medical record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medical record', error: error.message });
  }
};

// Delete Medical Record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    // Verify ownership
    const result = await pool.query(
      'SELECT * FROM medical_records WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Delete vaccinations first (foreign key constraint)
    await pool.query('DELETE FROM vaccinations WHERE medical_record_id = $1', [id]);

    // Delete record
    await pool.query('DELETE FROM medical_records WHERE id = $1', [id]);

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medical record', error: error.message });
  }
};
