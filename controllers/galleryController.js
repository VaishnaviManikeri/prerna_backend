const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const galleryItem = new Gallery({
      title,
      description,
      category,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;

    if (req.file) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }
      item.imageUrl = req.file.path;
      item.imagePublicId = req.file.filename;
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createGalleryItem, getAllGalleryItems, updateGalleryItem, deleteGalleryItem };