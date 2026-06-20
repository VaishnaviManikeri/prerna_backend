const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createCareer,
  getAllCareers,
  updateCareer,
  deleteCareer,
} = require('../controllers/careerController');

// Make sure authMiddleware is applied correctly
router.post('/', authMiddleware, createCareer);
router.get('/', getAllCareers);
router.put('/:id', authMiddleware, updateCareer);
router.delete('/:id', authMiddleware, deleteCareer);

module.exports = router;