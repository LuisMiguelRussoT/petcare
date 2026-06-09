const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: Pet medical records management
 */

/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Create a new medical record
 *     tags: [Medical Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [petName, petType, petSize, ownerName]
 *             properties:
 *               petName:
 *                 type: string
 *               petType:
 *                 type: string
 *               petSize:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               description:
 *                 type: string
 *               vaccinations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     number:
 *                       type: integer
 *                     type:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *     responses:
 *       201:
 *         description: Medical record created
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /api/medical-records:
 *   get:
 *     summary: Get all medical records for the authenticated user
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: List of medical records
 */

/**
 * @swagger
 * /api/medical-records/{id}:
 *   get:
 *     summary: Get a single medical record by ID
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medical record found
 *       404:
 *         description: Medical record not found
 */

/**
 * @swagger
 * /api/medical-records/{id}:
 *   put:
 *     summary: Update a medical record
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petName:
 *                 type: string
 *               petType:
 *                 type: string
 *               petSize:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               description:
 *                 type: string
 *               vaccinations:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Medical record updated
 *       404:
 *         description: Medical record not found
 */

/**
 * @swagger
 * /api/medical-records/{id}:
 *   delete:
 *     summary: Delete a medical record
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medical record deleted
 *       404:
 *         description: Medical record not found
 */

// All routes require authentication
router.use(authenticateToken);

router.post('/', medicalRecordController.createMedicalRecord);
router.get('/', medicalRecordController.getMedicalRecords);
router.get('/:id', medicalRecordController.getMedicalRecord);
router.put('/:id', medicalRecordController.updateMedicalRecord);
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

module.exports = router;
