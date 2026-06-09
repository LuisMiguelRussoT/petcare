class CreateMedicalRecordDto {
  constructor({ petName, petType, petSize, ownerName, description, vaccinations }) {
    this.petName = petName;
    this.petType = petType;
    this.petSize = petSize;
    this.ownerName = ownerName;
    this.description = description || '';
    this.vaccinations = Array.isArray(vaccinations) ? vaccinations : [];
  }

  isValid() {
    return !!(this.petName && this.petType && this.petSize && this.ownerName);
  }

  static fromBody(body) {
    return new CreateMedicalRecordDto(body);
  }
}

class UpdateMedicalRecordDto {
  constructor({ petName, petType, petSize, ownerName, description, vaccinations }) {
    this.petName = petName;
    this.petType = petType;
    this.petSize = petSize;
    this.ownerName = ownerName;
    this.description = description || '';
    this.vaccinations = Array.isArray(vaccinations) ? vaccinations : null;
  }

  static fromBody(body) {
    return new UpdateMedicalRecordDto(body);
  }
}

module.exports = { CreateMedicalRecordDto, UpdateMedicalRecordDto };
