import React, { useState, useEffect } from 'react';
import { medicalRecordService } from '../services/api';
import MedicalRecordForm from '../components/MedicalRecordForm';
import MedicalRecordList from '../components/MedicalRecordList';

const DashboardPage = ({ user, onLogout }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getMedicalRecords();
      setRecords(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch records' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await medicalRecordService.updateMedicalRecord(editingRecord.id, formData);
        setMessage({ type: 'success', text: 'Medical record updated successfully' });
      } else {
        await medicalRecordService.createMedicalRecord(formData);
        setMessage({ type: 'success', text: 'Medical record created successfully' });
      }
      setShowForm(false);
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving record' });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await medicalRecordService.deleteMedicalRecord(id);
        setMessage({ type: 'success', text: 'Medical record deleted successfully' });
        fetchRecords();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete record' });
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🐾 ReWow Pet Care</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}!</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button
              onClick={() => setMessage('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                float: 'right',
              }}
            >
              ×
            </button>
          </div>
        )}

        {!showForm ? (
          <>
            <div className="card">
              <h2>Medical Records</h2>
              <button onClick={() => setShowForm(true)} className="btn-success">
                ➕ New Medical Record
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading medical records...</div>
            ) : (
              <MedicalRecordList
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <MedicalRecordForm
            record={editingRecord}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
