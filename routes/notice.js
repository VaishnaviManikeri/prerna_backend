const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

router.post('/', authMiddleware, createNotice);
router.get('/', getAllNotices);
router.put('/:id', authMiddleware, updateNotice);
router.delete('/:id', authMiddleware, deleteNotice);

module.exports = router;