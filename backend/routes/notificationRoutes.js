const express = require("express");
const Notification = require("../models/notificationModel");
const { protect } = require("../middileware/authMiddleware");

const router = express.Router();

// Get notifications for a user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).populate("chat").sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notifications" });
  }
});

// Mark notification as read
router.put("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

module.exports = router;
