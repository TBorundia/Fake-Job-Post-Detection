const mongoose = require('mongoose');

const jobAnalysisSchema = new mongoose.Schema({
  url: String,
  jobPost: String,
  platform: String,
  hasLogo: Boolean,
  experience: String,
  education: String,
  employment: String,
  hasQuestion: Boolean,
  fraudulent: Boolean,
  analysisDate: { type: Date, default: Date.now },
  userIP: String,
  userAgent: String
});

module.exports = mongoose.model('JobAnalysis', jobAnalysisSchema);