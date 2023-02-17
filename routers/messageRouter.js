const express = require("express");
const { allMessages, sendMessage } = require("../controllers/messageControler");

const { requireSignin } = require("../functions/middleware");

const router = express.Router();

router.route("/message/:chatId").get(requireSignin, allMessages);
router.route("/message").post(requireSignin, sendMessage);

module.exports = router;
