-- Re Wow Pet Care Database Schema for PostgreSQL
-- Create Database
-- Note: You must create the database first using: CREATE DATABASE rewow_petcare;

-- Connect to the database first
\c rewow_petcare;

-- Create ENUM types
CREATE TYPE pet_type_enum AS ENUM ('Cat', 'Dog', 'Fish', 'Other');
CREATE TYPE pet_size_enum AS ENUM ('Small', 'Medium', 'Big');

-- Owners Table (Pet Owners)
CREATE TABLE IF NOT EXISTS owners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  owner_id INT NOT NULL,
  pet_name VARCHAR(100) NOT NULL,
  pet_type pet_type_enum NOT NULL,
  pet_size pet_size_enum NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

-- Vaccinations Table
CREATE TABLE IF NOT EXISTS vaccinations (
  id SERIAL PRIMARY KEY,
  medical_record_id INT NOT NULL,
  vaccination_number INT,
  vaccination_type VARCHAR(100),
  vaccination_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_owner_id ON medical_records(owner_id);
CREATE INDEX idx_medical_record_id ON vaccinations(medical_record_id);
CREATE INDEX idx_owner_email ON owners(email);
