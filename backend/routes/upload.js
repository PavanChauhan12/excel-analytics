const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');

router.post('/upload', upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or invalid format.');
  }

  res.send({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path
  });
});

module.exports = router;
