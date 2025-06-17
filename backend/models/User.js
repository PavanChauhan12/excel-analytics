const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String, sparse: true }, // Google OAuth ID
  profilePicture: { type: String }, // Google profile picture URL
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
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
      },
      rows: { type: Number}, 
      columns: { type: Number }
  }],
  chartRecords: [
  {
    chartType: { type: String },
    createdAt: { type: Date, default: Date.now },
    fromExcelFile: { type: String }, // optional: to link chart to a file
    chartConfig: { type: Object },   // optional: store chart config/options
  }
]
});

// Create index for unique email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);