const mongoose = require('mongoose');

const componentTrackSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    variant: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

componentTrackSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.ComponentTrack ||
  mongoose.model('ComponentTrack', componentTrackSchema);
