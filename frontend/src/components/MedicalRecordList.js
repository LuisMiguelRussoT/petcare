import React from 'react';

const MedicalRecordList = ({ records, onEdit, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          No medical records found. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Owner Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Vaccinations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.pet_name}</td>
              <td>{record.owner_name}</td>
              <td>{record.pet_type}</td>
              <td>{record.pet_size}</td>
              <td>{record.vaccinations?.length || 0}</td>
              <td>
                <button
                  onClick={() => onEdit(record)}
                  className="btn-secondary btn-small"
                  style={{ marginRight: '0.5rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(record.id)}
                  className="btn-danger btn-small"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecordList;
