const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, author, metaTitle, metaDescription, tags, published } = req.body;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    let featuredImage = '';
    let imagePublicId = '';
    
    if (req.file) {
      featuredImage = req.file.path;
      imagePublicId = req.file.filename;
    }
    
    const wordCount = content.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / 200)} min read`;
    
    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      imagePublicId,
      author,
      readingTime,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      tags: tags ? JSON.parse(tags) : [],
      published: published === 'true',
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, published: true });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    if (updateData.content) {
      const wordCount = updateData.content.split(/\s+/).length;
      updateData.readingTime = `${Math.ceil(wordCount / 200)} min read`;
    }
    
    if (req.file) {
      const blog = await Blog.findById(id);
      if (blog && blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }
      updateData.featuredImage = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }
    
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }
    
    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBlog, getAllBlogs, getBlogBySlug, updateBlog, deleteBlog };