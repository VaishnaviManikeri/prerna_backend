const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/auth');
const {
  createGalleryItem,
  getAllGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

router.post('/', authMiddleware, upload.single('image'), createGalleryItem);
router.get('/', getAllGalleryItems);
router.put('/:id', authMiddleware, upload.single('image'), updateGalleryItem);
router.delete('/:id', authMiddleware, deleteGalleryItem);

module.exports = router;