const express = require("express");
const router = express.Router();
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const {protect} = require("../middileware/authMiddleware");
router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser);
router.route('/api/chat')

module.exports = router;
