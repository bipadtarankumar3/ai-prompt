const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes
router.get('/', blogController.getAll);
router.get('/slug/:slug', blogController.getBySlug);

// Admin-only CRUD routes
router.post('/admin', authMiddleware, blogController.create);
router.get('/admin/:id', authMiddleware, blogController.getById);
router.put('/admin/:id', authMiddleware, blogController.update);
router.delete('/admin/:id', authMiddleware, blogController.delete);

// Admin-only image upload route
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return relative path, host-agnostic
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
