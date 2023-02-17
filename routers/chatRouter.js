const express = require("express");
const { accessChat, fetchChats } = require("../controllers/chatController");

const { requireSignin } = require("../functions/middleware");

const router = express.Router();

router.route("/").post(requireSignin, accessChat);
router.route("/").get(requireSignin, fetchChats);
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
