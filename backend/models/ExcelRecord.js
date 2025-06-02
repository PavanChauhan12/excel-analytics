const mongoose = require('mongoose');

const ExcelRecordSchema = new mongoose.Schema({
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
