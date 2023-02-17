const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const {
  uploadImageFile,
  uploadImage,
  createService,
  media,
  removeMedia,
  gettingAllServices,
  editService,
  singleService,
  MyServices,
  filteredServices,
  AllAgency,
  LikeService,
  UnlikeService,
  MyLikes,
  removePost,
} = require("../controllers/serviceController");
const {
  requireSignin,
  canCreateRead,
  isAdmin,
  canUpdateDeleteService,
} = require("../functions/middleware");

router.post("/upload-image", requireSignin, canCreateRead, uploadImage);
router.post(
  "/upload-image-file",
  formidable(),
  requireSignin,
  // canCreateRead,
  uploadImageFile
);

router.post("/filtered/services", filteredServices);

router.post("/create-service", requireSignin, canCreateRead, createService);
router.get("/services", gettingAllServices);
// router.get("/posts/:page", postsPage);
// router.get("/post-count", postCount);
router.get("/service/:Id", singleService);
router.delete("/service/:postId", requireSignin, canUpdateDeleteService, removePost);
router.put(
  "/edit-service/:Id",
  requireSignin,
  canUpdateDeleteService,
  editService
);
router.get("/my-services", requireSignin, MyServices);

// // media
router.get("/media", requireSignin, canCreateRead, media);
router.delete("/media/:id", requireSignin, isAdmin, removeMedia);
// router.get("/numbers", getNumbers);

router.put(`/like`, requireSignin, LikeService);
router.put(`/unlike`, requireSignin, UnlikeService);
router.get(`/mylikes`, requireSignin, MyLikes);

router.get("/all-agency", AllAgency);

module.exports = router;
