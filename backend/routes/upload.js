const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
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
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // raw 2D array
    const rowCount = data.length;
    const columnCount = data[0]?.length || 0;

    const fileSizeKB = parseFloat((req.file.size / 1024).toFixed(2));

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyUploaded = user.excelRecords.some(
      (record) => record.filename === req.file.filename
    );

    // Always delete the file after processing
    // fs.unlinkSync(filePath);

    if (alreadyUploaded) {
      return res.status(200).json({
        message: 'File already uploaded previously. Ignoring DB insertion.',
        filename: req.file.filename,
        fileSize: fileSizeKB + ' KB',
        uploaderEmail: email,
        rowCount,
        columnCount
      });
    }

    // Only add to DB if it's a new file
    user.excelRecords.push({
  uploaderEmail: email,
  filename: req.file.filename,
  filesize: fileSizeKB,
  data: data,
  rows: rowCount,
  columns: columnCount,
  uploadedBy: userId,
  uploadedAt: new Date()
});

    await user.save();

    res.status(200).json({
      message: 'File uploaded and saved to user document',
      filename: req.file.filename,
      fileSize: fileSizeKB + ' KB',
      data: data, // raw 2D array
      uploaderEmail: email,
      rowCount,
      columnCount
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({
      message: 'Error processing file',
      error: error.message,
    });
  }
});

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // token gives id as 'id', not '_id'
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User chartRecords:", user.chartRecords);

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      records: user.excelRecords.map(record => {
        const chartsLinked = user.chartRecords.filter(
          chart =>
            chart.fromExcelFile?.toLowerCase().trim() ===
            record.filename?.toLowerCase().trim()
        ).length;
        
        return {
          id: record._id,
          filename: record.filename,
          filesize: record.filesize + ' KB',
          uploadedAt: record.uploadedAt,
          rows: record.rows,
          columns: record.columns,
          charts: chartsLinked, 
        };
      })
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

module.exports = router;
