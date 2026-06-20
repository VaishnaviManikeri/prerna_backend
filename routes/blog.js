const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/auth');
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

router.post('/', authMiddleware, upload.single('featuredImage'), createBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.put('/:id', authMiddleware, upload.single('featuredImage'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;