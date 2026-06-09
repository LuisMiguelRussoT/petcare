const MedicalRecord = require('../models/MedicalRecord');
const Vaccination = require('../models/Vaccination');

// Create Medical Record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { petName, petType, petSize, ownerName, description, vaccinations } = req.body;
    const ownerId = req.user.id;

    if (!petName || !petType || !petSize || !ownerName) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const result = await MedicalRecord.create(ownerId, { petName, petType, petSize, ownerName, description });
    const recordId = result.rows[0].id;

    if (vaccinations && Array.isArray(vaccinations)) {
      for (const vac of vaccinations) {
        await Vaccination.create(recordId, vac);
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

    const result = await MedicalRecord.findAllByOwner(ownerId);
    const records = result.rows;

    for (const record of records) {
      const vacResult = await Vaccination.findByRecordId(record.id);
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

    const result = await MedicalRecord.findById(id, ownerId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    const record = result.rows[0];
    const vacResult = await Vaccination.findByRecordId(id);
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

    const result = await MedicalRecord.findById(id, ownerId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    await MedicalRecord.update(id, { petName, petType, petSize, ownerName, description });

    if (vaccinations && Array.isArray(vaccinations)) {
      await Vaccination.deleteByRecordId(id);
      for (const vac of vaccinations) {
        await Vaccination.create(id, vac);
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

    const result = await MedicalRecord.findById(id, ownerId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    await Vaccination.deleteByRecordId(id);
    await MedicalRecord.delete(id);

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medical record', error: error.message });
  }
};
