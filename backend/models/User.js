const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  excelRecords: [{
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
      }
  }]
});

module.exports = mongoose.model('User', UserSchema);
