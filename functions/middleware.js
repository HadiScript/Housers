const User = require("../models/userModel");
const expressJwt = require("express-jwt");
const serviceModal = require("../models/serviceModal");
require("dotenv").config();

// req.user = _id
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Admin") {
      return res.status(403).send("Unauhorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const isVendor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Vendor") {
      return res.status(403).send("Unauhorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const canCreateRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Vendor":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canUpdateDeleteService = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await serviceModal.findById(req.params.postId);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Vendor":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

// const canDeleteMedia = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const media = await Media.findById(req.params.id);
//     switch (user.role) {
//       case "Admin":
//         next();
//         break;
//       case "Author":
//         if (media.postedBy.toString() !== req.user._id.toString()) {
//           return res.status(403).send("Unauhorized");
//         } else {
//           next();
//         }
//         break;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports = {
  isAdmin,
  requireSignin,
  isVendor,
  canCreateRead,
  canUpdateDeleteService
};
