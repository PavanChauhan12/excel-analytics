const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const ExcelRecord = require('../models/ExcelRecord');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../multerConfig');

router.post('/upload', verifyToken, upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded or invalid format.');

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const newRecord = new ExcelRecord({
      user: req.user._id,
      filename: req.file.filename,
      data: jsonData,
    });
    await newRecord.save();

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'File uploaded and processed successfully',
      recordId: newRecord._id,
      rowCount: jsonData.length,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({
      message: 'Error processing file',
      error: error.message,
  });
  }
});

router.get('/record/:id', verifyToken, async (req, res) => {
  try {
    const record = await ExcelRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    res.status(200).json({
      message: 'Record fetched successfully',
      data: record.data,
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ message: 'Error fetching record', error: error.message });
  }
});

module.exports = router;
