const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
// const ExcelRecord = require('../models/ExcelRecord');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../multerConfig');

router.post('/upload', verifyToken, upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded or invalid format.');

    const email = req.user?.email;
    const userId = req.user?.id;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Invalid user token' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const fileSizeKB = parseFloat((req.file.size / 1024).toFixed(2));

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.excelRecords.push({
      uploaderEmail: email,
      filename: req.file.filename,
      filesize: fileSizeKB,
      data: jsonData,
      uploadedBy: userId
    });
    await user.save();

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'File uploaded and saved to user document',
      filename: req.file.filename,
      fileSize: fileSizeKB + ' KB',
      uploaderEmail: email,
      rowCount: jsonData.length
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
    const recordId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const record = user.excelRecords.id(recordId); // find record by its _id

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({
      message: 'Record fetched successfully',
      data: record.data,
      filename: record.filename,
      fileSize: record.filesize + ' KB',
      uploadedAt: record.uploadedAt,
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ message: 'Error fetching record', error: error.message });
  }
});


module.exports = router;
