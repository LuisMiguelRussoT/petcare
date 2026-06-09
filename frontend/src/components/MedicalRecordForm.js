import React, { useState, useEffect } from 'react';

const MedicalRecordForm = ({ record, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'Dog',
    petSize: 'Medium',
    ownerName: '',
    description: '',
    vaccinations: [],
  });

  useEffect(() => {
    if (record) {
      setFormData({
        petName: record.pet_name,
        petType: record.pet_type,
        petSize: record.pet_size,
        ownerName: record.owner_name,
        description: record.description || '',
        vaccinations: record.vaccinations || [],
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVaccinationChange = (index, field, value) => {
    const updatedVaccinations = [...formData.vaccinations];
    updatedVaccinations[index] = {
      ...updatedVaccinations[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      vaccinations: updatedVaccinations,
    }));
  };

  const addVaccination = () => {
    setFormData((prev) => ({
      ...prev,
      vaccinations: [...prev.vaccinations, { number: '', type: '', date: '' }],
    }));
  };

  const removeVaccination = (index) => {
    setFormData((prev) => ({
      ...prev,
      vaccinations: prev.vaccinations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card">
      <h2>{record ? 'Edit Medical Record' : 'New Medical Record'}</h2>

      <form onSubmit={handleSubmit}>
        {/* Pet Owner Name */}
        <div className="form-group">
          <label>Pet Owner Name: *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Pet Name */}
        <div className="form-group">
          <label>Pet Name: *</label>
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Pet Type */}
        <div className="form-group">
          <label>Pet Type: *</label>
          <select
            name="petType"
            value={formData.petType}
            onChange={handleChange}
            required
          >
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Pet Size */}
        <div className="form-group">
          <label>Pet Size: *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="petSize"
                value="Small"
                checked={formData.petSize === 'Small'}
                onChange={handleChange}
              />
              Small
            </label>
            <label>
              <input
                type="radio"
                name="petSize"
                value="Medium"
                checked={formData.petSize === 'Medium'}
                onChange={handleChange}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                name="petSize"
                value="Big"
                checked={formData.petSize === 'Big'}
                onChange={handleChange}
              />
              Big
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter medical observations, health notes, etc."
          ></textarea>
        </div>

        {/* Vaccinations */}
        <div className="form-group">
          <label>Vaccinations:</label>
          {formData.vaccinations.map((vac, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e0e0e0',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
              }}
            >
              <div className="form-group">
                <label>Vaccination Number:</label>
                <input
                  type="number"
                  value={vac.number || ''}
                  onChange={(e) =>
                    handleVaccinationChange(index, 'number', e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Vaccination Type:</label>
                <input
                  type="text"
                  value={vac.type || ''}
                  onChange={(e) =>
                    handleVaccinationChange(index, 'type', e.target.value)
                  }
                  placeholder="e.g., Rabies, DHPP"
                />
              </div>
              <div className="form-group">
                <label>Vaccination Date:</label>
                <input
                  type="date"
                  value={vac.date || ''}
                  onChange={(e) =>
                    handleVaccinationChange(index, 'date', e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeVaccination(index)}
                className="btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVaccination}
            className="btn-secondary"
          >
            + Add Vaccination
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit">
            {record ? 'Update Record' : 'Create Record'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;
