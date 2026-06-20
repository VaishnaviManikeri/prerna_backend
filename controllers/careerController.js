const Career = require('../models/Career');

const createCareer = async (req, res) => {
  try {
    const { title, department, location, type, description, requirements, salary, isActive } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required fields' });
    }
    
    // Parse requirements if it's a string
    let parsedRequirements = requirements;
    if (typeof requirements === 'string') {
      try {
        parsedRequirements = JSON.parse(requirements);
      } catch (e) {
        // If it's not valid JSON, treat it as a string or split by newlines
        parsedRequirements = requirements.split('\n').filter(r => r.trim());
      }
    }
    
    const career = new Career({
      title,
      department: department || '',
      location: location || '',
      type: type || 'Full-time',
      description,
      requirements: Array.isArray(parsedRequirements) ? parsedRequirements : [],
      salary: salary || '',
      isActive: isActive !== undefined ? isActive : true,
    });
    
    await career.save();
    res.status(201).json(career);
  } catch (error) {
    console.error('Create career error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    console.error('Get careers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Parse requirements if it's a string
    if (updateData.requirements && typeof updateData.requirements === 'string') {
      try {
        updateData.requirements = JSON.parse(updateData.requirements);
      } catch (e) {
        updateData.requirements = updateData.requirements.split('\n').filter(r => r.trim());
      }
    }
    
    const career = await Career.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json(career);
  } catch (error) {
    console.error('Update career error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findByIdAndDelete(id);
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Delete career error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCareer, getAllCareers, updateCareer, deleteCareer };