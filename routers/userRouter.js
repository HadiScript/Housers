const express = require("express");
const {
  signup,
  signin,
  currentUser,
  createUser,
  users,
  usersAdmin,
  deleteUser,
  getUser,
  currentUserProfile,
  updateUserByUser,
  updateUserByAdmin,
  usersSubscriber,
  usersVendors,
  requestedUsers,
  updateComfirmation,
  Apply,
  vendorServices,
} = require("../controllers/useController");
const { isAdmin, requireSignin, isVendor } = require("../functions/middleware");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    data: "hello world from kaloraat auth API",
  });
});
router.post("/signup", signup);
router.post("/signin", signin);

router.get("/current-admin", requireSignin, isAdmin, currentUser);
router.get("/current-vendor", requireSignin, isVendor, currentUser);
router.get("/current-client", requireSignin, currentUser);

router.post("/create-user", requireSignin, isAdmin, createUser);
router.get("/requested-user", requireSignin, isAdmin, requestedUsers);

router.get("/users",  users);
router.get("/vendors",  usersVendors);
router.get("/current-vendor-profile/:userId", currentUserProfile)
router.get("/vendors-services/:id",  vendorServices);
router.get("/users-admins", requireSignin, isAdmin, usersAdmin);
router.get("/users-subscriber", requireSignin, isAdmin, usersSubscriber);
router.get("/users-vendor", requireSignin, isAdmin, usersVendors);
router.delete("/user/:userId", requireSignin, isAdmin, deleteUser);

router.get("/user/:userId", requireSignin, getUser);
router.get("/user/:userId", requireSignin, currentUserProfile);

router.put("/update-user-by-user", requireSignin, updateUserByUser);
router.put("/apply", requireSignin, Apply);
router.put("/update-user-by-admin", requireSignin, isAdmin, updateUserByAdmin);
router.put("/update-user-by-admin-confirm", requireSignin, isAdmin, updateComfirmation);
// update-user-by-admin-confirm


module.exports = router;
