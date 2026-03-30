import mongoose from 'mongoose';
import Report from '../models/Report.js';

export const createReport = async (req, res, next) => {
  try {
    const { incidentType, description, latitude, longitude, locationName, image } = req.body;

    if (!incidentType || !description || latitude == null || longitude == null || !locationName) {
      return res.status(400).json({
        message: 'incidentType, description, latitude, longitude, and locationName are required.',
      });
    }

    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }

    const report = await Report.create({
      userId: req.user.id,
      incidentType,
      description,
      latitude,
      longitude,
      locationName,
      image,
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }

    const reports = await Report.find().populate('userId', 'name email role').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const getUserReports = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }

    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const markReportReviewed = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    report.status = 'Reviewed';
    await report.save();

    res.json(report);
  } catch (error) {
    next(error);
  }
};
