/**
 * DTO for creating a new medical record.
 */
class CreateMedicalRecordDto {
  /**
   * @param {object} body
   * @param {string} body.petName - Name of the pet
   * @param {string} body.petType - Type/species of the pet
   * @param {string} body.petSize - Size of the pet (e.g. small, medium, large)
   * @param {string} body.ownerName - Name of the pet owner
   * @param {string} [body.description] - Optional medical notes
   * @param {object[]} [body.vaccinations] - List of vaccinations
   */
  constructor({ petName, petType, petSize, ownerName, description, vaccinations }) {
    this.petName = petName;
    this.petType = petType;
    this.petSize = petSize;
    this.ownerName = ownerName;
    this.description = description || '';
    this.vaccinations = Array.isArray(vaccinations) ? vaccinations : [];
  }

  /**
   * Returns true if all required fields are present.
   * @returns {boolean}
   */
  isValid() {
    return !!(this.petName && this.petType && this.petSize && this.ownerName);
  }

  /**
   * Creates a CreateMedicalRecordDto from an Express request body.
   * @param {object} body - req.body
   * @returns {CreateMedicalRecordDto}
   */
  static fromBody(body) {
    return new CreateMedicalRecordDto(body);
  }
}

/**
 * DTO for updating an existing medical record.
 * Vaccinations are replaced entirely if provided; omitting them leaves them unchanged.
 */
class UpdateMedicalRecordDto {
  /**
   * @param {object} body
   * @param {string} body.petName - Name of the pet
   * @param {string} body.petType - Type/species of the pet
   * @param {string} body.petSize - Size of the pet
   * @param {string} body.ownerName - Name of the pet owner
   * @param {string} [body.description] - Optional medical notes
   * @param {object[]|null} [body.vaccinations] - Replaces existing vaccinations; null means no update
   */
  constructor({ petName, petType, petSize, ownerName, description, vaccinations }) {
    this.petName = petName;
    this.petType = petType;
    this.petSize = petSize;
    this.ownerName = ownerName;
    this.description = description || '';
    this.vaccinations = Array.isArray(vaccinations) ? vaccinations : null;
  }

  /**
   * Creates an UpdateMedicalRecordDto from an Express request body.
   * @param {object} body - req.body
   * @returns {UpdateMedicalRecordDto}
   */
  static fromBody(body) {
    return new UpdateMedicalRecordDto(body);
  }
}

module.exports = { CreateMedicalRecordDto, UpdateMedicalRecordDto };
