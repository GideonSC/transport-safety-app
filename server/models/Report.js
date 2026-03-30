import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    incidentType: {
      type: String,
      required: [true, 'Incident type is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    locationName: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
