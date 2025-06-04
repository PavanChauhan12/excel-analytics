const mongoose = require('mongoose');

const ExcelRecordSchema = new mongoose.Schema({
  uploaderEmail: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  filesize: {
    type: Number,
    required: true,
  },
  data: {
    type: Object, 
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ExcelRecord', ExcelRecordSchema);
